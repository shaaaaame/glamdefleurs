from rest_framework import serializers
from shop.models import Order, OrderItem, Customer, Address
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

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'

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
        fields = ['first_name', 'last_name', 'username', 'email', 'password', 'phone_number', 'orders', 'dob', 'address']
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


        return customer

    def update(self, instance, validated_data):
        # assumes partial = True

        if "address" in validated_data.keys():
            address_data = validated_data.pop('address')

            if instance.address:
                address_serializer = AddressSerializer(instance.address, data=address_data, partial=True)
                if address_serializer.is_valid():
                    address_serializer.save()
            else:
                address, created = Address.objects.update_or_create(**address_data)
                address.save()
                instance.address = address
                instance.save()

        return super().update(instance=instance, validated_data=validated_data)



