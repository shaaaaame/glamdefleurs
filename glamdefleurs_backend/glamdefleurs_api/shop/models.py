from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Order(models.Model):
    customer_id = models.ForeignKey("Customer", on_delete=models.CASCADE)
    date_created = models.DateField(auto_now_add=True)
    items = models.ManyToManyField("OrderItem")

    class Meta:
        ordering = ['date_created']

class OrderItem(models.Model):
    '''
    flower.id : quantity
    '''
    item = models.ForeignKey("flowers.Flower", on_delete=models.CASCADE)
    quantity = models.IntegerField()

class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, unique=True, related_name='customer')
    phone_number = models.CharField(max_length=20)
    orders = models.ManyToManyField("Order", default=[])
    address = models.OneToOneField("Address", on_delete=models.SET_NULL, related_name="customer", null=True, blank=True)
    dob = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.user.first_name + " " + self.user.last_name

class Address(models.Model):
    '''
    Model to store user address as separate components
    '''
    address1 = models.TextField(max_length=9999)
    address2 = models.TextField(max_length=9999)
    city = models.CharField(max_length=999)
    province = models.CharField(max_length=2) # stored in short form
    postcode = models.CharField(max_length=8)

    def __str__(self):
        return self.address1
