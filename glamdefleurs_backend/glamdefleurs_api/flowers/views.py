from rest_framework import generics
from flowers.models import Flower, Category, HeadCategory
from flowers.serializers import FlowerSerializer, CategorySerializer, HeadCategorySerializer

class FlowerList(generics.ListCreateAPIView):
    """
    List all code flowers, or create a new flower.
    """
    queryset = Flower.objects.all()
    serializer_class = FlowerSerializer
    
class FlowerDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a flower.
    """
    queryset = Flower.objects.all()
    serializer_class = FlowerSerializer

class CategoryList(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class CategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    
class HeadCategoryList(generics.ListAPIView):
    queryset = HeadCategory.objects.all()
    serializer_class = HeadCategorySerializer

class HeadCategoryDetail(generics.RetrieveAPIView):
    queryset = HeadCategory.objects.all()
    serializer_class = HeadCategorySerializer