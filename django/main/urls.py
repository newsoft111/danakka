from django.urls import path, include
from . import views

app_name = 'main'

urlpatterns = [
	path('',
		include([
			path('', views.user_index, name='user_index'),
		])
	),
]