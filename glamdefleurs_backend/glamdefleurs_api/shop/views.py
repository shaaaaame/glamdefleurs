from django.shortcuts import render
from shop.models import Order, Customer
from shop.serializers import OrderSerializer, CustomerSerializer
from rest_framework import permissions, viewsets, mixins, status
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from django.http.response import HttpResponseForbidden

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.DjangoModelPermissionsOrAnonReadOnly]

class DetailCustomers(APIView, mixins.UpdateModelMixin):
    authentication_classes = [TokenAuthentication]

    def get(self, request, format=None):
        if request.user.is_authenticated:
            customer = request.user.customer
            data = {
                "username" : request.user.username,
                "first_name" : request.user.first_name,
                "last_name" : request.user.last_name,
                "email" : request.user.email,
                "phone_number" : customer.phone_number,
                "address" : customer.address,
                "dob" : customer.dob,
                "orders" : customer.order_set.all()
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










