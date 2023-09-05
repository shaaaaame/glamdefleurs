from django.shortcuts import render
from shop.models import Order, Customer
from shop.serializers import OrderSerializer, CustomerSerializer, AddressSerializer
from rest_framework import permissions, viewsets, mixins, status
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from django.http.response import HttpResponseForbidden

import os
from dotenv import load_dotenv

import requests

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        load_dotenv()

        ID = os.environ.get("PAYPAL_CLIENT_ID")
        SECRET = os.environ.get("PAYPAL_SECRET")

        data = { 'grant_type': 'client_credentials' }
        headers= {'Accept': 'application/json','Accept-Language': 'en_US'}
        response = requests.post(url="https://api.sandbox.paypal.com/v1/oauth2/token/", data=data, headers=headers, auth=(ID, SECRET)).json()
        access_token = response['access_token']

        headers = { 'Authorization' : f'Bearer {access_token}'}
        order = requests.get(url=f"https://api-m.sandbox.paypal.com/v2/checkout/orders/{request.data['payment_id']}", headers=headers).json()

        if order["status"] == "COMPLETED":
            return super().create(request, *args, **kwargs)
        else:
            raise Exception("Invalid payment")

    def get_queryset(self):
        queryset = Order.objects.all()
        id = self.request.query_params.get('id')


        if id is not None:
            queryset = queryset.filter(customer_id=id)

        return queryset.distinct()

class DetailCustomers(APIView):
    authentication_classes = (TokenAuthentication,)

    def get(self, request, format=None):
        if request.user.is_authenticated:
            customer = request.user.customer
            address_serializer = AddressSerializer(customer.address)
            data = {
                "id": customer.id,
                "username" : request.user.username,
                "first_name" : request.user.first_name,
                "last_name" : request.user.last_name,
                "email" : request.user.email,
                "phone_number" : customer.phone_number,
                "dob" : customer.dob,
                "address" : address_serializer.data,
            }

            return Response(data)
        else:
            return HttpResponseForbidden("not authenticated")

    def patch(self, request, pk=None):
        customer = request.user.customer
        serializer = CustomerSerializer(customer, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(data="Success!", status=status.HTTP_200_OK)

        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CreateCustomer(APIView):
    queryset = Customer.objects.all()
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(data="Create user success!", status=status.HTTP_200_OK)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)










