from fastapi import APIRouter, Depends, File, UploadFile, Query
from pydantic import BaseModel
from .. import models
import species.models as SpeciesModels
import harbor.models as HarborModels
from fishing.settings import *
from sqlalchemy.orm import Session, joinedload, selectinload
from typing import List
from datetime import datetime, timedelta
import fishing.models as FishingModels
import requests, random, time, re, os
from sqlalchemy import text
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from core.config import media_settings
from core.timezone import get_local_timezone
from db.connection import get_db

local_timezone = get_local_timezone()
router = APIRouter()


@router.get(f"/api/{APPNAME}/crawler/read/fishing/data/")
async def read_fishing_data(
	referrer: str = Query(description="Referrer"),
	db: Session = Depends(get_db)
):
	fishing_objs = db.query(
		FishingModels.Fishing
	).join(
		FishingModels.FishingCrawler
	).filter(
		FishingModels.FishingCrawler.referrer == referrer
	).options(
		joinedload(FishingModels.Fishing.fishing_crawler)
	).all()
	return fishing_objs



class CreateSpeciesDataBaseModel(BaseModel):
    pk: int
    year: str
    month: str
    display_business_name: str
    maximum_seat: int
    species: Optional[str] = None
# 예약 데이터 가져오기전 어종과 month 생성 라우터
@router.post(f"/api/{APPNAME}/crawler/create/species/data/")
async def create_species_data(
		create_species_data_base_model: CreateSpeciesDataBaseModel,
		db: Session = Depends(get_db)
	):
	
	pk = create_species_data_base_model.pk
	year = create_species_data_base_model.year
	month = create_species_data_base_model.month
	display_business_name = create_species_data_base_model.display_business_name
	maximum_seat = create_species_data_base_model.maximum_seat
	species = create_species_data_base_model.species

	fishing_obj = db.query(models.Fishing).filter_by(id=pk, display_business_name=display_business_name).first()

	if fishing_obj:
		if maximum_seat > fishing_obj.maximum_seat:
			fishing_obj.maximum_seat = maximum_seat
			db.commit()
	else:
		return {'result': '200'}
	

	# handle SpeciesMonth objects
	species_items = {}

	if species is not None:
		# create or update SpeciesMonth
		fishing_month_obj = db.query(models.FishingMonth).filter_by(fishing_id=pk, year=year, month=month).first()
		if not fishing_month_obj:
			fishing_month_obj = models.FishingMonth(
				fishing=fishing_obj,
				year=year,
				month=month,
				maximum_seat=maximum_seat,
			)
			db.add(fishing_month_obj)

		else:
			if maximum_seat > fishing_month_obj.maximum_seat:
				fishing_month_obj.maximum_seat = maximum_seat
				

		db.commit()
		db.refresh(fishing_month_obj)
		
		db.query(models.FishingMonthSpecies).filter_by(fishing_month_id=fishing_month_obj.id).delete()
		db.commit()

		for specie in species.split(','):
			# fetch SpeciesItem
			if specie not in species_items:
				fishing_species_item_obj = db.query(SpeciesModels.Species).filter_by(name=specie).first()
				if not fishing_species_item_obj:
					fishing_species_item_obj = SpeciesModels.Species(name=specie)
					db.add(fishing_species_item_obj)
					db.commit()
				species_items[specie] = fishing_species_item_obj


			
			fishing_species_obj = models.FishingMonthSpecies(
				fishing_month=fishing_month_obj,
				species=species_items[specie],
			)
			db.add(fishing_species_obj)
			db.commit()


		db.commit()
		db.refresh(fishing_obj)

	return {'result': '200'}


class CreateBookedDataBaseModel(BaseModel):
	pk: int
	date: str
	display_business_name: str
	booked_seat: int
    
