from fastapi import APIRouter, Depends, HTTPException, status
from .. import models
from sqlalchemy.orm import Session, joinedload, subqueryload, outerjoin, selectinload
from db.connection import get_db
from sqlalchemy import text, func, select
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta, date
from dateutil.relativedelta import relativedelta
from ..hashing import Hasher
from ..security import authenticate_user, create_access_token, get_current_user


router = APIRouter()

app_name = 'auth'

class AuthUserJoinBaseModel(BaseModel):
	email: str
	phone_number: int
	password: str
	password_check: str

@router.post(f"/api/{app_name}/join/")
async def auth_user_join(
		auth_user_join_base_model: AuthUserJoinBaseModel,
		db: Session = Depends(get_db)
	):
	auth_user_join_dict = auth_user_join_base_model.dict(exclude_unset=True)
	email = auth_user_join_dict['email']
	phone_number = auth_user_join_dict['phone_number']
	password = auth_user_join_dict['password']
	password_check = auth_user_join_dict['password_check']
    
	if password != password_check:
		return {"message": "비밀번호가 일치하지 않습니다."}

	# 중복 이메일 체크
	if db.query(models.AuthUser).filter_by(email = email).first():
		raise HTTPException(status_code=400, detail="이미 가입된 이메일 입니다.")

	# 비밀번호 해싱
	password_hash = Hasher.get_password_hash(password)

	# 새 사용자 생성
	new_user = models.AuthUser(
		email=email,
		phone_number=phone_number,
		password=password_hash,
	)
	db.add(new_user)
	db.commit()
	db.refresh(new_user)

	return {"message": "가입이 완료되었습니다!"}


class AuthUserLoginBaseModel(BaseModel):
	email_or_phone_number: str
	password: str

@router.post(f"/api/{app_name}/login/")
def auth_user_login(
		auth_user_login_base_model: AuthUserLoginBaseModel,
		db: Session = Depends(get_db)
	):
	email_or_phone_number = auth_user_login_base_model.email_or_phone_number
	password = auth_user_login_base_model.password

	# 사용자 인증
	auth_user = authenticate_user(email_or_phone_number, password, db)
	if not auth_user:
		raise HTTPException(status_code=401, detail="아이디(로그인 전용 아이디) 또는 비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해주세요.")

	# 액세스 토큰 생성
	access_token = create_access_token({"sub": auth_user.email})

	return {"access_token": access_token, "token_type": "bearer"}


class AuthUserVerifiTokenBaseModel(BaseModel):
	token: str

@router.post(f"/api/{app_name}/verify_token/")
def auth_user_verify_token(
		auth_user_verify_token_base_model: AuthUserVerifiTokenBaseModel
	):
	current_user = get_current_user(auth_user_verify_token_base_model.token)
	if current_user["status_code"] == 200:
		return {"user":current_user["detail"]}
	else:
		raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=current_user["detail"],
            headers={"WWW-Authenticate": "Bearer"},
        )