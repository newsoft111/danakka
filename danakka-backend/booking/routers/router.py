from fastapi import APIRouter, Depends, HTTPException
from .. import models
from sqlalchemy.orm import Session, joinedload, subqueryload, outerjoin
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


@router.get(f"/{app_name}/list/")
async def read_all_fishing(
		page: int = 1,
		year: int = int(today.year),
		month: int = int(today.month),
		day: int = int(today.day),
		display_business_name: Optional[str] = None,
		fishing_type: Optional[str] = None,
		db: Session = Depends(get_db)
	):

	per_page = 12
	offset = (page - 1) * per_page

	search_date = date(year, month, day)
	species_month_date = str(year) + str(month).zfill(2)

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
	available_seats = models.FishingMonth.maximum_seat - subquery.scalar_subquery()

	# FishingMonth 모델에 대한 예약 가능한 좌석 수 필터링
	query = query.filter(models.FishingMonth.maximum_seat - subquery.scalar_subquery() > 0)
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


@router.get(f"/{app_name}/{{fishing_pk}}/")
async def read_fishing(
        fishing_pk: int,
		year: int = int(today.year),
		month: int = int(today.month),
        db: Session = Depends(get_db)
    ):

	start_date = date(year, month, 1)
	end_date = start_date + relativedelta(months=1)

	for single_date in daterange(start_date, end_date):
		print(single_date.strftime("%Y-%m-%d"))
	fishing = db.query(models.Fishing).filter(models.Fishing.id == fishing_pk).first()
	if not fishing:
		raise HTTPException(status_code=404, detail="Fishing item not found")
	return fishing
