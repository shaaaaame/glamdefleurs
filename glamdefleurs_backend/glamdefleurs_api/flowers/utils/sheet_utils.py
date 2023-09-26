import re

def extract_photo_drive_id(drive_url):
    photo_id = re.search('drive.google.com/file/d/(.*)/view', drive_url).group(1)
    return photo_id

def get_photo_url(drive_url):
    """
    Converts a drive url to a photo url.
    """

    if "file" in drive_url:
        photo_id = extract_photo_drive_id(drive_url)
        photo = f"https://drive.google.com/uc?export=view&id={photo_id}"
    else:
        return drive_url

    return photo