from sqlalchemy.orm import Session
import auth.models as AuthModels
import ticket.models as TicketModels
from fastapi import HTTPException

class TicketAction:
    def __init__(self, db: Session):
        self.db = db

    def use_ticket(self, authorized_user: AuthModels.AuthUser, ticket_count: int, reason: str):
        ticket_obj = self.db.query(TicketModels.Ticket).filter_by(auth_user_id=authorized_user.id).first()

        if ticket_obj and ticket_obj.ticket_count >= ticket_count:
            ticket_obj.ticket_count -= ticket_count
            self.db.add(ticket_obj)

            usage_history = TicketModels.TicketUsageHistory(
                ticket=ticket_obj,
                ticket_count_used=ticket_count,
                ticket_usage_reason=reason
            )
            self.db.add(usage_history)
            self.db.commit()

        else:
            raise HTTPException(
                status_code=400,
                detail="사용 가능한 티켓 개수가 부족합니다."
            )
    
    def purchase_ticket(self, authorized_user: AuthModels.AuthUser, ticket_count: int):
        ticket_obj = self.db.query(TicketModels.Ticket).filter_by(auth_user_id=authorized_user.id).first()

        if ticket_obj:
            # Update the existing Ticket object
            ticket_obj.ticket_count += ticket_count
            self.db.add(ticket_obj)
        else:
            # Create a new Ticket object
            ticket_obj = TicketModels.Ticket(auth_user_id=authorized_user.id, ticket_count=ticket_count)
            self.db.add(ticket_obj)

        purchase_history = TicketModels.TicketPurchaseHistory(
            ticket=ticket_obj,
            ticket_count_purchased=ticket_count
        )
        self.db.add(purchase_history)
        
        
        self.db.commit()
