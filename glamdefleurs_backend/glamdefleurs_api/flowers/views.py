from rest_framework import generics, permissions
from flowers.models import Flower, Category, HeadCategory
from flowers.serializers import FlowerSerializer, CategorySerializer, HeadCategorySerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

class FlowerList(generics.ListCreateAPIView):
    """
    List all code flowers, or create a new flower.
    """
    queryset = Flower.objects.all()
    serializer_class = FlowerSerializer
    permission_classes = [permissions.DjangoModelPermissionsOrAnonReadOnly]
    
class FlowerDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a flower.
    """
    queryset = Flower.objects.all()
    serializer_class = FlowerSerializer
    permission_classes = [permissions.DjangoModelPermissionsOrAnonReadOnly]

class CategoryList(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.DjangoModelPermissionsOrAnonReadOnly]

class CategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.DjangoModelPermissionsOrAnonReadOnly]
    
class HeadCategoryList(generics.ListAPIView):
    queryset = HeadCategory.objects.all()
    serializer_class = HeadCategorySerializer
    permission_classes = [permissions.DjangoModelPermissionsOrAnonReadOnly]


class HeadCategoryDetail(generics.RetrieveAPIView):
    queryset = HeadCategory.objects.all()
    serializer_class = HeadCategorySerializer
    permission_classes = [permissions.DjangoModelPermissionsOrAnonReadOnly]

@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'head_categories': reverse('head_category-list', request=request, format=format),
        'categories': reverse('category-list', request=request, format=format),
        'flowers': reverse('flower-list', request=request, format=format)
    })