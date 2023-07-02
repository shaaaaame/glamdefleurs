from typing import Iterable, Optional
from django.db import models
from django.urls import reverse


# Create your models here.

class HeadCategory(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=200)
    description = models.TextField(max_length=10000)

    def __str__(self) -> str:
        return self.name

class Category(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=200)
    description = models.TextField(max_length=10000)
    head_category = models.ForeignKey("HeadCategory", on_delete=models.CASCADE)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name
    
class Flower(models.Model):
    name = models.CharField(max_length=200)
    categories = models.ManyToManyField("Category")
    price = models.DecimalField(max_digits=6, decimal_places=2)
    photo = models.URLField()
    description = models.TextField(max_length=10000)

    class Meta:
        ordering = ['name']

    def __str__(self) -> str:
        return self.name