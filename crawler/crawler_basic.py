from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from bs4 import BeautifulSoup
import requests, random, time, re
import undetected_chromedriver.v2 as uc
import cssutils
import urllib
import json, os
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from dateutil import rrule


def daterange(start_date, end_date):
    for n in range(int((end_date - start_date).days)):
        yield start_date + timedelta(n)

class DanakkaCrawler:
	def __init__(self):
		#self.driver = driver
		self.danakka_url = "http://localhost:8000/fishing/crawler"
		self.sunsang24_url = "https://api.sunsang24.com"

		#선상24
		#self.sunsang24_check_fishing_data()
		self.sunsang24_check_species_data()
			

	#배 확인후 등록
	def sunsang24_check_fishing_data(self):
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



	#예약된거 확인 첫루프는 어종확인
	def sunsang24_check_species_data(self):
		
		session = requests.Session()

		fishing_data = session.get(f"{self.danakka_url}/read/sunsang24/fishing_data/").json()

		for fishing_info in fishing_data:
			pk = fishing_info['id']
			uid = fishing_info['fishing_crawler']['uid']
			referrer = fishing_info['fishing_crawler']['referrer']
			display_business_name = fishing_info['display_business_name']

			if referrer != '선상24':
				continue

			start_date = datetime.today()
			end_date = start_date + relativedelta(months=11)

			months = [dt.strftime("%Y%m") for dt in rrule.rrule(rrule.MONTHLY, dtstart=start_date, until=end_date)]

			for month in months:
				try:
					res = session.get(f"{self.sunsang24_url}/ship/schedule_fleet_list/{uid}/{month}").json()[0]
				except (IndexError, TypeError):
					continue
				print(f"{self.sunsang24_url}/ship/schedule_fleet_list/{uid}/{month}")

				# Get species info
				if display_business_name == res['ship']['name']:
					species = res.get('fish_type')
					maximum_seat = res.get('embarkation_num', 0)

					data = {
						"pk": pk,
						"species": species,
						"month": month,
						"display_business_name": res['ship']['name'],
						"maximum_seat": maximum_seat
					}
					print(data)

					session.post(f"{self.danakka_url}/create/species_data/", json=data).raise_for_status()

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
					data = {
						"pk": pk,
						"date": res['sdate'],
						"display_business_name": res['ship']['name'],
						'booked_seat': booked_seat,
					}

					session.post(f'{self.danakka_url}/create/booked_data/', json=data).raise_for_status()
			


if __name__ == "__main__":
	'''options = webdriver.ChromeOptions() 
	options.add_argument('--ignore-ssl-errors=yes')
	options.add_argument('--ignore-certificate-errors')
	options.add_argument("--incognito")
	options.add_argument('--disable-blink-features=AutomationControlled')
	options.add_experimental_option("excludeSwitches", ["enable-logging"])

	with webdriver.Chrome(options=options, service=Service(ChromeDriverManager().install())) as driver:
		driver.set_window_size(random.uniform(993,1300), random.uniform(700,1000))'''
	DanakkaCrawler()
		