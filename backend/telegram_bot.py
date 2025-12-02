#!/usr/bin/env python3
import os
import sys
import time
import requests
import django

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

from pathlib import Path
from dotenv import load_dotenv
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / '.env')

django.setup()

from django.conf import settings
from users.models import UserProfile, TelegramLinkCode
from users.telegram_utils import get_user_by_code

BOT_TOKEN = getattr(settings, 'TELEGRAM_BOT_TOKEN', None) or os.getenv('TELEGRAM_BOT_TOKEN')
API_URL = f"https://api.telegram.org/bot{BOT_TOKEN}"


def send_message(chat_id: str, text: str):
    url = f"{API_URL}/sendMessage"
    payload = {
        'chat_id': chat_id,
        'text': text,
        'parse_mode': 'HTML'
    }
    try:
        requests.post(url, json=payload, timeout=10)
    except Exception as e:
        print(f"Error sending message: {e}")


def handle_message(message: dict):
    chat_id = str(message['chat']['id'])
    text = message.get('text', '')
    username = message['from'].get('username', 'User')
    
    print(f"Message from {username} ({chat_id}): {text}")
    
    if text.startswith('/start '):
        code = text.split(' ', 1)[1].strip().upper()
        user, link = get_user_by_code(code)
        
        if user and link:
            if not hasattr(user, 'profile'):
                UserProfile.objects.create(user=user)
            
            profile = user.profile
            profile.telegram_chat_id = chat_id
            profile.notifications_enabled = True
            profile.save()
            
            link.mark_used()
            
            send_message(
                chat_id,
                f"✅ <b>Połączono pomyślnie!</b>\n\n"
                f"Twoje konto <b>{user.username}</b> zostało połączone z tym czatem.\n\n"
                f"Teraz będziesz otrzymywać powiadomienia o zagrożeniach w promieniu 30 km od Twojej lokalizacji.\n\n"
                f"🔔 Upewnij się, że zaktualizowałeś swoją lokalizację w aplikacji!"
            )
            print(f"Linked user {user.username} to chat {chat_id}")
            return
        
        send_message(
            chat_id,
            "❌ <b>Nieprawidłowy lub wygasły kod.</b>\n\n"
            "Wygeneruj nowy kod w aplikacji i spróbuj ponownie."
        )
    
    elif text == '/start':
        send_message(
            chat_id,
            "👋 <b>Witaj w SkyGuard Bot!</b>\n\n"
            "Aby połączyć swoje konto:\n"
            "1. Otwórz aplikację SkyGuard\n"
            "2. Przejdź do zakładki Profile\n"
            "3. Kliknij 'Connect Telegram'\n"
            "4. Kliknij wygenerowany link\n\n"
            "Po połączeniu będziesz otrzymywać powiadomienia o zagrożeniach! 🚨"
        )
    
    elif text == '/status':
        try:
            profile = UserProfile.objects.get(telegram_chat_id=chat_id)
            user = profile.user
            location = "nie ustawiona"
            if profile.last_latitude and profile.last_longitude:
                location = f"{profile.last_latitude:.4f}, {profile.last_longitude:.4f}"
            
            send_message(
                chat_id,
                f"📊 <b>Status konta</b>\n\n"
                f"👤 Użytkownik: <b>{user.username}</b>\n"
                f"📍 Lokalizacja: {location}\n"
                f"🔔 Powiadomienia: {'✅ włączone' if profile.notifications_enabled else '❌ wyłączone'}"
            )
        except UserProfile.DoesNotExist:
            send_message(
                chat_id,
                "❌ Ten czat nie jest połączony z żadnym kontem.\n\n"
                "Użyj aplikacji SkyGuard, aby połączyć konto."
            )
    
    elif text == '/help':
        send_message(
            chat_id,
            "📖 <b>Dostępne komendy:</b>\n\n"
            "/start - Rozpocznij i połącz konto\n"
            "/status - Sprawdź status konta\n"
            "/help - Pokaż tę wiadomość\n\n"
            "🚨 Powiadomienia o zagrożeniach są wysyłane automatycznie!"
        )


def poll_updates():
    print("SkyGuard Telegram Bot started!")
    print("Listening for messages... (Press Ctrl+C to stop)\n")
    
    offset = 0
    
    while True:
        try:
            url = f"{API_URL}/getUpdates"
            params = {
                'offset': offset,
                'timeout': 30
            }
            
            response = requests.get(url, params=params, timeout=35)
            data = response.json()
            
            if data.get('ok') and data.get('result'):
                for update in data['result']:
                    offset = update['update_id'] + 1
                    
                    if 'message' in update:
                        handle_message(update['message'])
        
        except KeyboardInterrupt:
            print("\nBot stopped.")
            break
        except Exception as e:
            print(f"Error: {e}")
            time.sleep(5)


if __name__ == '__main__':
    if not BOT_TOKEN:
        print("Error: TELEGRAM_BOT_TOKEN not set in environment")
        print("Make sure to load .env file or set the variable")
        sys.exit(1)
    
    poll_updates()
