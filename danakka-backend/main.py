#poetry run uvicorn main:app --reload --host=0.0.0.0 --port=8000
from fastapi import FastAPI, Depends, Path, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from core.config import media_settings
import os
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from fastapi.routing import APIRouter
import importlib

app = FastAPI()

origins = ["*"]


router_folders = {
	"auth": ["router.py"],
     "fishing": ["router.py", "crawler.py"],
     "payment": ["router.py"],
}
    
   

router_objects = {}

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for folder_name, router_files in router_folders.items():
    router_objects[folder_name] = []

    for router_file in router_files:
        module_name = f"{folder_name}.routers.{router_file[:-3]}"  # .py 확장자 제거
        router_module = importlib.import_module(module_name)
        router = router_module.router  # 라우터 객체를 가져옴
        app.include_router(router)
 


@app.get('/api/media/images/{file_path:path}')
def get_image(file_path:str):
	if os.path.isfile(''.join([media_settings.IMG_DIR,file_path])):
		file = ''.join([media_settings.IMG_DIR,file_path])
	else:
		file = ''.join([media_settings.IMG_DIR,'ship_new.png'])

	return FileResponse(file)


