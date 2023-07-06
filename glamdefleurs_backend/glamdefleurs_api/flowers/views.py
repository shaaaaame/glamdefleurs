from rest_framework import generics, permissions, viewsets
from flowers.models import Flower, Category, HeadCategory
from flowers.serializers import FlowerSerializer, CategorySerializer, HeadCategorySerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

class FlowerViewSet(viewsets.ModelViewSet):
    queryset = Flower.objects.all()
    serializer_class = FlowerSerializer
    permission_classes = [permissions.DjangoModelPermissionsOrAnonReadOnly]

    def get_queryset(self):
        queryset = Flower.objects.all()
        head = self.request.query_params.get('head')
        sub = self.request.query_params.get('sub')

        if head is not None:
            sublist = Category.objects.all().filter(head_category__exact=head)
            queryset = queryset.filter(categories__in=sublist)
        elif sub is not None:
            queryset = queryset.filter(categories__id__exact=sub)
        return queryset
    
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.DjangoModelPermissionsOrAnonReadOnly]

class HeadCategoryViewSet(viewsets.ModelViewSet):
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