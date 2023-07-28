from django.shortcuts import render
from shop.models import Order, Customer
from shop.serializers import OrderSerializer, CustomerSerializer
from rest_framework import permissions, viewsets

class OrderViewSet(viewsets.ModelViewset):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.DjangoModelPermissionsOrAnonReadOnly]

class CustomerViewSet(viewsets.ModelViewset):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [permissions.DjangoModelPermissionsOrAnonReadOnly]

