from fastapi import Depends, HTTPException, Security
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy import or_
from sqlalchemy.orm import Session
from db.connection import get_db
from . import models
from .hashing import Hasher
from core.timezone import get_local_timezone
import jwt
from fastapi.security.api_key import APIKeyHeader

local_timezone = get_local_timezone()

security = APIKeyHeader(name='Authorization')

SECRET_KEY = "1874631815d5d1fa0dd80d3bf86ba5f6c47c3758409b15c17b88a7acc115b77b"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def authenticate_user(
        email_or_phone_number: str, 
        password: str, 
        db: Session = Depends(get_db)
    )-> Optional[models.AuthUser]:
    
	is_email_format = '@' in email_or_phone_number


	user = db.query(models.AuthUser).filter(
				or_(
					(models.AuthUser.email == email_or_phone_number) if is_email_format else False,
					(models.AuthUser.phone_number == email_or_phone_number) if not is_email_format else False
				)
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

def get_authenticated_user(
        authorization: str = Security(security),
        db: Session = Depends(get_db)
    ) -> models.AuthUser:
    try:
        payload = jwt.decode(authorization, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication credentials"
            )

        user = db.query(models.AuthUser).filter(models.AuthUser.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=401,
                detail="User not found"
            )

        return user

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token has expired"
        )

    except jwt.DecodeError:
        raise HTTPException(
            status_code=401,
            detail="Token decode error"
        )

    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=401,
            detail="Authentication error"
        )