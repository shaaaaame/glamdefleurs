from collections.abc import Iterator
from typing import Any
from django.contrib import admin
from django.db.models.query import QuerySet
from django.forms.fields import Field
from django.http.request import HttpRequest
from flowers.models import Flower, Category, FlowerVariant, FlowerMedia
from django.contrib.admin.options import InlineModelAdmin, StackedInline
import django.forms as forms
from django.core.files import File
from flowers.utils.sheet_utils import extract_photo_drive_id, get_photo_url
from glamdefleurs_api.drive_service.drive_service import download_file
from django.core.files.temp import NamedTemporaryFile
import os

import requests

import urllib3.request
from django.core.exceptions import ValidationError

from flowers.utils.sheet_utils import get_photo_url

def validate_image(image):
    file_size = image.size

    limit_mb = 3
    if file_size > limit_mb * 1024 * 1024:
        raise ValidationError("Max size of file is %s MB" % limit_mb)

# Register your models here.

class FlowerForm(forms.ModelForm):
    image = forms.ImageField(required=False, validators=[validate_image])
    price = forms.DecimalField(decimal_places=2, required=False)

    class Meta:
        model = Flower
        fields = ['name', 'categories', 'description',  'price', 'is_popular', 'has_variants', 'require_contact', 'price_text', 'hidden', 'image']

    class Media:
        js = ('admin/js/jquery.init.js', '/static/flowers/js/hide_attributes.js')

    def clean(self):
        cleaned_data = super().clean()
        has_variants = cleaned_data.get('has_variants')
        require_contact = cleaned_data.get('require_contact')
        image = cleaned_data.get('image')

        if not has_variants and not require_contact:
            price = cleaned_data.get('price')
            if not price:
                self.add_error('price', ("This field is required"))

        if require_contact:
            price_text = cleaned_data.get("price_text")
            if not price_text:
                self.add_error('price_text', ("This field is required"))

        if not image:
            self.add_error('image', ("Image must be filled."))

        return cleaned_data

    def process_image(self, image):

        file = File(image)
        existing = FlowerMedia.objects.filter(image=file.name)
        if len(existing) > 0:
            media = existing[0]
        else:
            media = FlowerMedia(image=image)
            media.save()

        return media

    def create_default_variant(self, price):
        default_variant = FlowerVariant(price=price)
        default_variant.save()

        return default_variant


    def save(self, *args, **kwargs) -> None:

        f = super().save(*args, **kwargs)
        f.save()

        # process media
        image = self.cleaned_data['image']

        media = self.process_image(image)

        f.media.set([media])

        # process variants
        has_variants = self.cleaned_data['has_variants']
        price = self.cleaned_data['price']

        if not has_variants:
            default_variant = self.create_default_variant(price)
            f.default_variant = default_variant

        f.save()

        return f

class VariantForm(forms.ModelForm):
    price = forms.DecimalField(decimal_places=2, required=False, label="Variant price")
    image = forms.ImageField(required=False, validators=[validate_image])
    is_using_flower_image = forms.BooleanField(required=False, label="Use image attached to Flower?")

    class Meta:
        model = FlowerVariant
        fields = ['name', 'price', 'image', 'is_using_flower_image']

    def get_initial_for_field(self, field: Field, field_name: str) -> Any:

        if self.instance.media is not None and field_name == "image":
            return self.instance.media.image

        return super().get_initial_for_field(field, field_name)

    def clean(self):
        cleaned_data = super().clean()
        is_using_flower_image = cleaned_data.get('is_using_flower_image')
        image = cleaned_data.get('image')

        if not image and not is_using_flower_image:
            self.add_error('image', ("Either image or image url must be filled if not using Flower image."))
            raise ValidationError("Either image or image url must be filled if not using Flower image.")

        return cleaned_data

    def save(self, commit: bool = ...) -> Any:

        variant = super().save(commit=False)

        if self.cleaned_data['image']:
            file = File(self.cleaned_data['image'])
            existing = FlowerMedia.objects.filter(image=file.name)
            if len(existing) > 0:
                media = existing[0]
            else:
                media = FlowerMedia(image=file)
                media.save()

            variant.media = media
        else:
            variant.media = None

        variant.save()
        return variant

class VariantAdminInline(StackedInline):
    extra = 0
    form = VariantForm
    model = FlowerVariant
    min_num = 1

@admin.register(Flower)
class FlowerAdmin(admin.ModelAdmin):
    inlines = [VariantAdminInline]
    form = FlowerForm
    search_fields = ['name']

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)

        if obj:
            form.base_fields['image'].initial = obj.media.all()[0].image
            form.base_fields['price'].initial = obj.default_variant.price
        else:
            form.base_fields['image'].initial = None
            form.base_fields['price'].initial = None

        return form

    def save_formset(self, request, form, formset, change):
        instances = formset.save(commit=False)

        if len(instances) > 0:
            form.instance.default_variant = instances[0]
            form.instance.save()

        for instance in instances:
            instance.flower = form.instance
            instance.save()

        formset.save_m2m()

@admin.register(FlowerMedia)
class FlowerMediaAdmin(admin.ModelAdmin):
    fields = ['image']

admin.site.register(Category)
admin.site.register(FlowerVariant)