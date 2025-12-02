from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    RegisterView, 
    UserRatingView, 
    CurrentUserView, 
    AvatarUploadView,
    UpdateLocationView,
    UpdateTelegramView,
    GenerateTelegramLinkView,
    TelegramWebhookView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('me/', CurrentUserView.as_view(), name='current_user'),
    path('me/avatar/', AvatarUploadView.as_view(), name='avatar_upload'),
    path('me/location/', UpdateLocationView.as_view(), name='update_location'),
    path('me/telegram/', UpdateTelegramView.as_view(), name='update_telegram'),
    path('me/telegram/link/', GenerateTelegramLinkView.as_view(), name='telegram_link'),
    path('telegram/webhook/', TelegramWebhookView.as_view(), name='telegram_webhook'),
    path('users/<int:pk>/rating/', UserRatingView.as_view(), name='user_rating'),
]