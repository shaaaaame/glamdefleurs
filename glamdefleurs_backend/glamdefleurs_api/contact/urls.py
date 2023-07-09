from django.urls import path, include
from contact import views
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'contact_form', views.ContactFormViewSet, basename='contact_form')


urlpatterns = [
    path('', include(router.urls))
]

