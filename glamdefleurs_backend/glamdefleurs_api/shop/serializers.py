from rest_framework import serializers
from shop.models import Order, OrderItem, Customer, Address
from django.contrib.auth.models import User
from django.db import IntegrityError

from dotenv import load_dotenv
import os
import requests

from glamdefleurs_api.email_service.email_service_v2 import send_purchase_email, send_email, send_html_email

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['address1', 'address2', 'city', 'province', 'postcode']

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['item', 'variant', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    customer_id = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all(), required=False, allow_null=True)
    items = OrderItemSerializer(many=True) # serializes as { "item": x, "variant": v, "quantity": q}
    address = AddressSerializer(required=False)

    class Meta:
        model = Order
        fields = '__all__'

    def create(self, validated_data):

        # handle data for object
        items_data = validated_data.pop('items')

        if "address" in validated_data:
            address_data = validated_data.pop('address')
            address = Address.objects.create(**address_data)
        else:
            address = None
            address_data = {
                "address1": "-",
                "address2": "-",
                "city": "-",
                "province": "-",
                "postcode": "-",
                }

        items = [] # order items
        items_dict = {} # variant_id : quantity
        for item in items_data:
            items.append(OrderItem.objects.create(**item))
            items_dict[item["variant"].id] = item["quantity"]

        order = Order.objects.create(**validated_data, address=address)
        order.items.set(items)
        order.save()

        send_purchase_email(items_dict, order.email, {
            "order_id": order.id,
            "name": order.first_name,
            "delivery_method": order.delivery_method,
            "delivery_time": order.delivery_time,
            "special_instructions": order.special_instructions,
            "subtotal": "$" + str(order.subtotal),
            "tax": "$" + str(order.tax),
            "shipping": "$" +  str(order.shipping),
            "total": "$" +  str(order.total),
            "address": address_data,
            "date": order.date_created
        })

        # send an email to shop to let them know
        order_items = ""
        template = """
    <tr>
        <td>{name}</td>
        <td>{quantity}</td>
        <td>{price}</td>
        <td>{subtotal}</td>
    </tr>
"""
        for item in items:
            item_html = template.format(name=f"{item.item.name} ({item.variant.name})", quantity=items_dict[item.variant.id], price=item.variant.price, subtotal=str(round(float(item.variant.price) * int(item.quantity), 2)))
            order_items += item_html

        message = f"""
<h1>
Order placed on {order.date_created}
</h1>

<br>

<h3>
Order items:
</h3>
<table style="border-spacing: 15px;">
  <tr>
    <th>Item name</th>
    <th>Quantity</th>
    <th>Price</th>
  </tr>
  {order_items}
</table>

<h3>
Order summary:
</h3>
<ul>
    <li>Subtotal: {order.subtotal}</li>
    <li>Shipping: {order.shipping} (Delivery Method: {order.delivery_method})</li>
    <li>Tax: {order.tax}</li>
    <li>Total: {order.total}</li>
    <li>PayPal Payment ID: {order.payment_id}</li>
</ul>

<h3>
User details:
</h3>
<ul>
    <li>First name: {order.first_name}</li>
    <li>Last name: {order.last_name}</li>
    <li>Phone number: {order.phone_number}</li>
    <li>Email: {order.email}</li>
</ul>

<h3>
Delivery/Pickup:
</h3>
<ul>
    <li>Delivery method: {order.delivery_method}</li>
    <li>Delivery/Pickup date: {order.delivery_time}</li>
    <li>Address (if applicable)
        {address_data["address1"]} <br>
        {address_data["address2"]} <br>
        {address_data["city"]} <br>
        {address_data["province"]} <br>
        {address_data["postcode"]}
    </li>
    <li>Special instructions: {order.special_instructions}</li>
</ul>

"""
        # TODO: change in production
        send_html_email(message, "hanxheng@gmail.com", f"ORDER PLACED: {order.id}")

        return order

class CustomerSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField()
    phone_number = serializers.CharField()
    orders = serializers.PrimaryKeyRelatedField(many=True, queryset=Order.objects.all(), required=False)
    dob = serializers.DateField()
    address = AddressSerializer()

    class Meta:
        model = Customer
        fields = ['id', 'first_name', 'last_name', 'username', 'email', 'password', 'phone_number', 'orders', 'dob', 'address']
        depth = 1

    def create(self, validated_data):
        # create user object
        user = User.objects.create_user(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        user.save()

        # create address object
        address_serializer = AddressSerializer(data=validated_data["address"])
        if address_serializer.is_valid():
            address = address_serializer.save()
        else:
            raise ValueError

        # create related customer object
        customer = Customer.objects.create(
            user=user,
            phone_number=validated_data['phone_number'],
            dob=validated_data['dob'],
            address=address
        )
        customer.save()


        return customer

    def update(self, instance, validated_data):
        # assumes partial = True

        if "address" in validated_data.keys():
            address_data = validated_data.pop('address')

            if instance.address:
                address_serializer = AddressSerializer(instance.address, data=address_data, partial=True)
                if address_serializer.is_valid():
                    address_serializer.save()
                instance.save()
            else:
                address, created = Address.objects.update_or_create(**address_data)
                address.save()
                instance.address = address
                instance.save()

        return super().update(instance=instance, validated_data=validated_data)



