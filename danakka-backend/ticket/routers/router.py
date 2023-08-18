from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session, joinedload, selectinload
from db.connection import get_db
from sqlalchemy import func
from pydantic import BaseModel, conint
from decimal import Decimal
from datetime import datetime, timedelta, date
from dateutil.relativedelta import relativedelta
from util.timezone import get_local_timezone
from auth.security import get_authenticated_user
import auth.models as AuthModels
import ticket.models as TicketModels

router = APIRouter()
local_timezone = get_local_timezone()
app_name = 'ticket'


@router.get(f"/api/{app_name}/history/")
async def get_user_ticket_history(
        authorized_user: AuthModels.AuthUser = Depends(get_authenticated_user),
        db: Session = Depends(get_db)
):

    # 유저의 티켓 사용 내역 조회
	ticket_usage_history = db.query(TicketModels.TicketUsageHistory).join(TicketModels.Ticket).filter(TicketModels.Ticket.auth_user_id == authorized_user.id).all()

	# 유저의 티켓 충전 내역 조회
	ticket_purchase_history = db.query(TicketModels.TicketPurchaseHistory).join(TicketModels.Ticket).filter(TicketModels.Ticket.auth_user_id == authorized_user.id).all()

	# 사용 및 충전 내역을 합쳐서 정렬
	all_history = []
	all_history.extend(ticket_usage_history)
	all_history.extend(ticket_purchase_history)
	all_history.sort(key=lambda history: history.used_at if hasattr(history, 'used_at') else history.purchased_at)

	return {
		"ticket_history": [
			{
				"ticket_count": history.ticket_count_used if hasattr(history, 'ticket_count_used') else history.ticket_count_purchased,
				"action": "used" if hasattr(history, 'used_at') else "purchased",
				"timestamp": history.used_at if hasattr(history, 'used_at') else history.purchased_at
			} for history in all_history
		]
	}