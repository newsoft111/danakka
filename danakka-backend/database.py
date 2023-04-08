from sqlalchemy import *
from sqlalchemy.orm import sessionmaker
USERNAME = "danakka"
PASSWORD = "ehdwns2510!"
HOST = "newsoft.kr"
DB_URL = f'mysql+pymysql://{USERNAME}:{PASSWORD}@{HOST}:3306/danakka'

class engineconn:

    def __init__(self):
        self.engine = create_engine(DB_URL, pool_recycle = 500)

    def sessionmaker(self):
        Session = sessionmaker(bind=self.engine)
        session = Session()
        return session

    def connection(self):
        conn = self.engine.connect()
        return conn