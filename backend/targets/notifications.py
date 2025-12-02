import requests
import math
from django.conf import settings


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the distance between two points on Earth using Haversine formula.
    Returns distance in kilometers.
    """
    R = 6371  # Earth's radius in kilometers

    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)

    a = math.sin(delta_lat / 2) ** 2 + \
        math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c


def send_telegram_notification(chat_id: str, message: str) -> bool:
    """
    Send a notification to a Telegram user.
    Returns True if successful, False otherwise.
    """
    bot_token = getattr(settings, 'TELEGRAM_BOT_TOKEN', None)
    
    if not bot_token:
        print("Warning: TELEGRAM_BOT_TOKEN not configured")
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
        return response.status_code == 200 and result.get('ok', False)
    except requests.RequestException as e:
        print(f"Error sending Telegram notification: {e}")
        return False


def notify_users_about_threat(target) -> int:
    """
    Notify all users within 30km radius about a new threat.
    Returns the number of users notified.
    """
    from users.models import UserProfile
    
    ALERT_RADIUS_KM = 30
    notified_count = 0
    
    # Get all users with location and telegram configured
    users_with_location = UserProfile.objects.filter(
        last_latitude__isnull=False,
        last_longitude__isnull=False,
        telegram_chat_id__isnull=False,
        notifications_enabled=True
    ).exclude(telegram_chat_id='')
    
    threat_types = {
        'drone': '🛸 DRON',
        'rocket': '🚀 RAKIETA',
        'plane': '✈️ SAMOLOT',
        'helicopter': '🚁 ŚMIGŁOWIEC',
        'bang': '💥 WYBUCH',
    }
    
    threat_name = threat_types.get(target.target_type, '⚠️ ZAGROŻENIE')
    
    for profile in users_with_location:
        distance = haversine_distance(
            profile.last_latitude,
            profile.last_longitude,
            target.latitude,
            target.longitude
        )
        
        if distance <= ALERT_RADIUS_KM:
            message = (
                f"🚨 <b>ZAGROŻENIE Z POWIETRZA!</b> 🚨\n\n"
                f"Typ: {threat_name}\n"
                f"Odległość: {distance:.1f} km od Twojej lokalizacji\n"
                f"Opis: {target.title}\n\n"
                f"⚠️ Szukaj najbliższego schronienia!"
            )
            
            if send_telegram_notification(profile.telegram_chat_id, message):
                notified_count += 1
    
    return notified_count


def notify_all_clear() -> int:
    """
    Notify all users that all threats have been cleared.
    Returns the number of users notified.
    """
    from users.models import UserProfile
    from .models import Target
    
    # Check if there are any active confirmed threats
    active_threats = Target.objects.filter(status='confirmed').count()
    if active_threats > 0:
        return 0
    
    notified_count = 0
    
    users_with_telegram = UserProfile.objects.filter(
        telegram_chat_id__isnull=False,
        notifications_enabled=True
    ).exclude(telegram_chat_id='')
    
    message = (
        "✅ <b>ALARM ODWOŁANY</b> ✅\n\n"
        "Wszystkie zagrożenia zostały usunięte.\n"
        "Możesz bezpiecznie kontynuować swoje zajęcia.\n\n"
        "🛡️ Dziękujemy za korzystanie z SkyGuard!"
    )
    
    for profile in users_with_telegram:
        if send_telegram_notification(profile.telegram_chat_id, message):
            notified_count += 1
    
    return notified_count
