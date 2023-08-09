from fastapi import APIRouter, Depends, HTTPException
from payment import models as PaymentModel
from auth import models as AuthModel
from sqlalchemy.orm import Session, joinedload, selectinload
from db.connection import get_db
from sqlalchemy import func
from pydantic import BaseModel, conint
from typing import List, Optional, Union
from datetime import datetime, timedelta, date
from dateutil.relativedelta import relativedelta
from util.timezone import get_local_timezone
from auth.security import authenticate_user, create_access_token, get_current_user_info

router = APIRouter()
local_timezone = get_local_timezone()
app_name = 'payment'


class PaymentCreateBaseModel(BaseModel):
	token: str
	payment_id: str
	order_name: str
	total_amount: str

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
		payment_uuid=payment_create_base_model.payment_id,
		order_name=payment_create_base_model.order_name,
		total_amount=payment_create_base_model.total_amount,
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
