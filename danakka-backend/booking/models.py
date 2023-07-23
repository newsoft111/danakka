from sqlalchemy import Column, Text, Integer, String, ForeignKey, Boolean, Numeric, DateTime, func
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base


Base = declarative_base()


class FishingType(Base):
	__tablename__ = "fishing_type"

	id = Column(Integer, primary_key=True, index=True)
	name=Column(String(255))

	fishing = relationship("Fishing", back_populates="fishing_type")


class FishingSpeciesItem(Base):
	__tablename__ = "fishing_species_item"

	id = Column(Integer, primary_key=True, index=True)
	name=Column(String(255))

	fishing_species = relationship("FishingSpecies", back_populates="fishing_species_item")

class FishingSpecies(Base):
	__tablename__ = "fishing_species"

	id = Column(Integer, primary_key=True, index=True)
	fishing_month_id = Column(Integer, ForeignKey("fishing_month.id"))
	fishing_species_item_id = Column(Integer, ForeignKey("fishing_species_item.id"))

	fishing_month = relationship("FishingMonth", back_populates="fishing_species")
	fishing_species_item = relationship("FishingSpeciesItem", back_populates="fishing_species")


class FishingCrawler(Base):
	__tablename__ = "fishing_crawler"

	id = Column(Integer, primary_key=True, index=True)
	uid = Column(String(255))
	referrer = Column(String(255))

	fishing = relationship("Fishing", back_populates="fishing_crawler")



class Fishing(Base):
	__tablename__ = "fishing"

	id = Column(Integer, primary_key=True, index=True)
	display_business_name=Column(String(255))
	fishing_crawler_id = Column(Integer, ForeignKey("fishing_crawler.id"), nullable=True)
	is_deleted=Column(Boolean, default=False)
	reason_for_deletion=Column(String(255), nullable=True)
	needs_check=Column(Boolean, default=True)
	business_address=Column(String(255))
	harbor_id = Column(Integer, ForeignKey("harbor.id"))
	fishing_type_id = Column(Integer, ForeignKey("fishing_type.id"))
	site_url=Column(String(255), nullable=True)
	thumbnail=Column(String(255), nullable=True)
	introduce=Column(Text, nullable=True)
	maximum_seat=Column(Integer, default=0)
	price=Column(Numeric(14, 2), nullable=True)
	created_at = Column(DateTime, default=func.now())
	updated_at = Column(DateTime, onupdate=func.now())


	
	fishing_crawler = relationship("FishingCrawler", back_populates="fishing")
	harbor = relationship("Harbor", back_populates="fishing")
	fishing_type = relationship("FishingType", back_populates="fishing")
	

	fishing_month = relationship("FishingMonth", back_populates="fishing")
	fishing_booking = relationship("FishingBooking", back_populates="fishing")


class FishingMonth(Base):
	__tablename__ = "fishing_month"

	id = Column(Integer, primary_key=True, index=True)
	fishing_id = Column(Integer, ForeignKey("fishing.id"))
	
	
	month=Column(String(255))
	maximum_seat=Column(Integer)

	fishing = relationship("Fishing", back_populates="fishing_month")

	fishing_species = relationship("FishingSpecies", back_populates="fishing_month")
	



class Harbor(Base):
	__tablename__ = "harbor"

	id = Column(Integer, primary_key=True, index=True)
	name=Column(String(255), unique=True)
	address=Column(String(255), nullable=True)
	sea=Column(String(255), nullable=True)

	fishing = relationship("Fishing", back_populates="harbor")



class FishingBooking(Base):
	__tablename__ = "fishing_booking"

	id = Column(Integer, primary_key=True, index=True)
	fishing_id = Column(Integer, ForeignKey("fishing.id"))
	user_id = Column(Integer)
	date=Column(DateTime)
	person=Column(Integer)

	fishing = relationship("Fishing", back_populates="fishing_booking")