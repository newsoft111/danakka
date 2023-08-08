from fastapi import APIRouter, Depends, HTTPException
from .. import models
from sqlalchemy.orm import Session, joinedload, selectinload
from db.connection import get_db
from sqlalchemy import func
from pydantic import BaseModel, conint
from typing import List, Optional, Union
from datetime import datetime, timedelta, date
from dateutil.relativedelta import relativedelta
from util.timezone import get_local_timezone

router = APIRouter()
local_timezone = get_local_timezone()
app_name = 'notification'
