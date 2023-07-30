from sqlalchemy import Column, Text, Integer, String, ForeignKey, Boolean, Numeric, DateTime, func
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from util.timezone import get_local_timezone

local_timezone = get_local_timezone()
Base = declarative_base()

class AuthUser(Base):
	__tablename__ = "auth_user"

	id = Column(Integer, primary_key=True, index=True)
	email = Column(String)
	nickname = Column(String)
	phone_number = Column(String, nullable=True)
	password = Column(String)
	created_at = Column(DateTime, default=datetime.now(local_timezone))

class AuthSms(Base):
	__tablename__ = "auth_sms"

	phone_number = Column(String, primary_key=True)
	verify_code = Column(Integer)