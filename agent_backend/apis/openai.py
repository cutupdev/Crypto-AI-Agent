from openai import OpenAI
from config import config
from database.helper import consume_credits


client = OpenAI(api_key=config.OPENAI_API_KEY)

# Function to interact with OpenAI API
async def generate_response(prompt: str, email=None) -> str:
    if email:
        consume_credits(email, config.CREDIT_COST_PER_OPENAI_REQUEST, "generating response (OpenAI)")

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return "Sorry, I couldn't process your request. Please try again."

# Function to interact with OpenAI API
async def generate_response_v2(messages: list, email=None) -> str:
    if email:
        consume_credits(email, config.CREDIT_COST_PER_OPENAI_REQUEST, "generating response (OpenAI)")

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return "Sorry, I couldn't process your request. Please try again."

# Transcribe audio using OpenAI Whisper
def transcribe_audio(file_path, email=None):
    if email:
        consume_credits(email, config.CREDIT_COST_PER_OPENAI_REQUEST, "transcribing audio (OpenAI)")

    with open(file_path, "rb") as audio_file:
        transcript = client.audio.transcriptions.create(model="whisper-1", file=audio_file)
    return transcript.text