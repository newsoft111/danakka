from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, UserManager
# Create your models here.

class CustomUserManager(UserManager):
    def create_user(self, username, email=None, password=None, **extra_fields):
        return self._create_user(username, email, password, **extra_fields)

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        return self._create_user(username, email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
	username = models.CharField(max_length=200,unique=True)
	password = models.CharField(max_length=200)
	email = models.CharField(max_length=200)

	USERNAME_FIELD = 'username'
	REQUIRED_FIELDS = ["email"]

	objects = CustomUserManager()
