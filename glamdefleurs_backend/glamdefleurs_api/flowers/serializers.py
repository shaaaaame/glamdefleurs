from rest_framework import serializers
from flowers.models import Flower, Category, HeadCategory

class FlowerSerializer(serializers.ModelSerializer):
    categories = serializers.PrimaryKeyRelatedField(many=True, queryset=Category.objects.all())
    variants = serializers.PrimaryKeyRelatedField(many=True, queryset=Flower.objects.all())

    class Meta:
        model = Flower
        fields = ['id', 'name', 'categories', 'price', 'photo', 'description', 'is_popular', 'variants', 'variant_name']

class CategorySerializer(serializers.ModelSerializer):
    head_category = serializers.PrimaryKeyRelatedField(queryset=HeadCategory.objects.all())

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'head_category']

class HeadCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = HeadCategory
        fields = ['id', 'name', 'description', 'display_photo']