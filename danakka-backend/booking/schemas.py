from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

class FishingCrawledData(BaseModel):
	display_business_name: str
	uid: str
	business_address: str
	harbor: str
	introduce: Optional[str] = None
	seat: Optional[int] = 0
    
    