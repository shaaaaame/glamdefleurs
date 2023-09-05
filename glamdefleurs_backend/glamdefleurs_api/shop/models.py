from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Order(models.Model):
    payment_id = models.CharField(max_length=17)
    customer_id = models.ForeignKey("Customer", on_delete=models.CASCADE, null=True, blank=True)
    date_created = models.DateField(auto_now_add=True)
    items = models.ManyToManyField("OrderItem")
    address = models.OneToOneField("Address", on_delete=models.SET_NULL, related_name="order", null=True)
    total = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    subtotal = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    shipping = models.DecimalField(max_digits=8, decimal_places=2, default=0)



    first_name = models.CharField(max_length=1000, null=True)
    last_name = models.CharField(max_length=1000, null=True)
    email = models.EmailField(max_length=254, null=True)
    phone_number = models.CharField(max_length=20, null=True)

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
