from django.urls import path
from flowers import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('flowers/', views.FlowerList.as_view()),
    path('flowers/<int:pk>/', views.FlowerDetail.as_view()),
    path('categories/', views.CategoryList.as_view()),
    path('categories/<int:pk>/', views.CategoryDetail.as_view()),
    path('head_categories/', views.HeadCategoryList.as_view()),
    path('head_categories/<int:pk>/', views.HeadCategoryDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)