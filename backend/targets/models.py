from django.db import models
from django.contrib.auth.models import User
from django_admin_geomap import GeoItem
from django.db.models.signals import pre_save, post_save, post_delete
from django.dispatch import receiver


class Target(models.Model, GeoItem):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
    )

    TYPE_CHOICES = (
        ('drone', 'Drone'),
        ('rocket', 'Rocket'),
        ('plane', 'Plane'),
        ('helicopter', 'Helicopter'),
        ('bang', 'Bang'),
    )

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    target_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='bang')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    notifications_sent = models.BooleanField(default=False)

    @property
    def geomap_longitude(self):
        return str(self.longitude) if self.longitude else ''

    @property
    def geomap_latitude(self):
        return str(self.latitude) if self.latitude else ''

    def __str__(self):
        return self.title


@receiver(post_save, sender=Target)
def notify_on_target_confirmed(sender, instance, created, **kwargs):
    if instance.status == 'confirmed' and not instance.notifications_sent:
        from .notifications import notify_users_about_threat
        notify_users_about_threat(instance)
        Target.objects.filter(pk=instance.pk).update(notifications_sent=True)


_all_clear_check_in_progress = False


@receiver(post_save, sender=Target)
def check_all_clear_on_status_change(sender, instance, **kwargs):
    global _all_clear_check_in_progress
    if instance.status != 'confirmed' and not _all_clear_check_in_progress:
        _all_clear_check_in_progress = True
        try:
            from .notifications import notify_all_clear
            notify_all_clear()
        finally:
            _all_clear_check_in_progress = False


@receiver(post_delete, sender=Target)
def check_all_clear_on_delete(sender, instance, **kwargs):
    global _all_clear_check_in_progress
    if instance.status == 'confirmed' and not _all_clear_check_in_progress:
        _all_clear_check_in_progress = True
        try:
            from .notifications import notify_all_clear
            notify_all_clear()
        finally:
            _all_clear_check_in_progress = False


class Shelter(models.Model, GeoItem):
    title = models.CharField(max_length=200, default="Shelter")
    address = models.CharField(max_length=300, blank=True)
    capacity = models.IntegerField(default=0, help_text="Capacity (people)")
    latitude = models.FloatField()
    longitude = models.FloatField()

    @property
    def geomap_longitude(self):
        return str(self.longitude) if self.longitude else ''

    @property
    def geomap_latitude(self):
        return str(self.latitude) if self.latitude else ''

    def __str__(self):
        return f"Shelter: {self.title}"