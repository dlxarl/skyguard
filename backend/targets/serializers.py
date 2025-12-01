from rest_framework import serializers
from .models import Target, Shelter

class TargetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Target
        fields = ['id', 'title', 'description', 'latitude', 'longitude', 'status', 'target_type', 'author', 'created_at']
        read_only_fields = ['status', 'author', 'created_at']

class ShelterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shelter
        fields = '__all__'