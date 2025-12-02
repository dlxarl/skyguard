from django.contrib import admin
from django.utils.html import format_html
from django.contrib import messages
from .models import Target, Shelter
from .forms import ShelterAdminForm, TargetAdminForm


@admin.register(Target)
class TargetAdmin(admin.ModelAdmin):
    form = TargetAdminForm
    list_display = ('title', 'type_badge', 'status_badge', 'probability_badge', 'danger_radius_display', 'author_with_rating', 'report_count', 'created_at')
    list_filter = ('status', 'target_type', 'probability', 'danger_radius', 'created_at')
    search_fields = ('title', 'description', 'author__username')
    readonly_fields = ('created_at', 'resolved_at', 'report_count', 'weighted_score', 'probability', 'child_reports_list')
    actions = ['confirm_targets', 'reject_targets']

    fieldsets = (
        ("Main Info", {
            "fields": ("title", "description", "target_type", "status", "danger_radius")
        }),
        ("Location", {
            "fields": ("map_picker", "latitude", "longitude"),
            "description": "Click on map or enter manually"
        }),
        ("Statistics", {
            "fields": ("probability", "report_count", "weighted_score"),
        }),
        ("Related Reports", {
            "fields": ("child_reports_list",),
        }),
        ("Meta", {
            "fields": ("author", "created_at", "resolved_at")
        }),
    )

    def danger_radius_display(self, obj):
        return format_html(
            '<span style="background:#007bff; color:white; padding:3px 8px; border-radius:4px;">{} km</span>',
            obj.danger_radius
        )
    danger_radius_display.short_description = "Radius"

    def type_badge(self, obj):
        colors = {
            'drone': '#17a2b8',
            'rocket': '#dc3545',
            'plane': '#ffc107',
            'helicopter': '#007bff',
            'bang': '#6c757d',
        }
        color = colors.get(obj.target_type, '#6c757d')
        return format_html(
            '<span style="background:{}; color:white; padding:3px 8px; border-radius:4px;">{}</span>',
            color, obj.get_target_type_display()
        )
    type_badge.short_description = "Type"

    def status_badge(self, obj):
        colors = {
            'pending': '#6c757d',
            'unconfirmed': '#ffc107',
            'confirmed': '#28a745',
            'rejected': '#dc3545',
        }
        color = colors.get(obj.status, '#6c757d')
        return format_html(
            '<span style="background:{}; color:white; padding:3px 8px; border-radius:4px;">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = "Status"

    def probability_badge(self, obj):
        if obj.status == 'pending':
            return "-"
        colors = {
            'low': '#6c757d',
            'medium': '#ffc107',
            'high': '#dc3545',
        }
        color = colors.get(obj.probability, '#6c757d')
        return format_html(
            '<span style="background:{}; color:white; padding:3px 8px; border-radius:4px;">{}</span>',
            color, obj.get_probability_display()
        )
    probability_badge.short_description = "Probability"

    def author_with_rating(self, obj):
        if hasattr(obj.author, 'profile'):
            rating = obj.author.profile.trust_rating
            color = '#28a745' if rating > 0 else '#dc3545' if rating < 0 else '#6c757d'
            rating_str = '{:+.2f}'.format(rating)
            return format_html(
                '{} <span style="color:{};">({})</span>',
                obj.author.username, color, rating_str
            )
        return obj.author.username
    author_with_rating.short_description = "Author"

    def child_reports_list(self, obj):
        children = Target.objects.filter(parent_target=obj)
        if not children:
            return "No related reports"
        
        rows = []
        for child in children:
            rating = child.author.profile.trust_rating if hasattr(child.author, 'profile') else 0
            rating_color = '#28a745' if rating > 0 else '#dc3545' if rating < 0 else '#6c757d'
            status_colors = {'pending': '#6c757d', 'unconfirmed': '#ffc107', 'confirmed': '#28a745', 'rejected': '#dc3545'}
            status_color = status_colors.get(child.status, '#6c757d')
            
            rows.append(
                '<tr>'
                '<td style="padding:8px;border:1px solid #ddd;">{}</td>'
                '<td style="padding:8px;border:1px solid #ddd;color:{};">{:+.2f}</td>'
                '<td style="padding:8px;border:1px solid #ddd;">{}</td>'
                '<td style="padding:8px;border:1px solid #ddd;"><span style="background:{};color:white;padding:2px 6px;border-radius:3px;">{}</span></td>'
                '</tr>'.format(
                    child.author.username,
                    rating_color,
                    rating,
                    child.created_at.strftime("%Y-%m-%d %H:%M"),
                    status_color,
                    child.get_status_display()
                )
            )
        
        html = (
            '<table style="width:100%; border-collapse:collapse;">'
            '<tr style="background:#f5f5f5;"><th style="padding:8px;border:1px solid #ddd;">Author</th>'
            '<th style="padding:8px;border:1px solid #ddd;">Rating</th>'
            '<th style="padding:8px;border:1px solid #ddd;">Time</th>'
            '<th style="padding:8px;border:1px solid #ddd;">Status</th></tr>'
            + ''.join(rows) +
            '</table>'
        )
        from django.utils.safestring import mark_safe
        return mark_safe(html)
    child_reports_list.short_description = "Related reports from other users"

    @admin.action(description="✅ Confirm selected targets")
    def confirm_targets(self, request, queryset):
        count = 0
        for target in queryset.filter(status='unconfirmed'):
            target.confirm()
            count += 1
        self.message_user(request, f"{count} target(s) confirmed. Users rewarded with +0.25 rating.", messages.SUCCESS)

    @admin.action(description="❌ Reject selected targets (false alarm)")
    def reject_targets(self, request, queryset):
        count = 0
        for target in queryset.filter(status='unconfirmed'):
            target.reject()
            count += 1
        self.message_user(request, f"{count} target(s) rejected. Users penalized with -0.25 rating.", messages.WARNING)


@admin.register(Shelter)
class ShelterAdmin(admin.ModelAdmin):
    form = ShelterAdminForm
    list_display = ('title', 'capacity', 'coordinates')
    search_fields = ('title', 'address')

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