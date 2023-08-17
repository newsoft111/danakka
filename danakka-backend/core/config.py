import os

class DanakkaSettins:
	URL = 'http://localhost:8000/'

danakka_settings = DanakkaSettins()

class DbSettings:
	DB_USERNAME : str = "danakka"
	DB_PASSWORD = "ehdwns2510!"
	DB_HOST : str = "192.168.219.102:3306"
	DB_DATABASE : str = "danakka"
	
	DATABASE_URL = f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}/{DB_DATABASE}"

db_settings = DbSettings()


class MediaSettings:
	MEDIA_DIR = "./media"
	IMG_DIR = f"{MEDIA_DIR}/images/"

media_settings = MediaSettings()