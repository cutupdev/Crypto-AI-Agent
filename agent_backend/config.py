import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    # MongoDB Configuration
    MONGODB_URL = os.getenv("MONGODB_URL")

    # JWT Configuration
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30

    # Credit Configuration
    INIT_CREDIT_BALANCE = int(os.getenv("INIT_CREDIT_BALANCE", "0"))
    CREDIT_COST_PER_OPENAI_REQUEST = int(os.getenv("CREDIT_COST_PER_OPENAI_REQUEST", "0"))
    CREDIT_COST_PER_D_ID_REQUEST = int(os.getenv("CREDIT_COST_PER_D_ID_REQUEST", "0"))
    CREDIT_COST_PER_ELEVENLABS_REQUEST = int(os.getenv("CREDIT_COST_PER_ELEVENLABS_REQUEST", "0"))

    # D-ID Configuration
    DID_API_KEY = os.getenv("DID_API_KEY")

    # ElevenLabs Configuration
    ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
    ELEVENLABS_DEFAULT_VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID")

    # OpenAI Configuration
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

    @classmethod
    def validate(cls):
        """Validate required environment variables"""
        required_vars = [
            ("MONGODB_URL", cls.MONGODB_URL),
            ("JWT_SECRET_KEY", cls.JWT_SECRET_KEY),
            ("OPENAI_API_KEY", cls.OPENAI_API_KEY),
        ]

        missing_vars = [var[0] for var in required_vars if not var[1]]

        if missing_vars:
            raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")

# Create config instance
config = Config()

# Validate configuration on import
config.validate()