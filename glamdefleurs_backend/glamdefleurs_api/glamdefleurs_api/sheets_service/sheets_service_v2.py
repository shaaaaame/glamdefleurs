import httplib2
import os
import ast
import pandas as pd

from apiclient import discovery
from googleapiclient.errors import HttpError

from glamdefleurs_api.gcloud_manager import get_credentials

SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

def read_spreadsheet(spreadsheet_id, range):
    """
    Reads spreadsheet and returns rows of flowers.
    """
    creds = get_credentials()

    try:
        service = discovery.build('sheets', 'v4', credentials=creds)

        # Call the Sheets API
        sheet = service.spreadsheets()
        result = sheet.values().get(spreadsheetId=spreadsheet_id,
                                    range=range).execute()
        values = result.get('values', [])

        if not values:
            print('No data found.')
            return

        del values[0]

        #convert values into dataframe to ensure blank cells accounted for
        df = pd.DataFrame(values)
        processed_dataset = df.values.tolist()

        return processed_dataset

    except HttpError as err:
        print(f"An error has occured: {err}")
        return None


def write_to_spreadsheet(spreadsheet_id, range, values):
    """
    Write to spreadsheet
    """
    creds = get_credentials()

    try:
        service = discovery.build('sheets', 'v4', credentials=creds)
        data = {
            'range': range,
            'values': values
        }
        body = {
            'valueInputOption': 'USER_ENTERED',
            'data': data
        }
        result = service.spreadsheets().values().batchUpdate(
            spreadsheetId=spreadsheet_id, body=body).execute()
        print(f"{result.get('updatedCells')} cells updated.")
        return result

    except HttpError as error:
        print(f"An error occurred: {error}")
        return error

def write_multiple_ranges(spreadsheet_id, ranges_value_dict):
    """
    Write values to multiple ranges

    Takes in spreadsheet id and dictionary in the form of range: value
    """
    creds = get_credentials()

    try:
        service = discovery.build('sheets', 'v4', credentials=creds)
        data = [
            {
                'range': key,
                'values': ranges_value_dict[key]
            } for key in ranges_value_dict.keys()
        ]
        body = {
            'valueInputOption': 'USER_ENTERED',
            'data': data
        }
        result = service.spreadsheets().values().batchUpdate(
            spreadsheetId=spreadsheet_id, body=body).execute()
        print(f"{result.get('updatedCells')} cells updated.")
        return result
    except HttpError as error:
        print(f"An error occurred: {error}")
        return error