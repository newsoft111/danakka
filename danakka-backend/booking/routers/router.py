from fastapi import APIRouter, Depends
from .. import models
from sqlalchemy.orm import Session, joinedload, subqueryload, outerjoin
from db.connection import get_db
from sqlalchemy import text, func, select
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
router = APIRouter()

app_name = 'booking'

today = datetime.today().date()

@router.get(f"/api/{app_name}/")
async def read_all_fishing(
        page: int = 1,
        year: str = str(today.year),
		month: str = str(today.month),
		day: str = str(today.day),
        display_business_name: Optional[str] = None,
        fishing_type: Optional[str] = None,
        db: Session = Depends(get_db)
    ):
    per_page = 12
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




