from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from ..models import *
from harbor.models import *
from django.core.paginator import Paginator
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import ListView, DetailView
from django.urls import resolve
import requests, json
from datetime import datetime, timedelta
from dateutil import rrule
from dateutil.relativedelta import relativedelta
import calendar

def daterange(start_date, end_date):
    for n in range(int((end_date - start_date).days)):
        yield start_date + timedelta(n)

class UserFishingLV(ListView):
	model = Fishing
	template_name = 'user/fishing/list.html'
	context_object_name = "fishing_objs"
	paginate_by = 36
	paginate_orphans = 5

	ordering = ['-id']
	

	fishing_type_dict = {
		"user_fishing_list":{
			"filter":"선상",
			"title":"다낚아 - 실시간예약",
		},
		"user_boat_fishing_list":{
			"filter":"선상",
			"title":"다낚아 - 선상낚시",
		},
		"user_house_fishing_list":{
			"filter":"좌대",
			"title":"다낚아 - 좌대낚시",
		},
		"user_experience_fishing_list":{
			"filter":"체험",
			"title":"다낚아 - 체험낚시",
		}
	}
	
	def get_context_data(self, **kwargs):
		current_url_name = resolve(self.request.path_info).url_name
		context = super().get_context_data(**kwargs)
		title = self.fishing_type_dict[current_url_name]['title']


		context['seo'] = {
			'title': title,
		}
		return context

	def get_queryset(self, **kwargs): # 컨텍스트 오버라이딩
		current_url_name = resolve(self.request.path_info).url_name
		q = Q()
		#q &= Q(needs_check = False)
		if current_url_name != "user_fishing_list":
			q &= Q(fishing_type__name = self.fishing_type_dict[current_url_name]['filter'])
		if self.request.GET.get('name'):
			q &= Q(display_business_name__icontains = self.request.GET.get('name'))
		qs = super().get_queryset(**kwargs)
		return qs.filter(q)



class UserFishingDV(DetailView):
	model = Fishing
	template_name = 'user/fishing/detail.html'
	context_object_name = "fishing_obj"


	def get_context_data(self, **kwargs):
		self.context = super().get_context_data(**kwargs)
		title = "다낚아 - 좌대낚시"
		
		referrer = self.object.fishing_crawler.referrer
		uid = self.object.fishing_crawler.uid

		today = datetime.today().date()
		if self.request.GET.get('year'):
			year = self.request.GET.get('year')
		else:
			year = str(today.year)

		if self.request.GET.get('year') and self.request.GET.get('month'):
			month = self.request.GET.get('month')
		else:
			month = str(today.month)

		if self.request.GET.get('year') and self.request.GET.get('month') and self.request.GET.get('day'):
			day = self.request.GET.get('day')
		else:
			day = str(today.day)

		calendar.setfirstweekday(calendar.SUNDAY)
		days = calendar.monthcalendar(datetime.strptime(year + month + day, '%Y%m%d').date().year, datetime.strptime(year + month + day, '%Y%m%d').date().month)

		self.context['days'] = days
		self.context['month'] = month
		self.context['year'] = year
	
		if referrer == '선상24':
			self.sunsang24(uid, year+'{:02d}'.format(int(month)))
		self.context['seo'] = {
			'title': title,
		}

		start_date = datetime.today()
		end_date = start_date + relativedelta(months=11)
		
		#년월 내보내기
		months = []
		for dt in rrule.rrule(rrule.MONTHLY, dtstart=start_date, until=end_date):
			months.append({dt.date().month:dt.date().strftime("%Y")})
		months = sorted(months, key=lambda d: list(d.keys()))
		self.context['months'] = months

		return self.context

	def sunsang24(self, uid, date):
		url = f"https://api.sunsang24.com/ship/schedule_fleet_list/{uid}/{date}"
		res = requests.get(url)
		res.raise_for_status() # 문제시 프로그램 종료

		sunsang24_objs = {}

		for sunsang24_obj in res.json():
			dict_date = datetime.strptime(sunsang24_obj['sdate'], "%Y-%m-%d")
			if not sunsang24_obj['sdate'] in sunsang24_objs:
				sunsang24_objs[dict_date] = []
			
			fishing_dict = {}
			fishing_dict['name'] = sunsang24_obj['ship']['name']
			fishing_dict['notice'] = sunsang24_obj['notice']
			fishing_dict['reservation_end'] = sunsang24_obj['reservation_end']
			fishing_dict['reservation_ready'] = sunsang24_obj['reservation_ready']
			fishing_dict['remain_embarkation_num'] = sunsang24_obj['remain_embarkation_num']
			fishing_dict['embarkation_num'] = sunsang24_obj['embarkation_num']
			fishing_dict['stime'] = sunsang24_obj['stime']
			fishing_dict['etime'] = sunsang24_obj['etime']
			fishing_dict['fish_type'] = sunsang24_obj['fish_type']
			fishing_dict['schedule_no'] = sunsang24_obj['schedule_no']

			self.context['stime'] = sunsang24_obj['stime']
			self.context['etime'] = sunsang24_obj['etime']
			self.context['fish_type'] = sunsang24_obj['fish_type']
			
			sunsang24_objs[dict_date].append(fishing_dict)
		
		self.context['sunsang24_objs'] = sunsang24_objs
		self.context['site_url'] = f"{self.object.site_url}/ship/schedule_fleet/{date}"
