from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Order(models.Model):
    id = models.CharField(max_length=255, primary_key=True)
    customer_id = models.ForeignKey("Customer", on_delete=models.CASCADE)
    date_created = models.DateField(auto_now_add=True)
    items = models.ManyToManyField("flowers.Flower", related_name="orders")

    class Meta:
        ordering = ['date_created']

class Customer(models.Model):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20)
    address = models.TextField(max_length=999999)
    orders = models.ManyToManyField("Order")

