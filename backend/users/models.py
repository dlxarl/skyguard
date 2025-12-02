from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from datetime import timedelta


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    trust_rating = models.FloatField(default=0)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    bio = models.TextField(blank=True, max_length=500)
    
    # Location for notifications
    last_latitude = models.FloatField(null=True, blank=True)
    last_longitude = models.FloatField(null=True, blank=True)
    
    # Telegram integration
    telegram_chat_id = models.CharField(max_length=100, blank=True, null=True)
    notifications_enabled = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user.username} - Rating: {self.trust_rating}"

    class Meta:
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'


class TelegramLinkCode(models.Model):
    """Store Telegram link codes in database for cross-process access"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=20, unique=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)

    def is_valid(self):
        return not self.used and timezone.now() < self.expires_at

    @classmethod
    def create_for_user(cls, user):
        import secrets
        # Delete old codes for this user
        cls.objects.filter(user=user).delete()
        # Create new code
        code = secrets.token_hex(4).upper()  # 8 character hex code
        expires_at = timezone.now() + timedelta(minutes=10)
        return cls.objects.create(user=user, code=code, expires_at=expires_at)

    @classmethod
    def get_user_by_code(cls, code):
        try:
            link = cls.objects.get(code=code.upper(), used=False)
            if link.is_valid():
                return link.user, link
            return None, None
        except cls.DoesNotExist:
            return None, None

    def mark_used(self):
        self.used = True
        self.save()


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if hasattr(instance, 'profile'):
        instance.profile.save()
