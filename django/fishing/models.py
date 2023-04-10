from django.db import models
from harbor.models import Harbor
from django.conf import settings
from datetime import datetime

class FishingModelManager(models.Manager):
	def get_queryset(self):
		return super(FishingModelManager, self).get_queryset().filter(is_deleted=False)

def upload_to(instance, filename):
	nowDate = datetime.now().strftime("%Y/%m/%d")
	return '/'.join([instance.folder, nowDate, filename])

class FishingType(models.Model):
	name = models.CharField(max_length=255)

	class Meta:
		db_table = 'fishing_type'
		#managed = False

class FishingSpeciesItem(models.Model):
	name = models.CharField(max_length=255) #어종

	class Meta:
		db_table = 'fishing_species_item'
		#managed = False

class FishingGroup(models.Model):
	name = models.CharField(max_length=255)

	class Meta:
		db_table = 'fishing_group'
		#managed = False

class FishingCrawler(models.Model):
	referrer = models.CharField(max_length=255)
	uid = models.CharField(max_length=255)
	
	class Meta:
		db_table = 'fishing_crawler'
		#managed = False


# Create your models here.
class Fishing(models.Model):
	display_business_name = models.CharField(max_length=255)
	fishing_crawler =  models.OneToOneField(
			FishingCrawler,
			on_delete=models.CASCADE, 
			null=True,
			unique=True
	)
	fishing_group =  models.ForeignKey(
			FishingGroup,
			on_delete=models.CASCADE, 
			null=True,
	)
	is_deleted = models.BooleanField(default=False)
	reason_for_deletion = models.CharField(max_length=255, null=True)
	needs_check = models.BooleanField(default=True)
	business_address = models.CharField(max_length=255)
	harbor = models.ForeignKey(
			Harbor,
			on_delete=models.CASCADE
	)
	fishing_type = models.ForeignKey(
			FishingType,
			on_delete=models.CASCADE
	)
	site_url  = models.CharField(max_length=255, null=True)
	folder = 'fishing'
	thumbnail = models.ImageField(upload_to=upload_to, null=True)
	introduce = models.TextField(null=True)
	maximum_seat = models.PositiveIntegerField(default=0)
	price = models.DecimalField(max_digits=14, decimal_places=2, null=True)
	created_at = models.DateTimeField(auto_now_add=True, auto_now=False)
	updated_at = models.DateTimeField(auto_now_add=False, auto_now=True)
	
	objects = FishingModelManager()
	
	class Meta:
		db_table = 'fishing'
		#managed = False


class FishingSpeciesMonth(models.Model):
	fishing = models.ForeignKey(
		Fishing,
		on_delete=models.CASCADE
	)
	fishing_species_item = models.ForeignKey(
		FishingSpeciesItem,
		on_delete=models.CASCADE,
		null=True
	)
	month = models.CharField(max_length=255) #202304 형식으로 들어감
	maximum_seat = models.PositiveIntegerField()

	class Meta:
		db_table = 'fishing_species_month'
		#managed = False






class FishingBooking(models.Model):
	fishing = models.ForeignKey(
			Fishing,
			on_delete=models.CASCADE
	)
	user = models.ForeignKey(
			settings.AUTH_USER_MODEL,
            on_delete=models.CASCADE, 
	)
	date = models.DateField()
	person = models.PositiveIntegerField(default=1)
	
	class Meta:
		db_table = 'fishing_booking'
		#managed = False