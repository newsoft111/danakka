from fastapi import APIRouter, Depends, HTTPException
from .. import models
from sqlalchemy.orm import Session, joinedload, selectinload
from db.connection import get_db
from sqlalchemy import func
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta, date
from dateutil.relativedelta import relativedelta

router = APIRouter()

app_name = 'fishing'


today = datetime.today().date()

@router.get(f"/api/{app_name}/list/")
async def read_all_fishing(
		page: int = 1,
		year: str = str(today.year),
		month: str = str(today.month),
		day: str = str(today.day),
		display_business_name: Optional[str] = None,
		fishing_type: Optional[str] = None,
		species_item: Optional[str] = None,
		harbor: Optional[str] = None,
		db: Session = Depends(get_db)
):
    per_page = 15
    offset = (page - 1) * per_page

    search_date = datetime.strptime(year + month.zfill(2) + day, '%Y%m%d').date()
    species_month_date = year + month.zfill(2)

    query = create_fishing_month_query(db, species_month_date, fishing_type, harbor)
    if species_item:
        query = filter_by_species_item(db, query, species_item)
    query, available_seats = filter_by_available_seats(db, query, search_date, harbor, species_month_date)
    total_count = query.count()
    fishing_months_with_available_seats = query.limit(per_page).offset(offset).all()

    return {
        "booking_objs": [
            {"fishing_month": fishing_month, "available_seats": available_seats} 
            for fishing_month, available_seats in fishing_months_with_available_seats
        ],
        "last_page":total_count // per_page + 1
    }

def create_fishing_month_query(db: Session, species_month_date: str, fishing_type: Optional[str], harbor: Optional[str]):
    """FishingMonth 모델에 대한 쿼리 생성"""
    query = db.query(models.FishingMonth)
    query = query.filter_by(month=species_month_date).options(joinedload(models.FishingMonth.fishing).joinedload(models.Fishing.harbor))
    if fishing_type:
        query = query.filter(models.Fishing.fishing_type.has(models.FishingType.name == fishing_type))
    if harbor:
        query = query.join(models.Fishing).filter(models.Fishing.harbor.has(models.Harbor.name == harbor))
    return query

def filter_by_species_item(db: Session, query, species_item: str):
    """FishingSpecies 모델에 대한 서브쿼리 생성 및 조건 추가"""
    subquery = db.query(func.count(models.FishingSpecies.id))
    subquery = subquery.join(models.FishingSpeciesItem)
    subquery = subquery.filter(models.FishingSpeciesItem.name == species_item)
    subquery = subquery.filter(models.FishingSpecies.fishing_month_id == models.FishingMonth.id)
    subquery = subquery.correlate(models.FishingMonth)
    return query.filter(subquery.scalar_subquery() > 0)

def filter_by_available_seats(db: Session, query, search_date: date, harbor: Optional[str], species_month_date: str):
    """FishingBooking 모델에 대한 서브쿼리 생성 및 예약 가능한 좌석 수 필터링"""
    subquery = db.query(func.sum(models.FishingBooking.person))
    subquery = subquery.join(models.Fishing)
    subquery = subquery.filter(models.FishingBooking.date == search_date)
    if harbor:
        subquery = subquery.filter(models.Fishing.harbor.has(models.Harbor.name == harbor))
    subquery = subquery.filter(models.FishingBooking.fishing_id == models.Fishing.id)
    subquery = subquery.filter(models.Fishing.id == models.FishingMonth.fishing_id)
    subquery = subquery.filter(models.FishingMonth.month == species_month_date)
    subquery = subquery.group_by(models.Fishing.id)
    subquery = subquery.correlate(models.FishingMonth)

    available_seats = models.FishingMonth.maximum_seat - func.coalesce(subquery.scalar_subquery(), 0)
    query = query.filter(available_seats > 0)
    query = query.add_column(available_seats.label('available_seats'))
    return query, available_seats



@router.get(f"/api/{app_name}/{{fishing_pk}}/")
async def read_fishing(
        fishing_pk: int,
        year: int = int(today.year),
        month: int = int(today.month),
        db: Session = Depends(get_db)
    ):
	start_date = date(year, month, 1)
	end_date = start_date + relativedelta(months=1)

	fishing_month_obj = db.query(models.FishingMonth).filter(
		models.FishingMonth.fishing_id == fishing_pk,
		models.FishingMonth.month == f"{year}{month:02d}"
	).options(
		selectinload(models.FishingMonth.fishing_species)
		.selectinload(models.FishingSpecies.fishing_species_item)
	).first()


	if not fishing_month_obj:
		return {"error": "Fishing month object not found"}
	print(fishing_month_obj.fishing_species)
	maximum_seat = fishing_month_obj.maximum_seat

	fishing_species_list = []
	for fishing_species in fishing_month_obj.fishing_species:
		fishing_species_list.append(fishing_species.fishing_species_item.name)

	species_item_name = ','.join(fishing_species_list)

	fishing_booking_objs = []

	booking_query = db.query(
		models.FishingBooking.date,
		func.sum(models.FishingBooking.person)
	).filter(
		models.FishingBooking.fishing_id == fishing_pk,
		models.FishingBooking.date >= start_date,
		models.FishingBooking.date < end_date
	).group_by(models.FishingBooking.date)


	bookings = {str(booking_date): {
			"total_person": total_person,
			"maximum_seat": maximum_seat,
			"available_seats": maximum_seat - total_person
		} for booking_date, total_person in booking_query}


	for single_date in daterange(start_date, end_date):
		if today <= single_date:
			single_date_str = single_date.strftime("%Y-%m-%d")
			booking_data = bookings.get(single_date_str, None)
			if booking_data is None:
				booking_data = {"total_person":0, "maximum_seat":maximum_seat, "available_seats":maximum_seat,"date": single_date_str}
			fishing_booking_objs.append(booking_data)


	fishing_obj = db.query(models.Fishing).filter(models.Fishing.id == fishing_pk).options(
		selectinload(models.Fishing.harbor)
	).first()
	fishing_obj.species_item_name = species_item_name

	return {
		"booking_objs": fishing_booking_objs,
		"fishing_objs": fishing_obj
	}

def daterange(start_date, end_date):
    for n in range(int((end_date - start_date).days)):
        yield start_date + timedelta(n)