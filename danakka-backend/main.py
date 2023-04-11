from typing import Optional
import booking.routers as booking
from fastapi import FastAPI, Depends, Path, HTTPException



app = FastAPI()


app.include_router(booking.router)
app.include_router(booking.crawler.router)