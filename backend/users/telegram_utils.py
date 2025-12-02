import requests
from django.conf import settings

# Hardcoded bot username for reliability
BOT_USERNAME = "utoczki_sky_guard_bot"


def generate_link_code(user):
    """Generate a unique code for linking Telegram account using database"""
    from .models import TelegramLinkCode
    link = TelegramLinkCode.create_for_user(user)
    return link.code


def get_user_by_code(code: str):
    """Get user by link code from database"""
    from .models import TelegramLinkCode
    user, link = TelegramLinkCode.get_user_by_code(code)
    return user, link


def get_bot_username() -> str:
    """Get the bot's username"""
    return BOT_USERNAME


def send_telegram_message(chat_id: str, message: str) -> bool:
    """Send a message to a Telegram user"""
    bot_token = getattr(settings, 'TELEGRAM_BOT_TOKEN', None)
    
    if not bot_token:
        print("ERROR: TELEGRAM_BOT_TOKEN not configured!")
        return False
    
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    
    payload = {
        'chat_id': chat_id,
        'text': message,
        'parse_mode': 'HTML'
    }
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        result = response.json()
        print(f"Telegram send result: {result}")
        return response.status_code == 200 and result.get('ok', False)
    except requests.RequestException as e:
        print(f"Error sending Telegram message: {e}")
        return False
