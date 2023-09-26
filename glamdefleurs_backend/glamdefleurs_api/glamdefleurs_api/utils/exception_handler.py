from __future__ import unicode_literals
from django.db import Error
from rest_framework.views import Response, exception_handler
from rest_framework import status
from rest_framework.exceptions import APIException, ErrorDetail



def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first to get the standard error response.
    response = exception_handler(exc, context)

    if isinstance(exc, APIException):

        error_string = ""
        for key in exc.detail.keys():
            if isinstance(exc.detail[key][0], ErrorDetail):
                error_string += exc.detail[key][0].title() + "\n"
            else:
                error_string += str(exc.detail[key])

        response = Response(
            {
                'error_message': error_string
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # if there is an IntegrityError and the error response hasn't already been generated
    if isinstance(exc, Error) and not response:
        response = Response(
            {
                'error_message': str(exc),
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    return response