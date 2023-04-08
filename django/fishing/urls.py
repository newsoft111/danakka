from . import views
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static

app_name = 'fishing'


user_urlpatterns = [
	path(f'{app_name}/',
		include([
			path('', views.UserFishingLV.as_view(), name='user_fishing_list'),
			path('boat/', views.UserFishingLV.as_view(), name='user_boat_fishing_list'),
			path('house/', views.UserFishingLV.as_view(), name='user_house_fishing_list'),
			path('experience/', views.UserFishingLV.as_view(), name='user_experience_fishing_list'),
			re_path(r'^(?P<pk>\d+)/$', views.UserFishingDV.as_view(), name='user_fishing_detail'),
			path('api/',
				include([
					path('create/sunsang24/crawled_fishing_data/', views.create_sunsang24_crawled_fishing_data, name='create_sunsang24_crawled_fishing_data'),
                    path('create/sunsang24/crawled_species_data/', views.create_sunsang24_crawled_species_data, name='create_sunsang24_crawled_species_data'),
                    path('create/sunsang24/crawled_booked_data/', views.create_sunsang24_crawled_booked_data, name='create_sunsang24_crawled_booked_data'),
					path('read/fishing_data/', views.read_fishing_data, name='read_fishing_data'),
				])
			)
		]),
	),
]



urlpatterns = user_urlpatterns