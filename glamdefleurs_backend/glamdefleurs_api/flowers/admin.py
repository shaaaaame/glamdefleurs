from typing import Any
from django.contrib import admin
from flowers.models import Flower, Category, FlowerVariant, FlowerMedia
from django.contrib.admin.options import StackedInline
import django.forms as forms

# Register your models here.

class FlowerForm(forms.ModelForm):
    image = forms.ImageField(required=False)
    external_url = forms.URLField(required=False)

    class Meta:
        model = Flower
        fields = ['name', 'categories', 'description', 'is_popular', 'has_variants', 'require_contact', 'price_text']

class VariantAdminInline(StackedInline):
    extra = 1
    model = FlowerVariant

@admin.register(Flower)
class FlowerAdmin(admin.ModelAdmin):
    inlines = [VariantAdminInline]
    form = FlowerForm
    search_fields = ['name']

    def save_model(self, request, obj, form, change):

        media = FlowerMedia(image=form.pop('image'), external_url=form.pop('external_url'))
        print(media)


        # Let Django do its defaults.
        super().save_model(request, obj, form, change)


@admin.register(FlowerMedia)
class FlowerMediaAdmin(admin.ModelAdmin):
    fields = ['image', 'external_url']

admin.site.register(Category)
admin.site.register(FlowerVariant)