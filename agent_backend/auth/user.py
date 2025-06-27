from database.helper import get_user
from auth.verify import verify_password
from core.logger import logger


def authenticate_user(email: str, password: str):
    try:
        user = get_user(email)
        if not user:
            return False
        if not verify_password(password, user["password"]):
            return False
        return user
    except Exception as e:
        logger.error(f"Authentication error: {e}")
        return False
