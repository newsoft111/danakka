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
					path('create/crawled_data/basic/', views.create_crawled_basic_data, name='create_crawled_basic_data'),
					path('site_url_none_data/', views.site_url_none_data, name='site_url_none_data'),
					path('update/booking/', views.reserved_data, name='reserved_data'),
					path('delete/site_url_none_data/', views.del_site_url_none_data, name='del_site_url_none_data'),
					path('test/', views.api_test, name='api_test'),
				])
			)
		]),
	),
]



urlpatterns = user_urlpatterns