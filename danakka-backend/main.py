from typing import Optional
import fishing.routers as fishing
from fastapi import FastAPI, Depends, Path, HTTPException



app = FastAPI()


app.include_router(fishing.router)
app.include_router(fishing.crawler.router)