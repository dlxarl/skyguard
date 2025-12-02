from rest_framework import serializers
from .models import Target, Shelter


class TargetSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    
    class Meta:
        model = Target
        fields = [
            'id', 'title', 'description', 
            'latitude', 'longitude', 
            'status', 'target_type', 
            'probability', 'report_count', 'weighted_score',
            'author', 'author_username', 
            'created_at', 'resolved_at'
        ]
        read_only_fields = ['status', 'author', 'created_at', 'probability', 'report_count', 'weighted_score', 'resolved_at']


class ShelterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shelter
        fields = '__all__'