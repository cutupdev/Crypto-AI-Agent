import requests
import json
import time
from config import config
from database.helper import consume_credits


def upload_avatar_d_id(files: dict, email=None):
    '''
    Parameters:
    ===========
    `files`: {"file": (filename, file, content_type)}
    '''

    if email:
        consume_credits(email, config.CREDIT_COST_PER_D_ID_REQUEST, "uploading avatar (D-ID)")

    try:
        url = "https://api.d-id.com/images"

        headers = {
            "accept": "application/json",
            "Authorization": f"Basic {config.DID_API_KEY}"
        }

        response = requests.post(url, files=files, headers=headers)

        res = json.loads(response.text)
        print(res)
        return res.get("url")
    except:
        return None


voice_configs = {
    "neutral": {
        "stability": 0.55,
        "similarity_boost": 0.8,
        "style": 0.5
    },
    "happy": {
        "stability": 0.45,
        "similarity_boost": 0.8,
        "style": 0.7
    },
    "surprise": {
        "stability": 0.40,
        "similarity_boost": 0.8,
        "style": 0.8
    },
    "serious": {
        "stability": 0.65,
        "similarity_boost": 0.8,
        "style": 0.4
    }
}

def generate_talking_avatar_with_text(image_url, text, emotion, el_voice_id, email=None):
    """Calls the D-ID API to create a talking avatar."""
    if not el_voice_id:
        el_voice_id = config.ELEVENLABS_DEFAULT_VOICE_ID

    if email:
        consume_credits(email, config.CREDIT_COST_PER_D_ID_REQUEST, "generating talking avatar from text (D-ID)")

    url = "https://api.d-id.com/talks"
    headers = {
        "Authorization": f"Basic {config.DID_API_KEY}",
        "Content-Type": "application/json",
        # "authorization": f"Bearer {DID_API_KEY}"
    }
    print(voice_configs[emotion])
    payload = {
        "source_url": image_url,
        "script": {
            "type": "text",
            "subtitles": "false",
            "provider": {
                "type": "elevenlabs",
                "voice_id": el_voice_id,
                "voice_config": voice_configs[emotion]
            },
            "input": text
        },
        "config": {
            # "fluent": "true",
            "driver_expressions": {
                "expressions": [
                    {
                      "start_frame": 0,
                      "expression": emotion,
                      "intensity": 1
                    }
                ]
            },
            "stitch": True,
            "align_driver": False
        },
    }
    try:
        print(f'Generating talking avatar for image {image_url}...')
        response = requests.post(url, json=payload, headers=headers)
        if response.status_code == 201:
            video_id = response.json().get("id")
            print(f"Talking avatar is being processed. Video ID: {video_id}")
            return video_id
        else:
            print(f"Error creating avatar: {response.text}")
            return None
    except Exception as e:
        print(e)


# Check Video Status & Download
def check_d_id_video_status(video_id, email=None):
    """Polls the D-ID API to check if the video is ready."""
    url = f"https://api.d-id.com/talks/{video_id}"
    headers = {"Authorization": f"Basic {config.DID_API_KEY}"}

    while True:
        if email:
            consume_credits(email, config.CREDIT_COST_PER_D_ID_REQUEST, "checking video status (D-ID)")

        response = requests.get(url, headers=headers)
        status = response.json().get("status")

        if status == "done":
            video_url = response.json().get("result_url")
            print(f"Video Ready! Download it here: {video_url}")
            return video_url
        elif status in ["failed", "error"]:
            print("Video generation failed.")
            return None
        else:
            print("Processing... Checking again in 5 seconds. Response status:", status)
            time.sleep(5)

def get_D_ID_Video_from_text(image_url, text, emotion='neutral', el_voice_id=None, email=None):
    print(image_url)
    if not image_url:
        print("File upload failed. Exiting...")
        return None

    video_id = generate_talking_avatar_with_text(image_url, text, emotion, el_voice_id, email)
    print(video_id)
    if not video_id:
        print("Failed to generate video. Exiting...")
        return None
    video_url = check_d_id_video_status(video_id, email)
    print(video_url)
    if video_url:
        print(f"Download your avatar video: {video_url}")

    return video_url