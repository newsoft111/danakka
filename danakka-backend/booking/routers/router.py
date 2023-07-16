from fastapi import APIRouter, Depends, HTTPException
from .. import models
from sqlalchemy.orm import Session, joinedload, subqueryload, outerjoin, selectinload
from db.connection import get_db
from sqlalchemy import text, func, select
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta, date
from dateutil.relativedelta import relativedelta

router = APIRouter()

app_name = 'fishing'

today = datetime.today().date()

def daterange(start_date, end_date):
    for n in range(int((end_date - start_date).days)):
        yield start_date + timedelta(n)


@router.get(f"/api/{app_name}/list/")
async def read_all_fishing(
		page: int = 1,
		year: str = str(today.year),
		month: str = str(today.month),
		day: str = str(today.day),
		display_business_name: Optional[str] = None,
		fishing_type: Optional[str] = None,
		db: Session = Depends(get_db)
	):
	per_page = 15
	offset = (page - 1) * per_page

	search_date = datetime.strptime(year + month.zfill(2) + day, '%Y%m%d').date()
	species_month_date = year + month.zfill(2)

	# FishingMonth 모델에 대한 쿼리 생성
	query = db.query(models.FishingMonth)

	# 월(month) 필드를 species_month_date로 필터링하고, FishingMonth.fishing에 대한 join 로드를 설정
	query = query.filter_by(month=species_month_date).options(joinedload(models.FishingMonth.fishing).joinedload(models.Fishing.harbor))

	# FishingBooking 모델에 대한 서브쿼리 생성
	subquery = db.query(func.sum(models.FishingBooking.person))
	subquery = subquery.join(models.Fishing)
	subquery = subquery.filter(models.FishingBooking.date == search_date)
	subquery = subquery.filter(models.FishingBooking.fishing_id == models.Fishing.id)
	subquery = subquery.filter(models.Fishing.id == models.FishingMonth.fishing_id)
	subquery = subquery.filter(models.FishingMonth.month == species_month_date)
	subquery = subquery.group_by(models.Fishing.id)
	subquery = subquery.correlate(models.FishingMonth)

	# 예약 가능한 좌석 수 구하기
	available_seats = models.FishingMonth.maximum_seat - func.coalesce(subquery.scalar_subquery(), 0)

	# FishingMonth 모델에 대한 예약 가능한 좌석 수 필터링
	query = query.filter(models.FishingMonth.maximum_seat - func.coalesce(subquery.scalar_subquery(), 0) > 0)
	# 결과에 available_seats 추가하기
	query = query.add_column(available_seats.label('available_seats'))

	total_count = query.count()

	# FishingMonth 모델에 대한 limit()과 offset() 함수 적용
	fishing_objs = query.limit(per_page).offset(offset).all()

	return {
		"booking_objs": [
			{"fishing_month": fishing_month, "available_seats": available_seats} 
			for fishing_month, available_seats in fishing_objs
		],
		"last_page":total_count // per_page + 1
	}


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
