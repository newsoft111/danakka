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


@router.get(f"/{app_name}/")
async def read_all_fishing():
    example = db.query(models.Fishing).options(joinedload(models.Fishing.fishing_crawler)).all()
    return example

