from core.database import users_collection
from core.logger import logger

def get_user(email: str):
    try:
        user = users_collection.find_one({"email": email})
        return user
    except Exception as e:
        logger.error(f"Database error in get_user: {e}")
        return None

def get_user_credit_balance(email: str) -> int:
    """
    Get the credit balance for a user
    Returns the credit balance or raises Exception if user not found
    """
    try:
        user = get_user(email)
        if not user:
            raise Exception("User not found")
        return int(user.get("credit", 0))
    except Exception as e:
        logger.error(f"Error getting credit balance for user {email}: {e}")
        raise Exception("Failed to retrieve credit balance")

def consume_credits(email: str, amount: int, desc: str="") -> bool:
    """
    Consume credits from user's balance
    Returns True if successful, False if insufficient credits
    Raises Exception for other errors
    """
    if amount <= 0:
        raise Exception("`amount` must be a positive value.")

    balance = get_user_credit_balance(email)
    if balance < amount:
        raise Exception(f"Your balance {balance} is less than amount {amount}.")

    try:
        # Atomic update operation that checks balance and updates in one operation
        result = users_collection.update_one(
            {
                "email": email,
                "credit": {"$gte": amount}
            },
            {"$inc": {"credit": -amount}}
        )

        if desc:
            print(f"{email} consumes credits {amount} for {desc}")

        if result.modified_count == 0:
            # Check if user exists
            user = get_user(email)
            if not user:
                raise Exception("User not found")
            return False  # Insufficient credits

        return True

    except Exception as e:
        logger.error(f"Error consuming credits for user {email}: {e}")
        raise Exception("Failed to consume credits")