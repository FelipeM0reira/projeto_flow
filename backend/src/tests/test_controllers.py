"""
Unit tests for User controller/views.
"""
import pytest
from django.urls import reverse
from rest_framework import status
from src.models import User


@pytest.mark.django_db
class TestUserViewSet:
    """Test cases for UserViewSet."""

    def test_list_users(self, api_client, multiple_users):
        """Test listing all users."""
        url = reverse('user-list')
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 5

    def test_create_user(self, api_client):
        """Test creating a new user."""
        url = reverse('user-list')
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpass123',
            'theme_preference': 'dark'
        }
        response = api_client.post(url, data, format='json')

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['username'] == 'newuser'
        assert response.data['email'] == 'newuser@example.com'
        assert response.data['theme_preference'] == 'dark'
        assert 'password' not in response.data

    def test_retrieve_user(self, api_client, sample_user):
        """Test retrieving a specific user."""
        url = reverse('user-detail', args=[sample_user.id])
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data['username'] == 'testuser'
        assert response.data['email'] == 'test@example.com'

    def test_update_user(self, api_client, sample_user):
        """Test updating a user."""
        url = reverse('user-detail', args=[sample_user.id])
        data = {
            'username': 'updateduser',
            'email': 'updated@example.com',
            'theme_preference': 'dark'
        }
        response = api_client.put(url, data, format='json')

        assert response.status_code == status.HTTP_200_OK
        assert response.data['username'] == 'updateduser'
        assert response.data['theme_preference'] == 'dark'

    def test_partial_update_user(self, api_client, sample_user):
        """Test partially updating a user."""
        url = reverse('user-detail', args=[sample_user.id])
        data = {'theme_preference': 'dark'}
        response = api_client.patch(url, data, format='json')

        assert response.status_code == status.HTTP_200_OK
        assert response.data['theme_preference'] == 'dark'
        assert response.data['username'] == 'testuser'

    def test_delete_user(self, api_client, sample_user):
        """Test deleting a user."""
        url = reverse('user-detail', args=[sample_user.id])
        response = api_client.delete(url)

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not User.objects.filter(id=sample_user.id).exists()

    def test_update_theme_preference(self, api_client, sample_user):
        """Test updating user's theme preference via custom endpoint."""
        url = reverse('user-theme', args=[sample_user.id])
        data = {'theme_preference': 'dark'}
        response = api_client.patch(url, data, format='json')

        assert response.status_code == status.HTTP_200_OK
        assert response.data['theme_preference'] == 'dark'

        # Verify in database
        sample_user.refresh_from_db()
        assert sample_user.theme_preference == 'dark'

    def test_update_theme_invalid_value(self, api_client, sample_user):
        """Test updating theme with invalid value."""
        url = reverse('user-theme', args=[sample_user.id])
        data = {'theme_preference': 'invalid'}
        response = api_client.patch(url, data, format='json')

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_get_theme_preference(self, api_client, sample_dark_user):
        """Test getting user's theme preference."""
        url = reverse('user-get-theme', args=[sample_dark_user.id])
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data['theme_preference'] == 'dark'

    def test_create_user_duplicate_username(self, api_client, sample_user):
        """Test creating user with duplicate username fails."""
        url = reverse('user-list')
        data = {
            'username': 'testuser',
            'email': 'different@example.com',
            'password': 'pass123'
        }
        response = api_client.post(url, data, format='json')

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_create_user_duplicate_email(self, api_client, sample_user):
        """Test creating user with duplicate email fails."""
        url = reverse('user-list')
        data = {
            'username': 'differentuser',
            'email': 'test@example.com',
            'password': 'pass123'
        }
        response = api_client.post(url, data, format='json')

        assert response.status_code == status.HTTP_400_BAD_REQUEST
