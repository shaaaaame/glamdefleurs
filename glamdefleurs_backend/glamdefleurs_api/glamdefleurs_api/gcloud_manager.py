"""
Run this file to get credentials
"""
import os
from google.oauth2 import service_account

from dotenv import load_dotenv
import ast

SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

def get_credentials():
    """
    Return the credentials given by token.json or login
    """
    load_dotenv()

    service_account_info = ast.literal_eval(os.environ["SERVICE_SECRET"])
    creds = service_account.Credentials.from_service_account_info(service_account_info)

    return creds