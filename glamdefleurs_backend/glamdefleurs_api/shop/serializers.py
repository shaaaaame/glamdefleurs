from rest_framework import serializers
from shop.models import Order, OrderItem, Customer
from django.contrib.auth.models import User

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    customer_id = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all())
    items = OrderItemSerializer(many=True) # serializes as { "item": x, "quantity": q}

    class Meta:
        model = Order
        fields = '__all__'

class CustomerSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField()
    phone_number = serializers.CharField()
    address = serializers.CharField()
    orders = serializers.PrimaryKeyRelatedField(many=True, queryset=Order.objects.all())
    dob = serializers.DateField()

    class Meta:
        model = Customer
        fields = ['first_name', 'last_name', 'username', 'email', 'password', 'phone_number', 'address', 'orders', 'dob']

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

        # create related customer object
        customer = Customer.objects.create(
            user=user,
            phone_number=validated_data['phone_number'],
            address=validated_data['address'],
            dob=validated_data['dob'],
        )

        customer.orders.set(validated_data['orders'])

        return customer


