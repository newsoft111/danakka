#poetry run uvicorn main:app --reload --host=0.0.0.0 --port=8000
from typing import Optional
import booking.routers as booking
import auth.routers as auth
from fastapi import FastAPI, Depends, Path, HTTPException
from fastapi.responses import FileResponse
from core.config import media_settings
import os
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(booking.router)
app.include_router(booking.crawler.router)
app.include_router(auth.router)


@app.get('/media/images/{file_path:path}')
def get_image(file_path:str):
	if os.path.isfile(''.join([media_settings.IMG_DIR,file_path])):
		file = ''.join([media_settings.IMG_DIR,file_path])
	else:
		file = ''.join([media_settings.IMG_DIR,'ship_new.png'])

	return FileResponse(file)
	