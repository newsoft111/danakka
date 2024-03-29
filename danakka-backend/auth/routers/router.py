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
from ..security import authenticate_user, create_access_token, get_authenticated_user
import random
import string
from util.sms_module import SmsSender
from util.email_module import EmailSender
from random import randint

router = APIRouter()

app_name = 'auth'

class AuthUserJoinBaseModel(BaseModel):
	email: str
	password: str
	password_check: str

@router.post(f"/api/{app_name}/join/")
async def auth_user_join(
		auth_user_join_base_model: AuthUserJoinBaseModel,
		db: Session = Depends(get_db)
	):
	auth_user_join_dict = auth_user_join_base_model.dict(exclude_unset=True)
	email = auth_user_join_dict['email']
	password = auth_user_join_dict['password']
	nickname = get_unique_nickname(db)
	password_check = auth_user_join_dict['password_check']
    
	if password != password_check:
		return {"message": "비밀번호가 일치하지 않습니다."}

	# 중복 이메일 체크
	if db.query(models.AuthUser).filter_by(email = email).first():
		raise HTTPException(status_code=400, detail="이미 가입된 이메일 입니다.")
	
	# 중복 닉네임 체크
	
		

	# 비밀번호 해싱
	password_hash = Hasher.get_password_hash(password)

	# 새 사용자 생성
	new_user = models.AuthUser(
		email=email,
		password=password_hash,
		nickname=nickname,
		auth_promotion_agreement=models.AuthPromotionAgreement()
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
		raise HTTPException(
			status_code=401, 
			detail="아이디(로그인 전용 아이디) 또는 비밀번호를 잘못 입력했습니다."
		)

	# 액세스 토큰 생성
	access_token = create_access_token({"sub": auth_user.id})

	return {"access_token": access_token, "token_type": "bearer"}



class AuthUserChangePasswordModel(BaseModel):
	current_password: str
	new_password: str
	new_password_check: str

@router.post(f"/api/{app_name}/change/password/")
def auth_user_change_password(
		auth_user_change_password_base_model: AuthUserChangePasswordModel,
		authorized_user: models.AuthUser = Depends(get_authenticated_user),
		db: Session = Depends(get_db)
	):

	current_password = auth_user_change_password_base_model.current_password
	new_password = auth_user_change_password_base_model.new_password
	new_password_check = auth_user_change_password_base_model.new_password_check

	
	if new_password != new_password_check:
		raise HTTPException(
			status_code=401, 
			detail="비밀번호가 일치하지 않습니다."
		)


	# 사용자 인증
	auth_user = authenticate_user(authorized_user.email, current_password, db)
	if not auth_user:
		raise HTTPException(
			status_code=401, 
			detail="비밀번호를 잘못 입력했습니다."
		)
	

	password_hash = Hasher.get_password_hash(new_password)

	# 사용자의 비밀번호 필드에 새로운 해시값 저장
	auth_user.password = password_hash

	# 데이터베이스에 변경 사항 반영
	db.commit()

	return {
		"status_code":200,
		"detail": "변경이 완료되었습니다.",
	}






@router.post(f"/api/{app_name}/verify_token/")
def auth_user_verify_token(
		authorized_user: models.AuthUser = Depends(get_authenticated_user),
	):
	return authorized_user
	


class AuthUserGetUserInfoBaseModel(BaseModel):
	needs_data: List[str]

@router.post(f"/api/{app_name}/get/user/info/")
def auth_user_get_user_info(
    auth_user_verify_token_base_model: AuthUserGetUserInfoBaseModel,
    authorized_user: models.AuthUser = Depends(get_authenticated_user),
    db: Session = Depends(get_db)
):
	needs_data = auth_user_verify_token_base_model.needs_data
	

	user_obj = db.query(models.AuthUser).filter(models.AuthUser.id == authorized_user.id).first()

	data_to_return = {data_key: getattr(user_obj, data_key, None) for data_key in needs_data}
	if 'promotion_agreement' in needs_data:
		data_to_return['promotion_agreement'] = {
			'phone_promotion_agreed': user_obj.auth_promotion_agreement.phone_promotion_agreed,
			'email_promotion_agreed': user_obj.auth_promotion_agreement.email_promotion_agreed,
		}
	return data_to_return



class AuthUserChangeNickname(BaseModel):
	nickname: str

@router.post(f"/api/{app_name}/change/nickname/")
def auth_user_change_nickname(
		auth_user_change_nickname_base_model: AuthUserChangeNickname,
		authorized_user: models.AuthUser = Depends(get_authenticated_user),
		db: Session = Depends(get_db)
	):
	nickname = auth_user_change_nickname_base_model.nickname

	

	if is_nickname_duplicate(nickname, db):
		raise HTTPException(
			status_code=409,
			detail="중복된 닉네임 입니다.",
			headers={"WWW-Authenticate": "Bearer"},
		)

	if nickname == '':
		raise HTTPException(
			status_code=422,
			detail="닉네임이 공란입니다.",
			headers={"WWW-Authenticate": "Bearer"},
		)
	
	user_obj = db.query(models.AuthUser).filter(models.AuthUser.id==authorized_user.id).first()
	user_obj.nickname = nickname
			

	db.commit()
	db.refresh(user_obj)
	
	return {
		"status_code":200,
		"detail": "변경이 완료되었습니다.",
	}




#전화번호변경
class AuthUserChangePhoneNumber(BaseModel):
	phone_number: str
	verify_code: int

@router.post(f"/api/{app_name}/change/phone_number/")
def auth_user_change_phone_number(
		auth_user_change_phone_number_base_model: AuthUserChangePhoneNumber,
		authorized_user: models.AuthUser = Depends(get_authenticated_user),
		db: Session = Depends(get_db)
	):
	phone_number = auth_user_change_phone_number_base_model.phone_number
	verify_code = auth_user_change_phone_number_base_model.verify_code


	auth_sms_obj = db.query(models.AuthSms).filter(models.AuthSms.phone_number==phone_number).first()
	if not auth_sms_obj:
		raise HTTPException(
			status_code=400,
			detail="잘못된 요청입니다",
			headers={"WWW-Authenticate": "Bearer"},
		)

	if auth_sms_obj.verify_code != verify_code:
		raise HTTPException(
			status_code=403,
			detail="인증번호가 옳바르지 않습니다.",
			headers={"WWW-Authenticate": "Bearer"},
		)
	
	user_obj = db.query(models.AuthUser).filter(models.AuthUser.id==authorized_user.id).first()
	user_obj.phone_number = phone_number
			

	db.commit()
	db.refresh(user_obj)
	
	return {
		"status_code":200,
		"detail": "변경이 완료되었습니다.",
	}


class AuthUserSendSms(BaseModel):
	phone_number: str

@router.post(f"/api/{app_name}/send/sms/")
def auth_user_send_sms(
		auth_user_send_sms_base_model: AuthUserSendSms,
		db: Session = Depends(get_db)
	):
	phone_number = auth_user_send_sms_base_model.phone_number

	verify_code = str(randint(100000, 999999))

	auth_sms_obj = db.query(models.AuthSms).filter(models.AuthSms.phone_number==phone_number).first()
	

	if auth_sms_obj:
		# 레코드가 존재하면 auth_number를 갱신하고 저장
		auth_sms_obj.verify_code = verify_code

	else:
		# 레코드가 존재하지 않으면 새로운 레코드 생성
		auth_sms_obj = models.AuthSms(phone_number=phone_number, verify_code=verify_code)
		db.add(auth_sms_obj)


	db.commit()
	db.refresh(auth_sms_obj)

	content = f'[다낚아]\n인증번호 [{verify_code}] 를 입력해주세요.'

	sms_sender = SmsSender(
		phone_number=phone_number,
		message_type=None, 
		content=content
	)

	if sms_sender.pushbullet():
		return {
			"status_code":200,
			"detail": "전송이 완료되었습니다.",
		}
	else:
		raise HTTPException(
			status_code=500,
			detail="요청에 실패했습니다.",
			headers={"WWW-Authenticate": "Bearer"},
		)



#이메일
class AuthUserChangeEmail(BaseModel):
	email: str
	verify_code: int

@router.post(f"/api/{app_name}/change/email/")
def auth_user_change_email(
		auth_user_change_email_base_model: AuthUserChangeEmail,
		authorized_user: models.AuthUser = Depends(get_authenticated_user),
		db: Session = Depends(get_db)
	):
	email = auth_user_change_email_base_model.email
	verify_code = auth_user_change_email_base_model.verify_code

	

	auth_email_obj = db.query(models.AuthEmail).filter(models.AuthEmail.email==email).first()
	if not auth_email_obj:
		raise HTTPException(
			status_code=400,
			detail="잘못된 요청입니다",
			headers={"WWW-Authenticate": "Bearer"},
		)

	if auth_email_obj.verify_code != verify_code:
		raise HTTPException(
			status_code=403,
			detail="인증번호가 옳바르지 않습니다.",
			headers={"WWW-Authenticate": "Bearer"},
		)
	
	user_obj = db.query(models.AuthUser).filter(models.AuthUser.id==authorized_user.id).first()
	user_obj.email = email
			

	db.commit()
	db.refresh(user_obj)
	
	return {
		"status_code":200,
		"detail": "변경이 완료되었습니다.",
	}


class AuthUserSendEmail(BaseModel):
	email: str

@router.post(f"/api/{app_name}/send/email/")
def auth_user_send_email(
		auth_user_send_sms_base_model: AuthUserSendEmail,
		db: Session = Depends(get_db)
	):
	email = auth_user_send_sms_base_model.email

	verify_code = str(randint(100000, 999999))

	auth_email_obj = db.query(models.AuthEmail).filter(models.AuthEmail.email==email).first()
	

	if auth_email_obj:
		# 레코드가 존재하면 auth_number를 갱신하고 저장
		auth_email_obj.verify_code = verify_code

	else:
		# 레코드가 존재하지 않으면 새로운 레코드 생성
		auth_email_obj = models.AuthEmail(email=email, verify_code=verify_code)
		db.add(auth_email_obj)


	db.commit()
	db.refresh(auth_email_obj)

	title = f'[다낚아] 이메일 인증을 완료해주세요.'
	content = f'[다낚아]\n인증번호 [{verify_code}] 를 입력해주세요.'

	email_sender = EmailSender(
		toEmail=email,
		title=title, 
		content=content
	)

	if email_sender.daum():
		return {
			"status_code":200,
			"detail": "전송이 완료되었습니다.",
		}
	else:
		raise HTTPException(
			status_code=500,
			detail="요청에 실패했습니다.",
			headers={"WWW-Authenticate": "Bearer"},
		)


class AuthUserUpdatePhonePromotionAgreed(BaseModel):
	phone_promotion_agreed: bool

@router.put(f"/api/{app_name}/update/promotion_agreed/phone/")
def auth_user_update_phone_promotion_agreed(
	auth_user_update_phone_promotion_agreed_base_model: AuthUserUpdatePhonePromotionAgreed,
	authorized_user: models.AuthUser = Depends(get_authenticated_user),
	db: Session = Depends(get_db)
):
	
	
	phone_promotion_agreed = auth_user_update_phone_promotion_agreed_base_model.phone_promotion_agreed

	user = db.query(models.AuthUser).filter(models.AuthUser.id == authorized_user.id).first()

	if not user:
		raise HTTPException(status_code=404, detail="User not found")

	user.auth_promotion_agreement.phone_promotion_agreed = phone_promotion_agreed

	db.commit()
	db.refresh(user)

	return user


class AuthUserUpdateEmailPromotionAgreed(BaseModel):
	email_promotion_agreed: bool

@router.put(f"/api/{app_name}/update/promotion_agreed/email/")
def auth_user_update_email_promotion_agreed(
	auth_user_update_email_promotion_agreed_base_model: AuthUserUpdateEmailPromotionAgreed,
	authorized_user: models.AuthUser = Depends(get_authenticated_user),
	db: Session = Depends(get_db)
):
	
	email_promotion_agreed = auth_user_update_email_promotion_agreed_base_model.email_promotion_agreed

	user = db.query(models.AuthUser).filter(models.AuthUser.id == authorized_user.id).first()

	if not user:
		raise HTTPException(status_code=404, detail="User not found")

	user.auth_promotion_agreement.email_promotion_agreed = email_promotion_agreed

	db.commit()
	db.refresh(user)

	return user



def generate_random_nickname():
    characters = string.ascii_letters + string.digits
    length = random.randint(5, 10)  # 5 ~ 9 글자 사이의 길이를 랜덤하게 선택 (10글자 미만)
    nickname = "user_" + ''.join(random.choice(characters) for _ in range(length))
    return nickname


def is_nickname_duplicate(nickname, db):
    return db.query(models.AuthUser).filter_by(nickname=nickname).first() is not None

def get_unique_nickname(db):
    while True:
        nickname = generate_random_nickname()
        if not is_nickname_duplicate(nickname, db):
            return nickname
	


