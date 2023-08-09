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

	auth_promotion_agreement = relationship("AuthPromotionAgreement", back_populates="auth_user", uselist=False)
	auth_user_ticket = relationship("AuthUserTicket", back_populates="auth_user")
	auth_user_ticket_usage_history = relationship("AuthUserTicketUsageHistory", back_populates="auth_user")
	auth_user_ticket_purchase_history = relationship("AuthUserTicketPurchaseHistory", back_populates="auth_user")




class AuthUserTicket(Base):
    __tablename__ = "auth_user_ticket"

    id = Column(Integer, primary_key=True, index=True)
    auth_user_id = Column(Integer, ForeignKey("auth_user.id"))
    ticket_count = Column(Integer, default=0)

    auth_user = relationship("AuthUser", back_populates="auth_user_ticket")
    

class AuthUserTicketUsageHistory(Base):
    __tablename__ = "auth_user_ticket_usage_history"

    id = Column(Integer, primary_key=True, index=True)
    auth_user_id = Column(Integer, ForeignKey("auth_user.id"))
    ticket_count_used = Column(Integer)
    usage_reason = Column(String)
    used_at = Column(DateTime, default=datetime.now(local_timezone))

    auth_user = relationship("AuthUser", back_populates="auth_user_ticket_usage_history")
    

class AuthUserTicketPurchaseHistory(Base):
    __tablename__ = "auth_user_ticket_purchase_history"

    id = Column(Integer, primary_key=True, index=True)
    auth_user_id = Column(Integer, ForeignKey("auth_user.id"))
    ticket_count_purchased = Column(Integer)
    purchased_at = Column(DateTime, default=datetime.now(local_timezone))

    auth_user = relationship("AuthUser", back_populates="auth_user_ticket_purchase_history")


class AuthPromotionAgreement(Base):
	__tablename__ = "auth_promotion_agreement"

	id = Column(Integer, primary_key=True, index=True)
	auth_user_id = Column(Integer, ForeignKey("auth_user.id"))
	phone_promotion_agreed = Column(Boolean, default=False)
	email_promotion_agreed = Column(Boolean, default=False)

	auth_user = relationship("AuthUser", back_populates="auth_promotion_agreement")


class AuthSms(Base):
	__tablename__ = "auth_sms"

	phone_number = Column(String, primary_key=True)
	verify_code = Column(Integer)


class AuthEmail(Base):
	__tablename__ = "auth_email"

	email = Column(String, primary_key=True)
	verify_code = Column(Integer)