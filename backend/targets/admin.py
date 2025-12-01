from django.contrib import admin
from django.utils.html import format_html
from django_admin_geomap import ModelAdmin as GeoModelAdmin
from .models import Target, Shelter
from .forms import ShelterAdminForm, TargetAdminForm


@admin.register(Target)
class TargetAdmin(GeoModelAdmin):
    form = TargetAdminForm
    list_display = ('title_colored', 'type_badge', 'status', 'author', 'created_at', 'coordinates')
    list_filter = ('status', 'target_type', 'created_at')
    search_fields = ('title', 'description')
    readonly_fields = ('created_at',)
    list_editable = ('status',)

    geomap_field_longitude = "id_longitude"
    geomap_field_latitude = "id_latitude"
    geomap_default_longitude = "31.0"
    geomap_default_latitude = "49.0"
    geomap_default_zoom = "6"
    geomap_height = "400px"

    fieldsets = (
        ("Main Info", {
            "fields": ("title", "description", "target_type", "status")
        }),
        ("Location", {
            "fields": ("map_picker", "latitude", "longitude"),
            "description": "Click on map or enter manually"
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
class ShelterAdmin(GeoModelAdmin):
    form = ShelterAdminForm
    list_display = ('title', 'capacity', 'coordinates')
    search_fields = ('title', 'address')

    geomap_field_longitude = "id_longitude"
    geomap_field_latitude = "id_latitude"
    geomap_default_longitude = "31.0"
    geomap_default_latitude = "49.0"
    geomap_default_zoom = "6"
    geomap_height = "400px"

    fieldsets = (
        ("Info", {
            "fields": ("title", "address", "capacity")
        }),
        ("Location", {
            "fields": ("map_picker", "latitude", "longitude"),
            "description": "Click on map"
        }),
    )

    def coordinates(self, obj):
        return f"{obj.latitude:.4f}, {obj.longitude:.4f}"