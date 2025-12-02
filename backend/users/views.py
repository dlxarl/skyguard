from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, UserSerializer, UserUpdateSerializer
from .models import UserProfile
from .telegram_utils import generate_link_code, get_user_by_code, get_bot_username, send_telegram_message


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer


class CurrentUserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        if not hasattr(request.user, 'profile'):
            UserProfile.objects.create(user=request.user)
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        if not hasattr(request.user, 'profile'):
            UserProfile.objects.create(user=request.user)
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(UserSerializer(request.user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AvatarUploadView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        if not hasattr(request.user, 'profile'):
            UserProfile.objects.create(user=request.user)
        
        if 'avatar' not in request.FILES:
            return Response({'error': 'No avatar provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        profile = request.user.profile
        profile.avatar = request.FILES['avatar']
        profile.save()
        
        return Response(UserSerializer(request.user).data)


class UserRatingView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            if not hasattr(user, 'profile'):
                UserProfile.objects.create(user=user)
            rating = user.profile.trust_rating
            return Response({'user_id': user.id, 'rating': rating})
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class UpdateLocationView(APIView):
    """Update user's last known location for threat notifications"""
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        if not hasattr(request.user, 'profile'):
            UserProfile.objects.create(user=request.user)
        
        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')
        
        if latitude is None or longitude is None:
            return Response(
                {'error': 'latitude and longitude are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            profile = request.user.profile
            profile.last_latitude = float(latitude)
            profile.last_longitude = float(longitude)
            profile.save()
            
            return Response({
                'status': 'Location updated',
                'latitude': profile.last_latitude,
                'longitude': profile.last_longitude
            })
        except ValueError:
            return Response(
                {'error': 'Invalid coordinates'},
                status=status.HTTP_400_BAD_REQUEST
            )


class UpdateTelegramView(APIView):
    """Update user's Telegram chat ID for notifications"""
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        if not hasattr(request.user, 'profile'):
            UserProfile.objects.create(user=request.user)
        
        chat_id = request.data.get('telegram_chat_id')
        notifications_enabled = request.data.get('notifications_enabled', True)
        
        profile = request.user.profile
        
        if chat_id is not None:
            profile.telegram_chat_id = str(chat_id)
        
        profile.notifications_enabled = notifications_enabled
        profile.save()
        
        return Response({
            'status': 'Telegram settings updated',
            'telegram_chat_id': profile.telegram_chat_id,
            'notifications_enabled': profile.notifications_enabled
        })


class GenerateTelegramLinkView(APIView):
    """Generate a link code for connecting Telegram"""
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        code = generate_link_code(request.user)
        bot_username = get_bot_username()
        
        return Response({
            'code': code,
            'bot_username': bot_username,
            'bot_link': f"https://t.me/{bot_username}?start={code}" if bot_username else None,
            'expires_in': 600  # 10 minutes
        })


class TelegramWebhookView(APIView):
    """Handle Telegram bot webhook for linking accounts"""
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        data = request.data
        
        # Handle /start command with link code
        if 'message' in data:
            message = data['message']
            chat_id = str(message['chat']['id'])
            text = message.get('text', '')
            
            if text.startswith('/start '):
                code = text.split(' ', 1)[1].strip()
                user, link = get_user_by_code(code)
                
                if user and link:
                    if not hasattr(user, 'profile'):
                        UserProfile.objects.create(user=user)
                    
                    profile = user.profile
                    profile.telegram_chat_id = chat_id
                    profile.notifications_enabled = True
                    profile.save()
                    
                    link.mark_used()
                    
                    send_telegram_message(
                        chat_id,
                        f"✅ <b>Połączono pomyślnie!</b>\n\n"
                        f"Twoje konto <b>{user.username}</b> zostało połączone z tym czatem.\n\n"
                        f"Teraz będziesz otrzymywać powiadomienia o zagrożeniach w promieniu 30 km od Twojej lokalizacji.\n\n"
                        f"🔔 Upewnij się, że zaktualizowałeś swoją lokalizację w aplikacji!"
                    )
                    
                    return Response({'status': 'linked'})
                
                send_telegram_message(
                    chat_id,
                    "❌ <b>Nieprawidłowy lub wygasły kod.</b>\n\n"
                    "Wygeneruj nowy kod w aplikacji i spróbuj ponownie."
                )
            
            elif text == '/start':
                send_telegram_message(
                    chat_id,
                    "👋 <b>Witaj w SkyGuard Bot!</b>\n\n"
                    "Aby połączyć swoje konto:\n"
                    "1. Otwórz aplikację SkyGuard\n"
                    "2. Przejdź do zakładki Profile\n"
                    "3. Kliknij 'Connect Telegram'\n"
                    "4. Kliknij wygenerowany link lub skopiuj kod\n\n"
                    "Po połączeniu będziesz otrzymywać powiadomienia o zagrożeniach!"
                )
        
        return Response({'status': 'ok'})