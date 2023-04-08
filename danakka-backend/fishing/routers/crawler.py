from fastapi import APIRouter
from pydantic import BaseModel
from database import engineconn
from .. import models
from .. import schemas
from sqlalchemy.orm import Session, joinedload
from typing import List
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from dateutil import rrule
import requests, random, time, re
from sqlalchemy import text

router = APIRouter()

app_name = 'fishing'

engine = engineconn()
db = engine.sessionmaker()

@router.post(f"/{app_name}/create/sunsang24/crawled_data/")
async def create_sunsang24_crawled_data(crawled_data: schemas.FishingCrawledData):    
	# FishingCrawledData -> dict
	fishing_dict = crawled_data.dict(exclude_unset=True)

	# FishingCrawler
	fishing_crawler = db.query(models.FishingCrawler).filter_by(uid=fishing_dict['uid'], referrer='선상24').first()
	if not fishing_crawler:
		fishing_crawler = models.FishingCrawler(uid=fishing_dict['uid'], referrer='선상24')
		db.add(fishing_crawler)
		db.commit()
		db.refresh(fishing_crawler)
	del fishing_dict['uid']
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
	fishing.updated_at = text('updated_at')
	db.commit()
	db.refresh(fishing)

	return fishing