@router.post(f"/api/{APPNAME}/crawler/create/booked/data/")
async def create_booked_data(
		create_species_data_base_model: CreateBookedDataBaseModel,
		db: Session = Depends(get_db)
	):
	pk = create_species_data_base_model.pk
	date = create_species_data_base_model.date
	display_business_name = create_species_data_base_model.display_business_name
	booked_seat = create_species_data_base_model.booked_seat

	fishing_obj = db.query(models.Fishing).filter(
		models.Fishing.id == pk, models.Fishing.display_business_name == display_business_name
	).first()
	if not fishing_obj:
		return {'result': '200'}		
		
		
	fishing_obj.needs_check = False
	db.commit()
	db.refresh(fishing_obj)

	
	fishing_booked_obj = db.query(models.FishingBooking).filter_by(fishing_id = pk, date=date).first()
	if not fishing_booked_obj:
		fishing_booked_obj = models.FishingBooking(
			fishing=fishing_obj,
			date=date,
			auth_user_id=None,
			person_count=booked_seat,
			person_name='윤동준'
		)
		db.add(fishing_booked_obj)
	else:
		fishing_booked_obj.person_count: booked_seat

	db.commit()
	db.refresh(fishing_booked_obj)


	return {'result': '200'}



class CreateFishingDataBaseModel(BaseModel):
	display_business_name: str
	uid: int
	business_address: str
	harbor: str
	referrer: str
	introduce: Optional[str] = None
	site_url: Optional[str] = None
	maximum_seat: Optional[int] = None

@router.post(f"/api/{APPNAME}/crawler/create/fishing/data/")
async def create_fishing_data(
		create_fishing_data_base_model: CreateFishingDataBaseModel = Depends(),
		thumbnail: Optional[UploadFile] = File(None),
		db: Session = Depends(get_db)
	):

	fishing_dict = create_fishing_data_base_model.dict(exclude_unset=True)
	
	

	if thumbnail is not None:
		contents = await thumbnail.read()
		currentTime = datetime.now(local_timezone).strftime("%Y%m%d%H%M")

		thumbnail_path = os.path.join(media_settings.IMG_DIR,currentTime)

		os.makedirs(thumbnail_path, exist_ok=True)

		with open((f"{thumbnail_path}/{thumbnail.filename}"), mode="wb") as f:
			f.write(contents)
		fishing_dict['thumbnail'] = f"{thumbnail_path}/{thumbnail.filename}"[1:]

	
	# FishingCrawler
	fishing_crawler = db.query(models.FishingCrawler).filter_by(uid=fishing_dict['uid'], referrer=fishing_dict['referrer']).first()
	if not fishing_crawler:
		fishing_crawler = models.FishingCrawler(uid=fishing_dict['uid'], referrer=fishing_dict['referrer'])
		db.add(fishing_crawler)
		db.commit()
		db.refresh(fishing_crawler)
	del fishing_dict['uid']
	del fishing_dict['referrer']
	fishing_dict['fishing_crawler_id'] = fishing_crawler.id

	# Harbor
	harbor = db.query(HarborModels.Harbor).filter_by(name=fishing_dict['harbor']).first()
	if not harbor:
		harbor = HarborModels.Harbor(name=fishing_dict['harbor'])
		db.add(harbor)
		db.commit()
		db.refresh(harbor)
	del fishing_dict['harbor']
	fishing_dict['harbor_id'] = harbor.id

	# FishingType
	fishing_type = db.query(models.FishingType).filter_by(name='선상').first()
	if not fishing_type:
		fishing_type = models.FishingType(name='선상')
		db.add(fishing_type)
		db.commit()
		db.refresh(fishing_type)
	fishing_dict['fishing_type_id'] = fishing_type.id

	# Fishing
	fishing = db.query(models.Fishing).filter_by(fishing_crawler_id=fishing_dict['fishing_crawler_id']).first()
	if not fishing:
		fishing = models.Fishing(**fishing_dict)
		db.add(fishing)
	else:
		for key, value in fishing_dict.items():
			setattr(fishing, key, value)

	# Save thumbnail image	

	fishing.updated_at = text('updated_at')
	db.commit()
	db.refresh(fishing)

	return fishing