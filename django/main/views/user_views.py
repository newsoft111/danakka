from django.shortcuts import render, redirect
from django.urls import reverse
# Create your views here.

def user_index(request):
	seo = {
		'title': "다낚아 - 메인페이지",
	}
	return redirect(reverse('fishing:user_fishing_list'))

	return render(request, 'user/main/index.html',{"seo":seo})

