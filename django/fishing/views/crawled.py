from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from ..models import *
from django.contrib.auth import get_user_model
from harbor.models import *
from django.core.paginator import Paginator
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import ListView
from django.urls import resolve
from django.core import serializers
User = get_user_model()

@csrf_exempt 
def create_crawled_basic_data(request):
	if request.method == 'POST':
		business_name = request.POST.get('business_name')
		business_address = request.POST.get('business_address')
		harbor = request.POST.get('harbor')
		sea = request.POST.get('sea')
		fishing_type = request.POST.get('fishing_type')
		site_url = request.POST.get('site_url')
		referrer = request.POST.get('referrer')
		uid = request.POST.get('uid')
		try:
			thumbnail = request.FILES["thumbnail"]
		except:
			thumbnail = None
		introduce = request.POST.get('introduce')
		seat = request.POST.get('seat')
		price = request.POST.get('price')


		fishing_type_obj, created = FishingType.objects.get_or_create(
			name=fishing_type
		)


		harbor_obj, created = Harbor.objects.get_or_create(
			name=harbor, 
			defaults={
				"sea": sea
			},
		)

		fishing_crawler_obj, created = FishingCrawler.objects.get_or_create(
			referrer=referrer, uid= uid
		)

		try:
			fishing_obj, created = Fishing.objects.update_or_create(
				fishing_crawler=fishing_crawler_obj, 
				defaults={
					"display_business_name":business_name, 
					"harbor" : harbor_obj,
					"business_address": business_address,
					"fishing_type": fishing_type_obj,
					"site_url": site_url,
					"thumbnail": thumbnail,
					"introduce": introduce,
					"seat": seat,
					"price": price,
				}
			)
		except:
			fishing_obj = None

		if fishing_obj is not None:
			for species in str(species).split(','):
				fishing_species_item_obj, created = FishingSpeciesItem.objects.get_or_create(
					name=species
				)

				if fishing_species_item_obj not in fishing_obj.fishingspecies_set.all():
					FishingSpecies.objects.create(
						fishing=fishing_obj,
						fishing_species_item=fishing_species_item_obj
					)

			result = {'result': '200', 'result_text': '완료'}
		else:
			result = {'result': '204', 'result_text': '실패'}
		return JsonResponse(result)
		
	else:
		result = {'result': '201', 'result_text': '권한이 없습니다.'}
		return JsonResponse(result)	


@csrf_exempt 
def site_url_none_data(request):
	if request.method == 'POST':
		pk = request.POST.get('pk')
		site_url = request.POST.get('site_url')
		try:
			fishing_obj = Fishing.objects.get(pk=pk)
			fishing_obj.site_url = site_url
			fishing_obj.save()
			result = {'result': '200', 'result_text': '완료'}
			
		except:
			result = {'result': '201', 'result_text': '실패'}
		return JsonResponse(result)
	else:
		q = Q()
		q.add(Q(site_url = None), q.OR)
		q.add(Q(site_url = "https://www.sunsang24.com/"), q.OR)
		fishing_objs =  Fishing.objects.filter(q).order_by("-id")
		fishing_list = serializers.serialize('json', fishing_objs, ensure_ascii=False)
		
		return HttpResponse(fishing_list, content_type=u"application/json; charset=utf-8",)



@csrf_exempt 
def del_site_url_none_data(request):
	if request.method == 'POST':
		pk = request.POST.get('pk')
		Fishing.objects.get(pk=pk).delete()
		
		result = {'result': '200', 'result_text': '완료'}
		return JsonResponse(result)
	else:
		result = {'result': '201', 'result_text': '실패'}
		return JsonResponse(result)



@csrf_exempt 
def  reserved_data(request):
	if request.method == 'POST':
		pk = int(request.POST.get('pk'))
		title = str(request.POST.get('title'))
		species = str(request.POST.get('species'))
		remaining_seat = int(request.POST.get('remaining_seat'))
		booked_seat = int(request.POST.get('booked_seat'))
		date = datetime.strptime(request.POST.get('date'), '%Y-%m-%d')
		species_date = f"{datetime.strptime(request.POST.get('date'), '%Y-%m')}01"

		try:
			fishing_obj = Fishing.objects.get(pk=pk)
		except:
			result = {'result': '201', 'result_text': '실패'}
			return JsonResponse(result)
		
		if fishing_obj.seat < remaining_seat:
			fishing_obj.seat = remaining_seat
		

		if species == '':
			species = None

		has_species = False
		if species != None:
			for specie in str(species).split(','):
				if specie in [species.fishing_species_item.name for species in fishing_obj.fishingspecies_set.all()]:
					has_species = True
					break
			

		if fishing_obj.display_business_name == title and has_species:
			fishing_obj.needs_check = False
			user = User.objects.get(pk=1)
			FishingBooking.objects.update_or_create(
				fishing=fishing_obj,
				date=date,
				defaults={
					"user":user, 
					"date" : date,
					"person": booked_seat,
				},
			)

		fishing_obj.save()

		return HttpResponse('')
	else:
		q = Q()
		q &= ~Q(site_url = None)
		q &= Q(is_deleted = False)
		fishing_objs =  Fishing.objects.all()
		fishing_list = serializers.serialize('json', fishing_objs, ensure_ascii=False)
		
		return HttpResponse(fishing_list, content_type=u"application/json; charset=utf-8",)



@csrf_exempt 
def api_test(request):
	#필요없는 데이터 삭제하기
	'''pk = request.GET.get('pk')
	Fishing.objects.get(pk=pk).delete()'''

	#파싱데이터 이름 변경하는거
	'''fishing_objs =  Fishing.objects.filter(is_changed_crawled_business_name=False).order_by("-id")
	for fishing_obj in fishing_objs:
		fishing_obj.crawler_business_name = fishing_obj.business_name
		fishing_obj.is_changed_crawled_business_name = True
		fishing_obj.save()'''

		
	return HttpResponse('1')