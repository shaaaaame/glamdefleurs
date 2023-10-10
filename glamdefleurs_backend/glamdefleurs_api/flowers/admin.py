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
    external_url = forms.URLField(required=False, label='Image URL')
    price = forms.DecimalField(decimal_places=2, required=False)

    class Meta:
        model = Flower
        fields = ['name', 'categories', 'description',  'price', 'is_popular', 'has_variants', 'require_contact', 'price_text', 'hidden', 'image', 'external_url']

    class Media:
        js = ('admin/js/jquery.init.js', '/static/flowers/js/hide_attributes.js')

    def clean(self):
        cleaned_data = super().clean()
        has_variants = cleaned_data.get('has_variants')
        require_contact = cleaned_data.get('require_contact')
        image = cleaned_data.get('image')
        external_url = cleaned_data.get('external_url')

        if not has_variants and not require_contact:
            price = cleaned_data.get('price')
            if not price:
                self.add_error('price', ("This field is required"))

        if require_contact:
            price_text = cleaned_data.get("price_text")
            if not price_text:
                self.add_error('price_text', ("This field is required"))

        if not image and not external_url:
            self.add_error('image', ("Either image or image url must be filled."))

        return cleaned_data

    def save(self, commit: bool = ...) -> Any:

        flower = super().save(commit=False)
        data = self.data.copy()
        flower_media = None

        # handle case where url exists
        existing = []
        if data['external_url'] != "" and not self.cleaned_data['image']:

            if "drive.google.com/file/d/" in data['external_url']:
                drive_id = extract_photo_drive_id(data['external_url'])
                data['external_url'] = get_photo_url(data['external_url'])
                file = download_file(drive_id)
                data['image'] = File(file)

            existing = FlowerMedia.objects.filter(external_url=data['external_url'])

            if len(existing) > 0:
                flower_media = existing[0]
            else:
                file = urllib3.request.urlretrieve(data['external_url'], f"flower_{flower.id}.png")
                data['image'] = File(file)

                flower_media = FlowerMedia(external_url=data['external_url'], image=data['image'])
                flower_media.save()

            flower.save()
            flower.media.add(flower_media)

        if self.cleaned_data['image']:
            file = File(self.cleaned_data['image'])
            existing = FlowerMedia.objects.filter(image=file.name)
            if len(existing) > 0:
                media = existing[0]
            else:
                media = FlowerMedia(image=file)
                media.save()
            flower.save()
            flower.media.clear()
            flower.media.add(media)

        # handle price if no variants
        if not self.cleaned_data['has_variants']:
            default_variant = FlowerVariant(
                name="",
                price=self.cleaned_data['price']
            )
            default_variant.save()
            flower.save()
            flower.default_variant = default_variant

        self.data = data

        return super().save(commit)

class VariantForm(forms.ModelForm):
    price = forms.DecimalField(decimal_places=2, required=False, label="Variant price")
    image = forms.ImageField(required=False, validators=[validate_image])
    external_url = forms.URLField(required=False, label='Image URL')
    is_using_flower_image = forms.BooleanField(required=False, label="Use image attached to Flower?")

    class Meta:
        model = FlowerVariant
        fields = ['name', 'price', 'image', 'external_url', 'is_using_flower_image']

    def get_initial_for_field(self, field: Field, field_name: str) -> Any:

        if self.instance.media is not None:
            if field_name == "image":
                return self.instance.media.image
            elif field_name == "external_url":
                return self.instance.media.external_url

        return super().get_initial_for_field(field, field_name)

    def save(self, commit: bool = ...) -> Any:

        variant = super().save(commit=False)

        if self.cleaned_data['external_url'] != "" and not self.cleaned_data['image']:
            existing = []
            if "drive.google.com/file/d/" in self.cleaned_data['external_url']:
                drive_id = extract_photo_drive_id(self.cleaned_data['external_url'])
                self.cleaned_data['external_url'] = get_photo_url(self.cleaned_data['external_url'])
                file = download_file(drive_id)
                self.cleaned_data['image'] = File(file)

            existing = FlowerMedia.objects.filter(external_url=self.cleaned_data['external_url'])

            if len(existing) > 0:
                flower_media = existing[0]
            else:
                file = urllib3.request.urlretrieve(self.cleaned_data['external_url'], f"flower_{variant.id}.png")
                self.cleaned_data['image'] = File(file)

                flower_media = FlowerMedia(external_url=self.cleaned_data['external_url'], image=self.cleaned_data['image'])
                flower_media.save()

            variant.save()
            variant.media = flower_media
        elif self.cleaned_data['image']:
            file = File(self.cleaned_data['image'])
            existing = FlowerMedia.objects.filter(image=file.name)
            if len(existing) > 0:
                media = existing[0]
            else:
                media = FlowerMedia(image=file)
                media.save()
            variant.save()
            variant.media = media


        return variant

class VariantAdminInline(StackedInline):
    extra = 0
    form = VariantForm
    model = FlowerVariant

@admin.register(Flower)
class FlowerAdmin(admin.ModelAdmin):
    inlines = [VariantAdminInline]
    form = FlowerForm
    search_fields = ['name']

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)

        if obj:
            form.base_fields['image'].initial = obj.media.all()[0].image
            form.base_fields['external_url'].initial = obj.media.all()[0].external_url
            form.base_fields['price'].initial = obj.default_variant.price
        else:
            form.base_fields['image'].initial = None
            form.base_fields['external_url'].initial = None
            form.base_fields['price'].initial = None

        return form

    def save_formset(self, request: Any, form: Any, formset: Any, change: Any) -> None:
        instances = formset.save(commit=False)
        for obj in formset.deleted_objects:
            obj.delete()


        if len(instances) > 0:
            for instance in instances:
                instance.save()
            instances[0].flower.default_variant = instances[0]
            instances[0].flower.save()

        formset.save_m2m()

        return super().save_formset(request, form, formset, change)

@admin.register(FlowerMedia)
class FlowerMediaAdmin(admin.ModelAdmin):
    fields = ['image', 'external_url']

admin.site.register(Category)
admin.site.register(FlowerVariant)