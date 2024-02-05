from collections.abc import Iterable
from typing import Iterable, Optional
import uuid
from django.db import models
from django.urls import reverse
from django.contrib import admin
from django.core.files import File
from django.utils.html import format_html
from django.core.files.temp import NamedTemporaryFile
from urllib.request import urlopen
from flowers.utils.sheet_utils import extract_photo_drive_id, get_photo_url
from glamdefleurs_api.drive_service.drive_service import download_file

# Create your models here.

class Category(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=10000)
    head_category = models.ForeignKey("HeadCategory", on_delete=models.CASCADE, null=True)
    hidden = models.BooleanField(default=False)

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
    hidden = models.BooleanField(default=False)

    class Meta:
        ordering = ['name']

    def __str__(self) -> str:
        return self.name

    def save(self, *args, **kwargs):
        if not self.has_variants:
            for variant in self.variants.all():
                variant.flower = None
                variant.save()

        return super().save(*args, **kwargs)

class FlowerVariant(models.Model):
    flower = models.ForeignKey("Flower", related_name="variants", on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=255, blank=True, null=True, default="")
    price = models.DecimalField(max_digits=8, decimal_places=2, default=None, null=True)
    media = models.ForeignKey("FlowerMedia", related_name="variants", on_delete=models.CASCADE, null=True, blank=True)
    is_using_flower_image = models.BooleanField(default=True)

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

    def save(self, *args, **kwargs):
        if self.is_using_flower_image:
            self.media = None

        return super().save(*args, **kwargs)

class FlowerMedia(models.Model):
    image = models.ImageField(upload_to="flower_media", blank=True, null=True)
    alt = models.CharField(max_length=255, blank=True)
    external_url = models.URLField(blank=True, null=True)

    def __str__(self) -> str:
        return self.alt if self.alt else "flower_media"

    def get_image_from_url(self, url):
       img_tmp = NamedTemporaryFile(delete=True)
       with urlopen(url) as uo:
           assert uo.status == 200
           img_tmp.write(uo.read())
           img_tmp.flush()
       img = File(img_tmp)

       return img
   
class HeadCategory(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=10000)
    display_photo = models.ImageField(upload_to="category_media", blank=True, null=True)

    def __str__(self) -> str:
        return self.name