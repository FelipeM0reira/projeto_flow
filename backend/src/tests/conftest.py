"""
Pytest configuration and fixtures.
"""
import pytest
from django.conf import settings
from rest_framework.test import APIClient
from src.models import User


@pytest.fixture(scope='session')
def django_db_setup():
    """Setup test database configuration."""
    settings.DATABASES['default'] = {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'test_db',
        'USER': 'local_user',
        'PASSWORD': 'local_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }


@pytest.fixture
def api_client():
    """Return API client for testing."""
    return APIClient()


@pytest.fixture
def sample_user(db):
    """Create a sample user for testing."""
    user = User.objects.create(
        username='testuser',
        email='test@example.com',
        theme_preference='light'
    )
    user.set_password('testpass123')
    user.save()
    return user


@pytest.fixture
def sample_dark_user(db):
    """Create a sample user with dark theme for testing."""
    user = User.objects.create(
        username='darkuser',
        email='dark@example.com',
        theme_preference='dark'
    )
    user.set_password('darkpass123')
    user.save()
    return user


@pytest.fixture
def multiple_users(db):
    """Create multiple users for testing."""
    users = []
    for i in range(5):
        user = User.objects.create(
            username=f'user{i}',
            email=f'user{i}@example.com',
            theme_preference='light' if i % 2 == 0 else 'dark'
        )
        user.set_password(f'pass{i}')
        user.save()
        users.append(user)
    return users
