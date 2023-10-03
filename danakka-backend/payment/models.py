from sqlalchemy import Column, Text, Integer, String, ForeignKey, Boolean, Numeric, DateTime, func
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from core.timezone import get_local_timezone
from db.session import Base

local_timezone = get_local_timezone()


class Payment(Base):
	__tablename__ = "payment"

	id = Column(Integer, primary_key=True, index=True)
	auth_user_id = Column(Integer, ForeignKey("auth_user.id"))
	merchant_uid = Column(String)
	order_name = Column(String)
	total_amount = Column(Numeric(precision=10, scale=2))
	is_paid = Column(Boolean, default=False)
	pay_method = Column(String)
	created_at = Column(DateTime, default=datetime.now(local_timezone))
	paid_at = Column(DateTime, nullable=True)

	auth_user = relationship("AuthUser", back_populates="payment")

	ticket_purchase_history = relationship("TicketPurchaseHistory", back_populates="payment")