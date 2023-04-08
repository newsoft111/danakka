from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from bs4 import BeautifulSoup
import requests, random, time
import undetected_chromedriver.v2 as uc
import cssutils
import urllib
import re
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta


class DanakkaCrawler:
	def __init__(self, driver):
		self.driver = driver
		self.sunsang24()
	
	def sunsang24(self):
		self.driver.get("https://www.google.com/search?q=")

		url = "http://127.0.0.1:8000/fishing/api/site_url_none_data/"
		res = requests.get(url)
		res.raise_for_status() # 문제시 프로그램 종료
		res = res.json()

		for res in res:
			pk = res['pk']
			business_name = res['fields']['display_business_name']
			self.driver.get(f"https://www.google.com/search?q=선상24 {business_name}")

			if self.driver.find_elements(By.CSS_SELECTOR,"iframe[name^='a-'][src^='https://www.google.com/recaptcha/api2/anchor?']"):
				count = 1
				while True:
					try:
						WebDriverWait(driver, 10).until(EC.frame_to_be_available_and_switch_to_it((By.CSS_SELECTOR,"iframe[src^='https://www.google.com/recaptcha/api2/anchor']")))
						WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, "span#recaptcha-anchor"))).click()
						driver.switch_to.default_content()
						WebDriverWait(driver, 10).until(EC.frame_to_be_available_and_switch_to_it((By.CSS_SELECTOR,"//iframe[@title='recaptcha challenge']")))
						WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//button[@id='solver-button']"))).click()
					except:
						pass
					time.sleep(30)
					if self.driver.find_elements(By.XPATH,"//div[@class='hdtb-mitem hdtb-msel']"):
						break
					elif count >=3:
						return
					count +=1

			html = self.driver.page_source
			soup = BeautifulSoup(html, 'html.parser')

			links = soup.findAll('div',attrs={'class':'yuRUbf'})
			for link in links:
				link = link.find('a')['href']
				link = link.split(".com")
				link = link[0]+".com/"

				if not "www.sunsang24.com" in link and "sunsang24.com" in link:
					data = {
						"site_url" : link,
						"pk" : pk,
						
					}

					res = requests.post(url, data=data)
					res.raise_for_status() # 문제시 프로그램 종료
					res = res.json()
					break
			

		self.driver.quit()

		

if __name__ == "__main__":
	options = webdriver.ChromeOptions() 
	options.add_argument('--ignore-ssl-errors=yes')
	options.add_argument('--ignore-certificate-errors')
	#options.add_argument("--incognito") 시크릿모드
	options.add_argument('--disable-blink-features=AutomationControlled')
	options.add_extension('extensions/Buster Captcha Solver for Humans.crx')
	options.add_experimental_option("excludeSwitches", ["enable-logging"])

	with webdriver.Chrome(options=options, service=Service(ChromeDriverManager().install())) as driver:
		driver.set_window_size(random.uniform(993,1300), random.uniform(700,1000))
		DanakkaCrawler(driver)
		