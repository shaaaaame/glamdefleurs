from django.urls import path, include
from shop import views
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'orders', views.OrderViewSet, basename="order")

urlpatterns = [
    path('', include(router.urls)),
    path('customer/', views.DetailCustomers.as_view()),
    path('customer/create/', views.CreateCustomer.as_view()),
]

