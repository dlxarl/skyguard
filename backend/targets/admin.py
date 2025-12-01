from django.contrib import admin
from django.utils.html import format_html
from .models import Target, Shelter


@admin.register(Target)
class TargetAdmin(admin.ModelAdmin):
    list_display = ('title_colored', 'type_badge', 'status', 'author', 'created_at', 'coordinates')

    list_filter = ('status', 'target_type', 'created_at')
    search_fields = ('title', 'description')
    readonly_fields = ('created_at',)

    list_editable = ('status',)

    fieldsets = (
        ("Main Info", {
            "fields": ("title", "description", "target_type", "status")
        }),
        ("Location", {
            "fields": ("latitude", "longitude")
        }),
        ("Meta", {
            "fields": ("author", "created_at")
        }),
    )

    def title_colored(self, obj):
        return format_html(
            '<span style="font-weight:bold;">{}</span>',
            obj.title
        )

    title_colored.short_description = "Target Name"

    def type_badge(self, obj):
        colors = {
            'drone': 'info',
            'rocket': 'danger',
            'artillery': 'warning',
            'vehicle': 'primary',
            'other': 'secondary',
        }
        color = colors.get(obj.target_type, 'secondary')
        return format_html(
            '<span class="badge badge-pill badge-{}">{}</span>',
            color, obj.get_target_type_display()
        )

    type_badge.short_description = "Type"

    def coordinates(self, obj):
        return f"{obj.latitude:.4f}, {obj.longitude:.4f}"

    @admin.register(Shelter)
    class ShelterAdmin(admin.ModelAdmin):
        list_display = ('title', 'capacity', 'coordinates')
        search_fields = ('title', 'address')

        def coordinates(self, obj):
            return f"{obj.latitude:.4f}, {obj.longitude:.4f}"