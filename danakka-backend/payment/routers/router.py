from fastapi import APIRouter, Depends, HTTPException, Header
from payment import models as PaymentModel
from auth import models as AuthModel
from sqlalchemy.orm import Session, joinedload, selectinload
from db.connection import get_db
from sqlalchemy import func
from pydantic import BaseModel, conint
from decimal import Decimal
from datetime import datetime, timedelta, date
from dateutil.relativedelta import relativedelta
from core.timezone import get_local_timezone
from auth.security import get_authenticated_user
import requests
import auth.models as AuthModels
from ticket.action import TicketAction
import json




router = APIRouter()
local_timezone = get_local_timezone()
app_name = 'payment'
PORTONE_API_KEY = 'ZgmeM5criaKg0tOjVTjjeXwlvbM3DqZu0WG3OPUn8hKSP3oTQYqTq9QdSywtmrXm2xuLZ38NJSnDnuWp'

class PaymentCreateBaseModel(BaseModel):
	merchant_uid: str
	order_name: str
	total_amount: Decimal
	pay_method: str

@router.post(f"/api/{app_name}/create/")
async def payment_create(
		payment_create_base_model: PaymentCreateBaseModel,
		authorized_user: AuthModels.AuthUser = Depends(get_authenticated_user),
		db: Session = Depends(get_db)
	):
	

	# Retrieve user from the database based on user_id
	user = db.query(AuthModel.AuthUser).filter(AuthModel.AuthUser.id == authorized_user.id).first()

	if not user:
		raise HTTPException(status_code=404, detail="유저를 찾을수 없습니다.")

	# Create a new Payment instance
	new_payment = PaymentModel.Payment(
		auth_user_id=user.id,
		merchant_uid=payment_create_base_model.merchant_uid,
		order_name=payment_create_base_model.order_name,
		total_amount=payment_create_base_model.total_amount,
		pay_method=payment_create_base_model.pay_method,
		is_paid=False,  # Payment is not paid yet
		created_at=datetime.now(local_timezone),
		paid_at=None  # Payment has not been paid yet
	)

	# Add the new_payment to the database and commit the transaction
	db.add(new_payment)
	db.commit()

	return {
		"status_code":200,
		"detail": "결제 전처리 완료.",
	}




class PaymentCompleteBaseModel(BaseModel):
	tx_id: str
	payment_id: str
	status: str

@router.post(f"/api/{app_name}/complete/")
async def payment_complete(
		payment_complete_base_model: PaymentCompleteBaseModel,
		db: Session = Depends(get_db)
	):
	

	paymentId = payment_complete_base_model.payment_id
	status = payment_complete_base_model.status

	if status != "Paid":
		raise HTTPException(status_code=400, detail="결제가 완료되지 않았음.")
	
	signin_response = requests.post(
		"https://api.portone.io/v2/signin/api-key",
		json={"api_key": PORTONE_API_KEY},
		headers={"Content-Type": "application/json"}
	)
	access_token = signin_response.json()["access_token"]

	payment_response = requests.get(
		f"https://api.portone.io/v2/payments/{paymentId}",
		headers={"Authorization": f"Bearer {access_token}"}
	)
	payment_data = payment_response.json()
	
	payment = payment_data["payment"]
	transactions = payment["transactions"]
	transaction = next((tx for tx in transactions if tx["is_primary"]), None)
	if transaction is None:
		print("No primary transaction found")
		raise HTTPException(status_code=400, detail="No primary transaction found")

	# Compare payment amount with transaction amount
	payment_obj = db.query(PaymentModel.Payment).filter(PaymentModel.Payment.merchant_uid == paymentId).first()

	if not payment_obj:
		raise HTTPException(status_code=404, detail="Invalid request.")

	if payment_obj.total_amount == transaction["amount"]["total"]:
		payment_obj.is_paid = True
		payment_obj.paid_at = datetime.now(local_timezone)

		
		custom_data=json.loads(transaction["custom_data"])

		if custom_data['referer'] == "ticket":
			ticket_action = TicketAction(db)
			ticket_action.purchase_ticket(
				payment_obj=payment_obj,
				authorized_user=payment_obj.auth_user,
				ticket_count=payment_obj.total_amount/100
			)

		db.commit()
		return {
			"status_code": 200,
			"detail": "Payment post-processing completed.",
		}
	else:
		print('Payment amount mismatch.')
		raise HTTPException(status_code=400, detail="Payment amount mismatch.")


