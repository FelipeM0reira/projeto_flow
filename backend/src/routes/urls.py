"""
URL routes for API endpoints.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from src.controllers import UserViewSet

# Create router and register viewsets
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
]
