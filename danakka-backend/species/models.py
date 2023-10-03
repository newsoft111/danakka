from sqlalchemy import Column, Text, Integer, String, ForeignKey, Boolean, Numeric, DateTime, func
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from core.timezone import get_local_timezone
from db.session import Base
local_timezone = get_local_timezone()


class Species(Base):
	__tablename__ = "species"

	id = Column(Integer, primary_key=True, index=True)
	name=Column(String(255))

	fishing_month_species = relationship("FishingMonthSpecies", back_populates="species")

