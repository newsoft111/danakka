from sqlalchemy import Column, Text, Integer, String, ForeignKey, Boolean, Numeric, DateTime, func
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from util.timezone import get_local_timezone
from db.session import Base
local_timezone = get_local_timezone()



class Ticket(Base):
    __tablename__ = "ticket"

    id = Column(Integer, primary_key=True, index=True)
    auth_user_id = Column(Integer, ForeignKey("auth_user.id"))
    ticket_count = Column(Integer, default=0)

    auth_user = relationship("AuthUser", back_populates="ticket")

    ticket_usage_history = relationship("TicketUsageHistory", back_populates="ticket")
    ticket_purchase_history = relationship("TicketPurchaseHistory", back_populates="ticket")



class TicketUsageHistory(Base):
    __tablename__ = "ticket_usage_history"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("ticket.id"))
    ticket_count_used = Column(Integer)
    ticket_usage_reason = Column(String)
    used_at = Column(DateTime, default=datetime.now(local_timezone))

    ticket = relationship("Ticket", back_populates="ticket_usage_history")
    

class TicketPurchaseHistory(Base):
	__tablename__ = "ticket_purchase_history"

	id = Column(Integer, primary_key=True, index=True)
	ticket_id = Column(Integer, ForeignKey("ticket.id"))
	payment_id = Column(Integer, ForeignKey("payment.id"))
	ticket_count_purchased = Column(Integer)
	purchased_at = Column(DateTime, default=datetime.now(local_timezone))

	ticket = relationship("Ticket", back_populates="ticket_purchase_history")
	payment = relationship("Payment", back_populates="ticket_purchase_history")

