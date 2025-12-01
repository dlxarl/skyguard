from django.contrib import admin
from .models import Target


@admin.register(Target)
class TargetAdmin(admin.ModelAdmin):
    list_display = ('title', 'target_type', 'status', 'author', 'created_at', 'latitude', 'longitude')
    list_filter = ('status', 'target_type', 'created_at')
    search_fields = ('title', 'description')

    list_editable = ('status',)