from django.db import models
from django.contrib.auth.models import User
from django_admin_geomap import GeoItem
from math import radians, cos, sin, asin, sqrt
from django.db.models.signals import pre_save, post_save, post_delete
from django.dispatch import receiver


def haversine(lon1, lat1, lon2, lat2):
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    return c * 6371


class Target(models.Model, GeoItem):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('unconfirmed', 'Unconfirmed'),
        ('confirmed', 'Confirmed'),
        ('rejected', 'Rejected'),
    )

    TYPE_CHOICES = (
        ('drone', 'Drone'),
        ('rocket', 'Rocket'),
        ('plane', 'Plane'),
        ('helicopter', 'Helicopter'),
        ('bang', 'Bang'),
    )

    PROBABILITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    )

    RADIUS_CHOICES = (
        (1, '1 km'),
        (2, '2 km'),
        (3, '3 km'),
        (5, '5 km'),
        (10, '10 km'),
    )

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    target_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='drone')
    danger_radius = models.IntegerField(choices=RADIUS_CHOICES, default=2, help_text="Danger radius in km")
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    notifications_sent = models.BooleanField(default=False)
    
    probability = models.CharField(max_length=20, choices=PROBABILITY_CHOICES, default='low', blank=True)
    report_count = models.IntegerField(default=1)
    weighted_score = models.FloatField(default=1.0)
    parent_target = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='child_reports')
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    @property
    def geomap_longitude(self):
        return str(self.longitude) if self.longitude else ''

    @property
    def geomap_latitude(self):
        return str(self.latitude) if self.latitude else ''

    def __str__(self):
        return f"{self.title} ({self.get_status_display()})"

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new and self.status == 'pending' and not self.parent_target:
            self.try_aggregate()

    def try_aggregate(self):
        from django.utils import timezone
        from datetime import timedelta

        recent_time = timezone.now() - timedelta(hours=2)
        aggregation_radius = 2
        
        main_targets = Target.objects.filter(
            target_type=self.target_type,
            created_at__gte=recent_time,
            status__in=['unconfirmed', 'confirmed'],
            parent_target__isnull=True
        ).exclude(pk=self.pk)

        for target in main_targets:
            distance = haversine(self.longitude, self.latitude, target.longitude, target.latitude)
            if distance <= aggregation_radius:
                if not Target.objects.filter(parent_target=target, author=self.author).exists() and target.author_id != self.author_id:
                    self.parent_target = target
                    self.save(update_fields=['parent_target'])
                    target.update_aggregation()
                return

        pending_targets = Target.objects.filter(
            target_type=self.target_type,
            status='pending',
            parent_target__isnull=True,
            created_at__gte=recent_time
        ).exclude(pk=self.pk)

        cluster = [self]
        unique_authors = {self.author_id}

        for target in pending_targets:
            distance = haversine(self.longitude, self.latitude, target.longitude, target.latitude)
            if distance <= aggregation_radius:
                if target.author_id not in unique_authors:
                    cluster.append(target)
                    unique_authors.add(target.author_id)

        if len(cluster) >= 5:
            avg_lat = sum(t.latitude for t in cluster) / len(cluster)
            avg_lon = sum(t.longitude for t in cluster) / len(cluster)
            
            max_radius = max(t.danger_radius for t in cluster)
            
            self.latitude = avg_lat
            self.longitude = avg_lon
            self.status = 'unconfirmed'
            self.danger_radius = max_radius
            self.title = f"{self.get_target_type_display().upper()}"
            self.save(update_fields=['latitude', 'longitude', 'status', 'danger_radius', 'title'])

            for target in cluster:
                if target.pk != self.pk:
                    target.parent_target = self
                    target.save(update_fields=['parent_target'])

            self.update_aggregation()

    def update_aggregation(self):
        children = Target.objects.filter(parent_target=self)
        self.report_count = children.count() + 1

        total_weight = self._get_author_weight()
        for child in children:
            total_weight += child._get_author_weight()

        self.weighted_score = total_weight

        if self.weighted_score >= 10 or self.report_count >= 15:
            self.probability = 'high'
        elif self.weighted_score >= 6 or self.report_count >= 8:
            self.probability = 'medium'
        else:
            self.probability = 'low'

        self.save(update_fields=['report_count', 'weighted_score', 'probability'])

    def _get_author_weight(self):
        if hasattr(self.author, 'profile'):
            rating = self.author.profile.trust_rating
            return 1 + (rating / 10)
        return 1.0

    def confirm(self):
        from django.utils import timezone
        self.status = 'confirmed'
        self.resolved_at = timezone.now()
        self.save(update_fields=['status', 'resolved_at'])

        self._adjust_author_rating(0.25)

        for child in Target.objects.filter(parent_target=self):
            child.status = 'confirmed'
            child.save(update_fields=['status'])
            child._adjust_author_rating(0.25)

    def reject(self):
        from django.utils import timezone
        self.status = 'rejected'
        self.resolved_at = timezone.now()
        self.save(update_fields=['status', 'resolved_at'])

        self._adjust_author_rating(-0.25)

        for child in Target.objects.filter(parent_target=self):
            child.status = 'rejected'
            child.save(update_fields=['status'])
            child._adjust_author_rating(-0.25)

    def _adjust_author_rating(self, amount):
        if hasattr(self.author, 'profile'):
            new_rating = self.author.profile.trust_rating + amount
            self.author.profile.trust_rating = max(-5, min(5, new_rating))
            self.author.profile.save(update_fields=['trust_rating'])


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