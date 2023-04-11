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

app_name = 'booking'

engine = engineconn()
db = engine.sessionmaker()


@router.get(f"/api/{app_name}/")
async def read_all_fishing(page: int = 1):
    per_page = 36
    offset = (page - 1) * per_page
    
    query = db.query(models.Fishing).options(joinedload(models.Fishing.fishing_crawler))
    
    total_count = query.count()
    
    fishing_objs = query.limit(per_page).offset(offset).first()
    
    return {
        "fishing_objs": fishing_objs,
    }

