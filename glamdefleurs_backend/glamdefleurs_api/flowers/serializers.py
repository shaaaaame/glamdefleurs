from rest_framework import serializers
from flowers.models import Flower, Category, HeadCategory

class FlowerSerializer(serializers.ModelSerializer):
    categories = serializers.PrimaryKeyRelatedField(many=True, queryset=Category.objects.all())
    variants = serializers.PrimaryKeyRelatedField(many=True, queryset=Flower.objects.all(), default=[])
    description = serializers.CharField(max_length=10000, default="", allow_null=True, required=False)
    external_id = serializers.UUIDField(format='hex', required=False)
    price = serializers.DecimalField(max_digits=6, decimal_places=2, allow_null=True, required=False)

    class Meta:
        model = Flower
        fields = ['id', 'external_id', 'name', 'categories', 'price', 'price_text', 'photo', 'description', 'is_popular', 'variants', 'variant_name', 'require_contact']

class CategorySerializer(serializers.ModelSerializer):
    head_category = serializers.PrimaryKeyRelatedField(queryset=HeadCategory.objects.all())

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'head_category']

class HeadCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = HeadCategory
        fields = ['id', 'name', 'description', 'display_photo']