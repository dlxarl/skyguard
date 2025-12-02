from django.contrib import admin
from .models import UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'trust_rating', 'rating_display')
    list_filter = ('trust_rating',)
    search_fields = ('user__username', 'user__email')
    list_editable = ('trust_rating',)

    def rating_display(self, obj):
        rating = obj.trust_rating
        if rating < 0:
            color = '#FF3B30'
        elif rating > 0:
            color = '#34C759'
        else:
            color = '#888888'
        return f'{rating:+d}'
    
    rating_display.short_description = 'Rating Display'
