from rest_framework import serializers
from flowers.models import Flower, FlowerVariant, FlowerMedia, Category, HeadCategory
from flowers.utils.sheet_utils import get_photo_url



class FlowerMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlowerMedia
        fields = ['image', 'alt', 'external_url']

class FlowerVariantSerializer(serializers.ModelSerializer):
    flower = serializers.PrimaryKeyRelatedField(queryset=Flower.objects.all(), required=False, allow_null=True)
    price = serializers.DecimalField(max_digits=6, decimal_places=2, allow_null=True, required=False)

    class Meta:
        model = FlowerVariant
        fields = ['id', 'flower', 'name', 'price']
        extra_kwargs = {
            "flower": {"required": False, "allow_null": True},
            "price": { "required": False, "allow_null": False}
        }

class FlowerSerializer(serializers.ModelSerializer):
    external_id = serializers.UUIDField(format='hex', required=False)
    categories = serializers.PrimaryKeyRelatedField(many=True, queryset=Category.objects.all())
    default_variant = FlowerVariantSerializer()
    description = serializers.CharField(max_length=10000, default="", allow_null=True, required=False, allow_blank=True)
    price_text = serializers.CharField(max_length=99999, default="", allow_null=True, allow_blank=True, required=False)
    media = FlowerMediaSerializer(many=True)

    class Meta:
        model = Flower
        fields = ['id', 'external_id', 'name', 'categories', 'description', 'is_popular', 'has_variants', 'default_variant', 'require_contact', 'price_text', 'media', 'variants']
        extra_kwargs = {
            "price_text": {"required": False, "allow_null": True},
            "media": {"many": True}
        }
        depth = 1

    def to_internal_value(self, data):
        self.fields['media'] = serializers.PrimaryKeyRelatedField(many=True, queryset=FlowerMedia.objects.all())
        self.fields['default_variant'] = serializers.PrimaryKeyRelatedField(queryset=FlowerVariant.objects.all())
        return super().to_internal_value(data)

    def to_representation(self, obj):
        self.fields['media'] = FlowerMediaSerializer(many=True)
        self.fields['default_variant'] = FlowerVariantSerializer()
        return super().to_representation(obj)


class CategorySerializer(serializers.ModelSerializer):
    head_category = serializers.PrimaryKeyRelatedField(queryset=HeadCategory.objects.all())

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'head_category']

class HeadCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = HeadCategory
        fields = ['id', 'name', 'description', 'display_photo']