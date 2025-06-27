# Download voice file from Telegram
async def download_voice_file(file_id, context):
    file = await context.bot.get_file(file_id)  # Await the coroutine
    file_path = f"{file_id}.oga"
    await file.download_to_drive(file_path)  # Await the file download
    return file_path

# Download video file from Telegram
async def download_video_file(file_id, context):
    file = await context.bot.get_file(file_id)  # Await the coroutine
    file_path = f"{file_id}.mp4"
    await file.download_to_drive(file_path)  # Await the file download
    return file_path