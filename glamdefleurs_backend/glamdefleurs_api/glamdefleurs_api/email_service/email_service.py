"""
Interface email functions for main program to use.
"""
import base64
import os
from email.message import EmailMessage

import google.auth
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from glamdefleurs_api.gcloud_manager import get_credentials

def send_email(content, to, subject=""):
    """
    Create and send an email message
    Print the returned  message id
    Returns: Message object, including message id
    """
    creds = get_credentials()

    try:
        service = build('gmail', 'v1', credentials=creds)
        message = EmailMessage()

        message.set_content(content)

        message['To'] = to
        message['From'] = 'glamdefleursnotifications@gmail.com'
        message['Subject'] = subject

        # encoded message
        encoded_message = base64.urlsafe_b64encode(message.as_bytes()) \
            .decode()

        create_message = {
            'raw': encoded_message
        }

        # pylint: disable=E1101
        send_message = (service.users().messages().send(userId="me", body=create_message).execute())
        print(F'Message Id: {send_message["id"]}')
    except HttpError as error:
        print(F'An error occurred: {error}')
        send_message = None

    return send_message
