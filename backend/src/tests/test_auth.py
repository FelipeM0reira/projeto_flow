import pytest
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.mark.django_db
class TestRegister:
    """Tests for user registration."""

    URL = '/api/auth/register/'

    def test_register_success(self, api_client):
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'StrongPass123!',
            'password_confirm': 'StrongPass123!',
            'first_name': 'New',
            'last_name': 'User',
        }
        response = api_client.post(self.URL, data, format='json')
        assert response.status_code == 201
        assert 'tokens' in response.data
        assert 'access' in response.data['tokens']
        assert 'refresh' in response.data['tokens']
        assert response.data['user']['username'] == 'newuser'

    def test_register_password_mismatch(self, api_client):
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'StrongPass123!',
            'password_confirm': 'DifferentPass123!',
        }
        response = api_client.post(self.URL, data, format='json')
        assert response.status_code == 400

    def test_register_duplicate_username(self, api_client, user):
        data = {
            'username': 'testuser',
            'email': 'another@example.com',
            'password': 'StrongPass123!',
            'password_confirm': 'StrongPass123!',
        }
        response = api_client.post(self.URL, data, format='json')
        assert response.status_code == 400

    def test_register_weak_password(self, api_client):
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': '123',
            'password_confirm': '123',
        }
        response = api_client.post(self.URL, data, format='json')
        assert response.status_code == 400


@pytest.mark.django_db
class TestLogin:
    """Tests for user login."""

    URL = '/api/auth/login/'

    def test_login_success(self, api_client, user):
        data = {'username': 'testuser', 'password': 'TestPass123!'}
        response = api_client.post(self.URL, data, format='json')
        assert response.status_code == 200
        assert 'tokens' in response.data
        assert response.data['user']['username'] == 'testuser'

    def test_login_wrong_password(self, api_client, user):
        data = {'username': 'testuser', 'password': 'WrongPass!'}
        response = api_client.post(self.URL, data, format='json')
        assert response.status_code == 401

    def test_login_nonexistent_user(self, api_client):
        data = {'username': 'nouser', 'password': 'Pass123!'}
        response = api_client.post(self.URL, data, format='json')
        assert response.status_code == 401

    def test_login_missing_fields(self, api_client):
        response = api_client.post(self.URL, {}, format='json')
        assert response.status_code == 400


@pytest.mark.django_db
class TestProfile:
    """Tests for user profile endpoints."""

    def test_get_me(self, auth_client, user):
        response = auth_client.get('/api/auth/me/')
        assert response.status_code == 200
        assert response.data['username'] == 'testuser'

    def test_get_me_unauthenticated(self, api_client):
        response = api_client.get('/api/auth/me/')
        assert response.status_code == 401

    def test_update_profile(self, auth_client, user):
        response = auth_client.patch(
            '/api/auth/profile/',
            {'first_name': 'Updated'},
            format='json',
        )
        assert response.status_code == 200
        assert response.data['first_name'] == 'Updated'

    def test_update_theme(self, auth_client, user):
        response = auth_client.patch(
            '/api/auth/theme/',
            {'theme_preference': 'dark'},
            format='json',
        )
        assert response.status_code == 200
        assert response.data['theme_preference'] == 'dark'

    def test_update_theme_invalid(self, auth_client, user):
        response = auth_client.patch(
            '/api/auth/theme/',
            {'theme_preference': 'blue'},
            format='json',
        )
        assert response.status_code == 400
