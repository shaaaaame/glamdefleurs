from rest_framework import permissions, viewsets
from flowers.models import Flower, FlowerMedia, FlowerVariant, Category, HeadCategory
from flowers.serializers import FlowerSerializer, FlowerMediaSerializer, FlowerVariantSerializer, CategorySerializer, HeadCategorySerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from django.shortcuts import get_object_or_404

class FlowerMediaViewSet(viewsets.ModelViewSet):
    queryset = FlowerMedia.objects.all()
    serializer_class = FlowerMediaSerializer
    permission_classes = [permissions.DjangoModelPermissionsOrAnonReadOnly]

class FlowerVariantViewSet(viewsets.ModelViewSet):
    queryset = FlowerVariant.objects.all()
    serializer_class = FlowerVariantSerializer
    permission_classes = [permissions.DjangoModelPermissionsOrAnonReadOnly]

class FlowerViewSet(viewsets.ModelViewSet):
    queryset = Flower.objects.all()
    serializer_class = FlowerSerializer
    permission_classes = [permissions.DjangoModelPermissionsOrAnonReadOnly]

    def get_queryset(self):
        queryset = Flower.objects.all()
        head = self.request.query_params.get('head')
        sub = self.request.query_params.get('sub')
        popular = self.request.query_params.get('popular')
        ids = self.request.query_params.getlist('ids')

        if head is not None:
            sublist = Category.objects.all().filter(head_category__exact=head)
            queryset = queryset.filter(categories__in=sublist)
        elif sub is not None:
            queryset = queryset.filter(categories__id__exact=sub)
        elif popular is not None:
            queryset = queryset.filter(is_popular__exact=True)
        elif len(ids) > 0:
            queryset = queryset.filter(id__in=ids)

        return queryset.distinct()

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
        'flowers': reverse('flower-list', request=request, format=format),
        'flower_medias': reverse('flower_media-list', request=request, format=format)
    })