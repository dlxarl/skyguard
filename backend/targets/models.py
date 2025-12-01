from django.db import models
from django.contrib.auth.models import User

class Target(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
    )

    TYPE_CHOICES = (
        ('drone', 'Drone'),
        ('rocket', 'Rocket'),
        ('plane', 'Plane'),
        ('helicopter', 'Helicopter'),
        ('explosion', 'Explosion'),
        ('other', 'Other'),
    )

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    target_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='other')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title