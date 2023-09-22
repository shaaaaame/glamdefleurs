from collections.abc import Iterable
from typing import Iterable, Optional
import uuid
from django.db import models
from django.urls import reverse
from django.contrib import admin
from django.utils.html import format_html

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
    external_id = models.UUIDField(default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    categories = models.ManyToManyField("Category")
    media = models.ManyToManyField("FlowerMedia")
    description = models.TextField(max_length=10000, default="", null=True, blank=True)
    is_popular = models.BooleanField(default=False)
    has_variants = models.BooleanField(default=False)
    default_variant = models.OneToOneField("FlowerVariant", related_name="default_flower", on_delete=models.CASCADE, null=True)
    require_contact = models.BooleanField(default=False)
    price_text = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        ordering = ['name']

    def __str__(self) -> str:
        return self.name


class FlowerVariant(models.Model):
    flower = models.ForeignKey("Flower", related_name="variants", on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=255, blank=True, null=True, default="")
    price = models.DecimalField(max_digits=8, decimal_places=2, default=None, null=True)

    class Meta:
        ordering = ['price']

    def __str__(self) -> str:
        name = self.name
        price = self.price
        if not name:
            name = ""
        if not price:
            price = ""

        return name + ":" + str(price)

class FlowerMedia(models.Model):
    image = models.ImageField(upload_to="flower_media", blank=True, null=True)
    alt = models.CharField(max_length=255, blank=True)
    external_url = models.URLField(blank=True, null=True)

    def __str__(self) -> str:
        return self.external_url
