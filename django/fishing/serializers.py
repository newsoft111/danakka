from rest_framework import serializers
from .models import *

class FishingSerializer(serializers.Serializer):
    FishingCrawler = serializers.StringRelatedField(many=True)    
    class Meta:        
        model = FishingCrawler         