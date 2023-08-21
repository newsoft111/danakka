from sqlalchemy.orm import Session
import auth.models as AuthModels
import ticket.models as TicketModels
from fastapi import HTTPException

class TicketActions:
    def __init__(self, db: Session):
        self.db = db

    def use_ticket(self, authorized_user: AuthModels.AuthUser, ticket_count: int, reason: str):
        if authorized_user.ticket.ticket_count >= ticket_count:
            authorized_user.ticket.ticket_count -= ticket_count
            self.db.add(authorized_user.ticket)

            ticket = TicketModels.Ticket(auth_user_id=authorized_user.id, ticket_count=authorized_user.ticket.ticket_count)
            self.db.add(ticket)

            usage_history = TicketModels.TicketUsageHistory(
                ticket=ticket,
                ticket_count_used=ticket_count,
                ticket_usage_reason=reason
            )
            self.db.add(usage_history)
            self.db.commit()
            self.db.refresh(usage_history)
        else:
            raise HTTPException(
                status_code=400,
                detail="사용 가능한 티켓 개수가 부족합니다."
            )
    
    def purchase_ticket(self, authorized_user: AuthModels.AuthUser, ticket_count: int):
        ticket = TicketModels.Ticket(auth_user_id=authorized_user.id, ticket_count=ticket_count)
        self.db.add(ticket)

        purchase_history = TicketModels.TicketPurchaseHistory(
            ticket=ticket,
            ticket_count_purchased=ticket_count
        )
        self.db.add(purchase_history)
        
        authorized_user.ticket.ticket_count += ticket_count
        self.db.add(authorized_user.ticket)
        
        self.db.commit()
        self.db.refresh(purchase_history)