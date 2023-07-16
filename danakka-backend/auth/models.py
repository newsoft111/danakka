from sqlalchemy import Column, Text, Integer, String, ForeignKey, Boolean, Numeric, DateTime, func
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class AuthUser(Base):
	__tablename__ = "auth_user"

	id = Column(Integer, primary_key=True, index=True)
	email = Column(String)
	phone_number = Column(String)
	password = Column(String)
	created_at = Column(DateTime, default=datetime.now())
