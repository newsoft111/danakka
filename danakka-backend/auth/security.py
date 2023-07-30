from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session
from db.connection import get_db
from . import models
from .hashing import Hasher
from util.timezone import get_local_timezone
import jwt

local_timezone = get_local_timezone()

SECRET_KEY = "1874631815d5d1fa0dd80d3bf86ba5f6c47c3758409b15c17b88a7acc115b77b"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def authenticate_user(
        email_or_phone_number: str, 
        password: str, 
        db: Session = Depends(get_db)
    )-> Optional[models.AuthUser]:
    
    user = db.query(models.AuthUser).filter(
					models.AuthUser.phone_number if '@' in email_or_phone_number else models.AuthUser.email == email_or_phone_number,
			).first()
    if not user or not Hasher.verify_password(password, user.password):
        return None
    return user


def create_access_token(
        data: dict, 
        expires_delta: Optional[timedelta] = None
    ) -> str:
    
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(local_timezone) + expires_delta
    else:
        expire = datetime.now(local_timezone) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt



def get_current_user_info(
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(get_db)
    ):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return {
                "status_code":401,
                "detail":"Invalid authentication credentials"
			}
        
        user = db.query(models.AuthUser).filter(
                models.AuthUser.id == user_id,
        ).first()
        return {
			"status_code":200,
			"detail": {
                "email": user.email,
                "nickname": user.nickname,
                "phone_number":user.phone_number
            },
            "user_id": user_id
		}
    
    except jwt.ExpiredSignatureError:
        return {
			"status_code":401,
			"detail":"Token has expired"
		}
    
    except:
        return {
			"status_code":401,
			"detail":"알수없는 오류입니다."
		}