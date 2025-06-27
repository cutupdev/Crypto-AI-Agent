import requests
from config import config
from database.helper import consume_credits


# Generate voice using ElevenLabs
def generate_voice(text, output_path, el_voice_id, email=None):
    if email:
        consume_credits(email, config.CREDIT_COST_PER_ELEVENLABS_REQUEST, "generating voice (ElevenLabs)")

    if not el_voice_id:
        el_voice_id = config.ELEVENLABS_DEFAULT_VOICE_ID
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{el_voice_id}"
    headers = {
        "Accept": "audio/mpeg",
        "xi-api-key": config.ELEVENLABS_API_KEY,
        "Content-Type": "application/json"
    }
    data = {
        "text": text,
        "voice_settings": {"stability": 0.55, "similarity_boost": 0.8, "style": 0.5}
    }
    response = requests.post(url, headers=headers, json=data)
    with open(output_path, "wb") as audio_file:
        audio_file.write(response.content)

def getAllAvailableVoices():
    try:
        url = f"https://api.elevenlabs.io/v1/voices"
        headers = {
            # "xi-api-key": ELEVENLABS_API_KEY,
            "Content-Type": "application/json"
        }
        response = requests.get(url, headers=headers)
        data = response.json()
        voices = [{'voice_id': d['voice_id'], 'name': d['name']} for d in data['voices']]
        voices = sorted(voices, key=lambda x: x['name'])
        return voices
    except Exception as e:
        print(e)
        return []