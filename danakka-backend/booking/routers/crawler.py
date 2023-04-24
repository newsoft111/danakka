from fastapi import APIRouter, Depends, File, UploadFile
from pydantic import BaseModel
from .. import models
from sqlalchemy.orm import Session, joinedload, selectinload
from typing import List
from datetime import datetime, timedelta
from db.connection import get_db
import requests, random, time, re, os
from sqlalchemy import text
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from core.config import media_settings

router = APIRouter()

app_name = 'fishing'

class CrawledFishingData(BaseModel):
	display_business_name: str
	uid: str
	business_address: str
	harbor: str
	introduce: Optional[str] = None
	referrer: str


@router.post(f"/{app_name}/crawler/create/sunsang24/fishing_data/")
async def create_sunsang24_crawled_fishing_data(
		crawled_data: CrawledFishingData = Depends(),
		thumbnail: Optional[UploadFile] = File(None),
		db: Session = Depends(get_db)
	):
	
	#thumbnail = None
	# FishingCrawledData -> dict  thumbnail: UploadFile = File(None)
	fishing_dict = crawled_data.dict(exclude_unset=True)

	if thumbnail is not None:
		contents = await thumbnail.read()
		currentTime = datetime.now().strftime("%Y%m%d%H%M")

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
	harbor = db.query(models.Harbor).filter_by(name=fishing_dict['harbor']).first()
	if not harbor:
		harbor = models.Harbor(name=fishing_dict['harbor'])
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


@router.get(f"/{app_name}/crawler/read/sunsang24/fishing_data/")
async def read_sunsang24_crawled_species_data(
		db: Session = Depends(get_db)
	):
	example = db.query(models.Fishing).options(joinedload(models.Fishing.fishing_crawler)).all()
	return example


class CrawledSpeciesData(BaseModel):
	pk: int
	species: Optional[str] = None
	month: str
	display_business_name: str
	maximum_seat: int

@router.post(f"/{app_name}/crawler/create/species_data/")
async def create_species_data(
		crawled_data: CrawledSpeciesData,
		db: Session = Depends(get_db)
	):
	fishing_dict = crawled_data.dict(exclude_unset=True)
	pk = fishing_dict['pk']
	species = fishing_dict['species']
	month = fishing_dict['month']
	display_business_name = fishing_dict['display_business_name']
	maximum_seat = fishing_dict['maximum_seat']

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
		fishing_month_obj = db.query(models.FishingMonth).filter_by(fishing_id=pk, month=month).first()
		if not fishing_month_obj:
			fishing_month_obj = models.FishingMonth(
				fishing=fishing_obj,
				month=month,
				maximum_seat=maximum_seat,
			)
			db.add(fishing_month_obj)

		else:
			if maximum_seat > fishing_month_obj.maximum_seat:
				fishing_month_obj.maximum_seat = maximum_seat
				

		db.commit()
		db.refresh(fishing_month_obj)
		
		db.query(models.FishingSpecies).filter_by(fishing_month_id=fishing_month_obj.id).delete()
		db.commit()

		for specie in species.split(','):
			# fetch SpeciesItem
			if specie not in species_items:
				fishing_species_item_obj = db.query(models.FishingSpeciesItem).filter_by(name=specie).first()
				if not fishing_species_item_obj:
					fishing_species_item_obj = models.FishingSpeciesItem(name=specie)
					db.add(fishing_species_item_obj)
					db.commit()
				species_items[specie] = fishing_species_item_obj


			
			fishing_species_obj = models.FishingSpecies(
				fishing_month=fishing_month_obj,
				fishing_species_item=species_items[specie],
			)
			db.add(fishing_species_obj)
			db.commit()


		db.commit()
		db.refresh(fishing_obj)

	return {'result': '200'}



class CrawledBookedData(BaseModel):
	pk: int
	date: str
	display_business_name: str
	booked_seat: int

@router.post(f"/{app_name}/crawler/create/booked_data/")
async def create_booked_data(
		crawled_data: CrawledBookedData,
		db: Session = Depends(get_db)
	):
	fishing_dict = crawled_data.dict(exclude_unset=True)
	pk, date, display_business_name, booked_seat = (
        fishing_dict['pk'],
        datetime.strptime(fishing_dict['date'], '%Y-%m-%d').date(),
        fishing_dict['display_business_name'],
        fishing_dict['booked_seat']
	)

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
			user_id=1,
			person=booked_seat,
		)
		db.add(fishing_booked_obj)
	else:
		fishing_booked_obj.person: booked_seat

	db.commit()
	db.refresh(fishing_booked_obj)


	return {'result': '200'}