from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaIoBaseDownload
import io
from django.core.files import File


from glamdefleurs_api.gcloud_manager import get_credentials

def download_file(file_id):
    """
    Reads spreadsheet and returns rows of flowers.
    """

    creds = get_credentials()

    try:
        service = build('drive', 'v3', credentials=creds)

        request = service.files().get_media(fileId=file_id)
        file = io.BytesIO()
        downloader = MediaIoBaseDownload(file, request)
        done = False
        while done is False:
            status, done = downloader.next_chunk()

        return File(file)

    except HttpError as err:
        print(f"An error has occured: {err}")
        return None
