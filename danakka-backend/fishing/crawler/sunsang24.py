import asyncio
import requests
import fishing.models as FishingModels
from sqlalchemy.orm import Session, joinedload
from db.connection import get_db
from fastapi import Depends
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from dateutil import rrule
import re
#from booking.crawler.actions import BookingCrawlerAction

class Sunsang24Crawler:
	def __init__(self):
		self.sunsang24_url = "https://api.sunsang24.com"
		self.session = requests.Session()


	async def sunsang24_scraping_booked_data(self):
		fishing_objs = self.db.query(FishingModels.Fishing).options(joinedload(FishingModels.Fishing.fishing_crawler)).all()

		for fishing_obj in fishing_objs:

			pk = fishing_obj.id
			uid = fishing_obj.fishing_crawler.uid
			referrer = fishing_obj.fishing_crawler.referrer
			display_business_name = fishing_obj.display_business_name

			if referrer != '선상24':
				continue

			start_date = datetime.today()
			end_date = start_date + relativedelta(months=11)

			months = [dt.strftime("%Y%m") for dt in rrule.rrule(rrule.MONTHLY, dtstart=start_date, until=end_date)]

			for month in months:
				try:
					res = self.session.get(f"{self.sunsang24_url}/ship/schedule_fleet_list/{uid}/{month}").json()[0]
				except (IndexError, TypeError):
					continue
				print(f"{self.sunsang24_url}/ship/schedule_fleet_list/{uid}/{month}")

				# Get species info
				if display_business_name == res['ship']['name']:
					species = res.get('fish_type')
					maximum_seat = res.get('embarkation_num', 0)


					await self.crawler_action.create_species_data(
						pk=pk,
						species=species,
						month=month,
						display_business_name=res['ship']['name'],
						maximum_seat=maximum_seat
					)

				# Get booked seat info
				booked_done = 0
				booked_ready = 0

				if res['reservation_end']:
					try:
						booked_done = sum(map(int, re.findall(r"\(([0-9]+)\)", res['reservation_end'])))
					except ValueError:
						pass

				if res['reservation_ready']:
					try:
						booked_ready = sum(map(int, re.findall(r"\(([0-9]+)\)", res['reservation_ready'])))
					except ValueError:
						pass

				booked_seat = booked_done + booked_ready

				if display_business_name == res['ship']['name'] and booked_seat != 0:

					await self.crawler_action.create_booked_data(
						pk=pk,
						date=res['sdate'],
						display_business_name= res['ship']['name'],
						booked_seat= booked_seat,
					)
			


	def sunsang24_scraping_fishing_data(self):
		sdate = datetime.today().strftime('%Y-%m-%d')
		page = 1
		prev_uids = set()

		while True:
			url = f"{self.sunsang24_url}/ship/list?area=&fish=&page={page}&pay=&sdate={sdate}&type=general&use_time=&walkthrough="
			res = requests.get(url).json()['list']
			cnt_res = len(res) if res else 0

			if cnt_res < 1:
				break

			for item in res:
				ship = item.get('ship')
				if not ship:
					continue

				uid = ship.get('no')
				if not uid or uid in prev_uids:
					continue

				business_name = ship.get('name')
				thumbnail_url = ship.get('image')

				group_url = f"{self.sunsang24_url}/ship/group/{uid}"
				group_res = requests.get(group_url)
				if group_res.status_code != 200:
					continue
				
				try:
					group_data = group_res.json()[0]
				except:
					continue
				business_address = group_data.get('address')
				harbor = group_data.get('port_name')
				introduce = group_data.get('intro_memo')

				path = os.getcwd() + f'\\thumbnail\\' + thumbnail_url.split('/')[-1]

				
				with open(path, 'wb') as f:
					f.write(requests.get(thumbnail_url).content)

				thumbnail = {"thumbnail":open(path, "rb")}
			

				if len(introduce) > 1000:
					introduce = None

				data = {
					'display_business_name': str(business_name),
					'uid': str(uid),
					'business_address': business_address,
					'harbor': harbor,
					'introduce': introduce,
					'referrer': '선상24'
				}

				

				url = f"{self.danakka_url}/create/sunsang24/fishing_data/"
				try:
					res = requests.post(url, params=data, files=thumbnail)
					if res.status_code == 200:
						prev_uids.add(uid)
				except:
					continue
			
			page += 1