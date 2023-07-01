from rest_framework import serializers
from flowers.models import Flower, Category, HeadCategory

class FlowerSerializer(serializers.ModelSerializer):
    categories = serializers.PrimaryKeyRelatedField(many=True, queryset=Category.objects.all())

    class Meta:
        model = Flower
        fields = ['id', 'name', 'categories', 'price', 'photo', 'description']

class CategorySerializer(serializers.ModelSerializer):
    head_category = serializers.StringRelatedField(source='head_category.name')
    flowers = serializers.PrimaryKeyRelatedField(many=True, queryset=Flower.objects.all())

    class Meta:
        model = Category
        fields = ['id', 'name', 'head_category', 'description', 'flowers']

class HeadCategorySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = HeadCategory
        fields = ['id', 'name', 'description']