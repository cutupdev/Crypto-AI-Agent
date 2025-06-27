import os

# Convert OGA to WAV (requires FFmpeg installed)
def convert_to_wav(input_path):
    output_path = os.path.splitext(input_path)[0] + '.wav'
    os.system(f"ffmpeg -i {input_path} {output_path}")
    os.remove(input_path)  # Remove the OGA file
    return output_path

# Convert MP4 to WAV (requires FFmpeg installed)
def convert_mp4_to_wav(input_path):
    output_path = os.path.splitext(input_path)[0] + '.wav'
    os.system(f"ffmpeg -i {input_path} -vn -acodec pcm_s16le -ar 44100 -ac 2 {output_path}")
    os.remove(input_path)  # Remove the MP4 file
    return output_path