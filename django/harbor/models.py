from django.db import models

# Create your models here.
class Harbor(models.Model):
	name = models.CharField(max_length=255, unique=True)
	address = models.CharField(max_length=255, null=True)
	sea = models.CharField(max_length=255, null=True)

	class Meta:
		db_table = 'harbor'
		#managed = False