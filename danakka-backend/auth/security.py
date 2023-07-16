from fastapi import Depends
from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session
from db.connection import get_db
from . import models
from .hashing import Hasher
import jwt

SECRET_KEY = "1874631815d5d1fa0dd80d3bf86ba5f6c47c3758409b15c17b88a7acc115b77b"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


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
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
