from django.urls import path, include
from flowers import views
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'flowers', views.FlowerViewSet, basename="flower")
router.register(r'flower_medias', views.FlowerMediaViewSet, basename="flower_media")
router.register(r'flower_variants', views.FlowerVariantViewSet, basename="flower_variant")

router.register(r'categories', views.CategoryViewSet, basename="category")
router.register(r'head_categories', views.HeadCategoryViewSet, basename="head_category")

urlpatterns = [
    path('', include(router.urls))
]

