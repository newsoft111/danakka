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
def create_sunsang24_crawled_fishing_data(request):
    if request.method == 'POST':
        # 데이터 추출
        data = request.POST
        thumbnail = request.FILES.get("thumbnail", None)

        # 모델 데이터 생성
        fishing_type_obj, created = FishingType.objects.get_or_create(name='선상')
        harbor_obj, created  = Harbor.objects.get_or_create(name=data.get('harbor', ''), defaults={"sea": None})
        fishing_crawler_obj, created  = FishingCrawler.objects.get_or_create(referrer=data.get('referrer', ''), uid=data.get('uid', ''))

        fishing_data = {
            "display_business_name": data.get('display_business_name', ''), 
            "harbor": harbor_obj,
            "business_address": data.get('business_address', ''),
            "fishing_type": fishing_type_obj,
            "thumbnail": thumbnail,
            "introduce": data.get('introduce', ''),
        }
        fishing_obj, created = Fishing.objects.update_or_create(fishing_crawler=fishing_crawler_obj, defaults=fishing_data)

        # 결과 반환
        return JsonResponse({'result': '200'})
        
    else:
        return JsonResponse({'result': '200'})
    


@csrf_exempt 
def create_sunsang24_crawled_species_data(request):
	def handle_post_request():
		pk = int(request.POST.get('pk'))
		species = request.POST.get('species')
		month = request.POST.get('month')
		display_business_name = request.POST.get('display_business_name')
		maximum_seat = request.POST.get('maximum_seat')

		try:
			fishing_obj = Fishing.objects.get(pk=pk)
			fishing_obj.maximum_seat = maximum_seat
			fishing_obj.save()
		except Fishing.DoesNotExist:
			return JsonResponse({'result': '200'})
		
		if not species or species == 'None':
			return JsonResponse({'result': '200'})
			
		if fishing_obj.display_business_name != display_business_name:
			return JsonResponse({'result': '200'})
		
		for specie in species.split(','):

			fishing_species_item_obj, _ = FishingSpeciesItem.objects.get_or_create(name=specie)
			FishingSpeciesMonth.objects.update_or_create(
				fishing=fishing_obj,
				month=month,
				defaults={
					'fishing_species_item': fishing_species_item_obj,
					'maximum_seat': maximum_seat
				}
			)
            
		return JsonResponse({'result': '200'})

	if request.method == 'POST':
		return handle_post_request()

	q = Q(is_deleted=False, fishing_crawler__isnull=False)
	fishing_objs = Fishing.objects.filter(q).select_related('fishing_crawler')

	fishing_list = [
		{
			'pk': fishing_obj.pk,
			'uid': fishing_obj.fishing_crawler.uid,
			'referrer': fishing_obj.fishing_crawler.referrer,
			'display_business_name': fishing_obj.display_business_name,
		} for fishing_obj in fishing_objs
	]

	return JsonResponse(fishing_list, safe=False, json_dumps_params={'ensure_ascii': False})



@csrf_exempt 
def create_sunsang24_crawled_booked_data(request):
	def handle_post_request():
		pk = int(request.POST.get('pk'))
		booked_seat = request.POST.get('booked_seat')
		date = datetime.strptime(request.POST.get('date'), '%Y-%m-%d').date()
		display_business_name = request.POST.get('display_business_name')

		try:
			fishing_obj = Fishing.objects.get(pk=pk)
		except Fishing.DoesNotExist:
			return JsonResponse({'result': '200'})

		if fishing_obj.display_business_name != display_business_name:
			return JsonResponse({'result': '200'})
		

		if fishing_obj.display_business_name == display_business_name:
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


		return JsonResponse({'result': '200'})
	

	if request.method == 'POST':
		return handle_post_request()

	return JsonResponse({'result': '200'})


@csrf_exempt 
def read_fishing_data(request):
	q = Q(is_deleted=False, fishing_crawler__isnull=False)
	fishing_objs = Fishing.objects.filter(q).select_related('fishing_crawler')

	fishing_list = [
		{
			'pk': fishing_obj.pk,
			'uid': fishing_obj.fishing_crawler.uid,
			'referrer': fishing_obj.fishing_crawler.referrer,
			'display_business_name': fishing_obj.display_business_name,
		} for fishing_obj in fishing_objs
	]

	return JsonResponse(fishing_list, safe=False, json_dumps_params={'ensure_ascii': False})

