import asyncio
import requests
from dateutil.relativedelta import relativedelta
from dateutil import rrule
import re, os, random, time
from datetime import datetime
import undetected_chromedriver as uc
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.chrome.service import Service
from urllib.parse import urlparse, parse_qs
from bs4 import BeautifulSoup

class TheFishingCrawler:
	def __init__(self):
		self.danakka_url = "https://danakka.com"
		self.the_fishing_url = "https://thefishing.kr"
		self.session = requests.Session()



		self.the_fishing_scraping_fishing_data()


	def the_fishing_scraping_booked_data(self):
		fishing_objs = self.session.get(f"{self.danakka_url}/api/fishing/crawler/read/fishing/data/?referrer=더피싱").json()

		for fishing_obj in fishing_objs:
			pk = fishing_obj['id']
			uid = fishing_obj['fishing_crawler']['uid']
			referrer = fishing_obj['fishing_crawler']['referrer']
			display_business_name = fishing_obj['display_business_name']

			if referrer != '더피싱':
				continue
			
			fishing_page = self.session.get(f"{self.danakka_url}/api/fishing/crawler/read/fishing/data/")
			soup = BeautifulSoup(fishing_page.text, 'html.parser')

			#여기부터 수정
			business_name = soup.find('a').find('div', {'class': 're_list_ship'}).text
			
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


					data = {
						"pk": pk,
						"month": month,
						"display_business_name": res['ship']['name'],
						"maximum_seat": maximum_seat,
						"species": species
					}
					print(data)

					self.session.post(f"{self.danakka_url}/api/fishing/crawler/create/species/data/", json=data).raise_for_status()


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

					self.session.post(f'{self.danakka_url}/api/fishing/crawler/create/booked/data/', json=data).raise_for_status()
			

			
		

	def the_fishing_scraping_fishing_data(self):
		service = Service()

		options = webdriver.ChromeOptions() 
		options.add_argument('--ignore-ssl-errors=yes')
		options.add_argument('--ignore-certificate-errors')

		driver = webdriver.Chrome(service=service, options=options)
		
		driver.set_window_size(random.uniform(993,1300), random.uniform(700,1000))
	
		current_page = 1
		last_page = 2

		SCROLL_PAUSE_TIME = 1

		while current_page <= last_page:
			driver.get(f"{self.the_fishing_url}/reservation/list.php?page={current_page}")

			last_height = driver.execute_script("return document.body.scrollHeight")

			while True:
				# Scroll down to bottom
				driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
				# Wait to load page
				time.sleep(SCROLL_PAUSE_TIME)
				# Calculate new scroll height and compare with last scroll height
				new_height = driver.execute_script("return document.body.scrollHeight")
				if new_height == last_height:
					try:
						#맨뒤로가기 버튼
						link = driver.find_element(By.XPATH, f'//*[@id="content"]/article[3]/div[2]/a[4]').get_attribute("href")
						parsed_url = urlparse(link)
						query_params = parse_qs(parsed_url.query)
						last_page = int(query_params.get('page', [''])[0])
						break
					except:
						pass
				last_height = new_height
			
			

			#예약리스트 li 리스트
			eles = driver.find_elements(By.XPATH, '//*[@id="reservaion-ul"]/li')

			elements_html = []

			for ele in eles:
				element_html = ele.get_attribute("outerHTML")
				elements_html.append(element_html)
				

			for html_string in elements_html:
				soup = BeautifulSoup(html_string, 'html.parser')

				business_name = soup.find('a').find('div', {'class': 're_list_ship'}).text

				#uid 구하기
				link = soup.find('a').get('href')
				parsed_url = urlparse(link)
				query_params = parse_qs(parsed_url.query)
				uid = int(query_params.get('uid', [''])[0])
				thumbnail_url = soup.find('a').find('div', {'class': 'pic'}).find('img').get('src')

				business_address = ''
				harbor = str(soup.find('a').find('div', {'class': 're_list_area'}).text).split(" > ")[-1]

				maximum_seat = re.findall(r'\d+', soup.find('a').find('div', {'class': 're_list_price'}).text)
				if maximum_seat:
					maximum_seat = int(maximum_seat[0])
				else:
					maximum_seat = None

				path = os.getcwd() + f'\\thumbnail\\' + thumbnail_url.split('/')[-1]

				
				with open(path, 'wb') as f:
					f.write(requests.get(thumbnail_url).content)

				thumbnail = {"thumbnail":open(path, "rb")}



				#사이트 url 가져오기
				driver.get(f"{self.the_fishing_url}/reservation/list.php?uid={uid}&type=2")

				site_url = driver.find_element(By.XPATH, '//*[@id="content"]/article[1]/div/div[1]/div[2]/div[4]/div[1]/a').get_attribute('href')
				parsed_url = urlparse(site_url)
				site_url = parsed_url.scheme + "://" + parsed_url.netloc + "/"

				#상세소개 가져오기
				introduce = driver.find_element(By.XPATH, '//*[@id="content"]/article[1]/div/div[3]/dl[1]/dd').text
				if introduce.find('기본정보 준비중') != -1:
					introduce = None

				data = {
					'display_business_name': str(business_name),
					'uid': str(uid),
					'business_address': business_address,
					'harbor': harbor,
					'introduce': introduce,
					'referrer': '더피싱',
					'site_url':site_url,
					'maximum_seat': maximum_seat
				}

				
				url = f"{self.danakka_url}/api/fishing/crawler/create/fishing/data/"
				try:
					res = requests.post(url, params=data, files=thumbnail)
					print(data,1)
				except:
					print(data,2)
					continue


			current_page += 1

		driver.quit()


if __name__ == "__main__":
	TheFishingCrawler()