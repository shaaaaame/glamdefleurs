from typing import Iterable, Optional
from django.db import models
from django.urls import reverse


# Create your models here.

class HeadCategory(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=10000)
    display_photo = models.URLField(default="https://drive.google.com/uc?export=view&id=1qZOythbdopUd6AW-QCk6rIcpxK81C9gv")


    def __str__(self) -> str:
        return self.name

class Category(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=10000)
    head_category = models.ForeignKey("HeadCategory", on_delete=models.CASCADE, null=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name
    
class Flower(models.Model):
    name = models.CharField(max_length=255)
    categories = models.ManyToManyField("Category")
    price = models.DecimalField(max_digits=6, decimal_places=2)
    photo = models.URLField()
    description = models.TextField(max_length=10000)
    is_popular = models.BooleanField(default=False)
    variant_name = models.CharField(max_length=255, default="") # use this if item has variants as an identifer, e.g "small", "medium", "big"
    variants = models.ManyToManyField("self")

    class Meta:
        ordering = ['name']

    def __str__(self) -> str:
        return self.name
