from django.db import models
from django.contrib.auth.models import User
from django_admin_geomap import GeoItem
from math import radians, cos, sin, asin, sqrt


def haversine(lon1, lat1, lon2, lat2):
    """Calculate distance between two points in km"""
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    return c * 6371  # Earth radius in km


class Target(models.Model, GeoItem):
    STATUS_CHOICES = (
        ('pending', 'Pending'),          # Single report, waiting for more
        ('unconfirmed', 'Unconfirmed'),  # 5+ reports, needs admin review
        ('confirmed', 'Confirmed'),       # Admin confirmed
        ('rejected', 'Rejected'),         # Admin rejected (false alarm)
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

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    target_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='drone')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Aggregation fields
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
        """Try to aggregate with nearby targets or trigger unconfirmed status"""
        from django.utils import timezone
        from datetime import timedelta

        recent_time = timezone.now() - timedelta(hours=2)
        
        # Look for existing unconfirmed/confirmed targets nearby
        main_targets = Target.objects.filter(
            target_type=self.target_type,
            created_at__gte=recent_time,
            status__in=['unconfirmed', 'confirmed'],
            parent_target__isnull=True
        ).exclude(pk=self.pk)

        for target in main_targets:
            distance = haversine(self.longitude, self.latitude, target.longitude, target.latitude)
            if distance <= 2:  # 2 km radius
                # Check if user already reported
                if not Target.objects.filter(parent_target=target, author=self.author).exists():
                    self.parent_target = target
                    self.save(update_fields=['parent_target'])
                    target.update_aggregation()
                return

        # Look for pending targets to form a cluster
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
            if distance <= 2 and target.author_id not in unique_authors:
                cluster.append(target)
                unique_authors.add(target.author_id)

        # Need 5 reports from different users to become unconfirmed
        if len(cluster) >= 5:
            # This target becomes the main one
            avg_lat = sum(t.latitude for t in cluster) / len(cluster)
            avg_lon = sum(t.longitude for t in cluster) / len(cluster)
            
            self.latitude = avg_lat
            self.longitude = avg_lon
            self.status = 'unconfirmed'
            self.title = f"{self.get_target_type_display().upper()}"
            self.save(update_fields=['latitude', 'longitude', 'status', 'title'])

            # Link other targets as children
            for target in cluster:
                if target.pk != self.pk:
                    target.parent_target = self
                    target.save(update_fields=['parent_target'])

            self.update_aggregation()

    def update_aggregation(self):
        """Update probability based on child reports"""
        children = Target.objects.filter(parent_target=self)
        self.report_count = children.count() + 1  # +1 for self

        # Calculate weighted score
        total_weight = self._get_author_weight()
        for child in children:
            total_weight += child._get_author_weight()

        self.weighted_score = total_weight

        # Determine probability
        if self.weighted_score >= 10 or self.report_count >= 15:
            self.probability = 'high'
        elif self.weighted_score >= 6 or self.report_count >= 8:
            self.probability = 'medium'
        else:
            self.probability = 'low'

        self.save(update_fields=['report_count', 'weighted_score', 'probability'])

    def _get_author_weight(self):
        """Get weight based on author's trust rating"""
        if hasattr(self.author, 'profile'):
            rating = self.author.profile.trust_rating
            return 1 + (rating / 10)  # -5 -> 0.5, 0 -> 1, +5 -> 1.5
        return 1.0

    def confirm(self):
        """Admin confirms - reward all reporters"""
        from django.utils import timezone
        self.status = 'confirmed'
        self.resolved_at = timezone.now()
        self.save(update_fields=['status', 'resolved_at'])

        # Reward this author
        self._adjust_author_rating(0.25)

        # Reward child reporters
        for child in Target.objects.filter(parent_target=self):
            child.status = 'confirmed'
            child.save(update_fields=['status'])
            child._adjust_author_rating(0.25)

    def reject(self):
        """Admin rejects (false alarm) - penalize all reporters"""
        from django.utils import timezone
        self.status = 'rejected'
        self.resolved_at = timezone.now()
        self.save(update_fields=['status', 'resolved_at'])

        # Penalize this author
        self._adjust_author_rating(-0.25)

        # Penalize child reporters
        for child in Target.objects.filter(parent_target=self):
            child.status = 'rejected'
            child.save(update_fields=['status'])
            child._adjust_author_rating(-0.25)

    def _adjust_author_rating(self, amount):
        """Adjust author's trust rating"""
        if hasattr(self.author, 'profile'):
            new_rating = self.author.profile.trust_rating + amount
            self.author.profile.trust_rating = max(-5, min(5, new_rating))
            self.author.profile.save(update_fields=['trust_rating'])


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