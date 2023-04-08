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

		#선상24
		self.sunsang24_check_new()
		#self.sunsang24_booked()
			

	#신규배 확인후 등록
	def sunsang24_check_new(self):
		sdate = datetime.today().strftime('%Y-%m-%d')
	
		page = 1
		while True:
			url = f"https://api.sunsang24.com/ship/list?area=&fish=&page={page}&pay=&sdate={sdate}&type=general&use_time=&walkthrough="
			res = requests.get(url)
			res.raise_for_status() # 문제시 프로그램 종료
			res = res.json()
			res = res['list']
			try:
				cnt_res = len(res)
			except:
				cnt_res = 0

			if cnt_res < 1:
				break
			
			for res in res:
				business_name = res['ship']['name']
				uid = res['ship']['no']
				thumbnail_url = res['ship']['image']


				url = f"https://api.sunsang24.com/ship/group/{uid}"
				res = requests.get(url)
				res.raise_for_status() # 문제시 프로그램 종료
				try:
					res = res.json()[0]
				except:
					continue

				
				business_address = res['address']
				harbor = res['port_name']
				fishing_type = '선상'
				site_url = None
				sea = None
				seat = 0
				introduce = res['intro_memo']

				path = os.getcwd() + thumbnail_url.split('/')[-1]

				try:
					with open(path, 'wb') as f:
						f.write(requests.get(thumbnail_url).content)

					thumbnail = open(path, "rb")
				except Exception as e:
					thumbnail = None


				data = {
					"display_business_name" : str(business_name),
					"uid" : str(uid),
					"business_address" : business_address,
					"harbor" : harbor,
					"introduce" : introduce,
					"seat" : seat,
				}

				url = "http://127.0.0.1:8000/fishing/create/sunsang24/crawled_data/"
				res = requests.post(url, json=data)
				res.raise_for_status() # 문제시 프로그램 종료
				res = res.json()
				
			page += 1


	#배 예약된거 확인
	def sunsang24_booked(self):
		url = f"http://127.0.0.1:8000/fishing/api/update/booking/"
		res = requests.get(url)
		res.raise_for_status() # 문제시 프로그램 종료
		res = res.json()

		for res in res:
			site_url = res['fields']['site_url']
			uid = res['fields']['site_url']
			pk = res['pk']
			display_business_name = res['fields']['display_business_name']
			start_date = datetime.today()
			end_date = start_date + relativedelta(months=11)

			months = []
			for dt in rrule.rrule(rrule.MONTHLY, dtstart=start_date, until=end_date):
				months.append(dt.date().strftime("%Y%m"))

			for month in months:
				res = requests.get(f"{site_url}ship/schedule_fleet/{month}")
				res.raise_for_status() # 문제시 프로그램 종료
				html = res.text

				soup = BeautifulSoup(html, 'html.parser')
				
				#낚시 일일 데이터
				day_tables = soup.find_all("table",{"class":"shipsinfo_daywarp"})
							
				for day_table in day_tables:
					date = str(day_table.get('id')).replace('d','')

					for ship_table in day_table.find_all("table",{"class":"small_event_wrap"}):
						
						title = ship_table.find("div",{"class":"title"}).text.strip()
						remaining_seat = ship_table.find("li",{"class":"remain"}).text.strip()
						
						try:
							species = ship_table.find("div",{"id":"fish"}).text.strip()
						except:
							species = ''

						if "남은자리" in remaining_seat:
							remaining_seat = re.sub(r'[^0-9]', '', remaining_seat)
						else:
							remaining_seat = 0

						try:
							booked_done = ship_table.find("li",{"class":"reservation_complete reservation_list_end"}).text.strip()
							booked_done = re.findall(r"\(([0-9]+)\)", booked_done)
							booked_done = sum(list(map(int, booked_done)))
						except:
							booked_done = 0
						
						try:
							booked_ready = ship_table.find("li",{"class":"money_wait reservation_list_ready"}).text.strip()
							booked_ready = re.findall(r"\(([0-9]+)\)", booked_ready)
							booked_ready = sum(list(map(int, booked_ready)))
						except:
							booked_ready = 0
	
						booked_seat = booked_done + booked_ready

						data = {
							"pk" : pk,
							"title" : title,
							"remaining_seat" : remaining_seat,
							"booked_seat": booked_seat,
							"date": date,
							"species": species
						}

						if title == display_business_name:
							res = requests.post(url, data=data)
							res.raise_for_status() # 문제시 프로그램 종료
							pass

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
		