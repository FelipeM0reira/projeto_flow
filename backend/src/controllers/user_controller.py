"""
User controller (views) for handling user-related requests.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from src.models import User
from src.serializers import UserSerializer, ThemePreferenceSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for User CRUD operations.
    
    list: Get all users
    create: Create a new user
    retrieve: Get a specific user
    update: Update a user
    partial_update: Partially update a user
    destroy: Delete a user
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @swagger_auto_schema(
        method='patch',
        request_body=ThemePreferenceSerializer,
        responses={
            200: openapi.Response('Theme updated successfully', UserSerializer),
            400: 'Bad request',
            404: 'User not found'
        }
    )
    @action(detail=True, methods=['patch'])
    def theme(self, request, pk=None):
        """
        Update user's theme preference.
        
        Args:
            request: HTTP request with theme_preference in body
            pk: User primary key
            
        Returns:
            Response with updated user data
        """
        user = self.get_object()
        serializer = ThemePreferenceSerializer(data=request.data)
        
        if serializer.is_valid():
            user.theme_preference = serializer.validated_data['theme_preference']
            user.save()
            
            return Response(
                UserSerializer(user).data,
                status=status.HTTP_200_OK
            )
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    @swagger_auto_schema(
        method='get',
        responses={
            200: openapi.Response('Current theme', ThemePreferenceSerializer),
            404: 'User not found'
        }
    )
    @action(detail=True, methods=['get'])
    def get_theme(self, request, pk=None):
        """
        Get user's current theme preference.
        
        Args:
            request: HTTP request
            pk: User primary key
            
        Returns:
            Response with theme preference
        """
        user = self.get_object()
        return Response(
            {'theme_preference': user.theme_preference},
            status=status.HTTP_200_OK
        )

    def create(self, request, *args, **kwargs):
        """Create a new user with validation."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )

    def update(self, request, *args, **kwargs):
        """Update user with validation."""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
