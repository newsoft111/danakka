from fastapi import APIRouter, Depends, HTTPException
from payment import models as PaymentModel
from auth import models as AuthModel
from sqlalchemy.orm import Session, joinedload, selectinload
from db.connection import get_db
from sqlalchemy import func
from pydantic import BaseModel, conint
from decimal import Decimal
from datetime import datetime, timedelta, date
from dateutil.relativedelta import relativedelta
from util.timezone import get_local_timezone
from auth.security import get_current_user_info
import requests


router = APIRouter()
local_timezone = get_local_timezone()
app_name = 'payment'
PORTONE_API_KEY = 'ZgmeM5criaKg0tOjVTjjeXwlvbM3DqZu0WG3OPUn8hKSP3oTQYqTq9QdSywtmrXm2xuLZ38NJSnDnuWp'

class PaymentCreateBaseModel(BaseModel):
	token: str
	merchant_uid: str
	order_name: str
	total_amount: Decimal
	pay_method: str

@router.post(f"/api/{app_name}/create/")
async def payment_create(
		payment_create_base_model: PaymentCreateBaseModel,
		db: Session = Depends(get_db)
	):
	
	current_user = get_current_user_info(payment_create_base_model.token, db)
	if current_user["status_code"] != 200:
		raise HTTPException(
			status_code=current_user["status_code"],
			detail=current_user["detail"],
			headers={"WWW-Authenticate": "Bearer"},
		)


	# Retrieve user from the database based on user_id
	user = db.query(AuthModel.AuthUser).filter(AuthModel.AuthUser.id == current_user['user_id']).first()

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
		created_at=datetime.now(),
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

	if status != "PAID":
		raise HTTPException(status_code=400, detail="결제가 완료되지 않았음.")
	
	# Retrieve payment info from PortOne API
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
		raise HTTPException(status_code=400, detail="No primary transaction found")

	# Compare payment amount with transaction amount
	payment_obj = db.query(PaymentModel.Payment).filter(PaymentModel.Payment.merchant_uid == paymentId).first()

	if not payment_obj:
		raise HTTPException(status_code=404, detail="Invalid request.")

	if payment_obj.total_amount == transaction["amount"]["total"]:
		payment_obj.is_paid = True
		db.commit()
		return {
			"status_code": 200,
			"detail": "Payment post-processing completed.",
		}
	else:
		raise HTTPException(status_code=400, detail="Payment amount mismatch.")

