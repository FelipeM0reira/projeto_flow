import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'src.settings')

if not settings.configured:
    django.setup()

# pytest configuration
import pytest
from django.test import Client
from django.contrib.auth.models import User
from rest_framework.test import APIClient, APIRequestFactory
from src.api.models import Project, Task, UserPreference


@pytest.fixture(scope='session')
def django_db_setup():
    """Setup Django database for tests."""
    settings.DATABASES['default'] = {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    }


@pytest.fixture
def api_client():
    """Fixture to provide API client."""
    return APIClient()


@pytest.fixture
def user(db):
    """Fixture to create a test user."""
    user = User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='testpass123'
    )
    return user


@pytest.fixture
def authenticated_user(user):
    """Fixture to create and authenticate a user."""
    from rest_framework_simplejwt.tokens import RefreshToken
    refresh = RefreshToken.for_user(user)
    return {'user': user, 'token': str(refresh.access_token)}


@pytest.fixture
def project(db, user):
    """Fixture to create a test project."""
    return Project.objects.create(
        user=user,
        name='Test Project',
        description='A test project'
    )


@pytest.fixture
def task(db, project):
    """Fixture to create a test task."""
    return Task.objects.create(
        project=project,
        title='Test Task',
        description='A test task',
        status='pending'
    )


@pytest.fixture
def user_preference(db, user):
    """Fixture to get or create user preference."""
    preference, _ = UserPreference.objects.get_or_create(user=user)
    return preference
