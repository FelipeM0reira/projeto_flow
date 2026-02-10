import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from src.models import Project, ProjectMembership, Task

User = get_user_model()


@pytest.fixture
def api_client():
    """Unauthenticated API client."""
    return APIClient()


@pytest.fixture
def user(db):
    """Create a regular test user."""
    return User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='TestPass123!',
        first_name='Test',
        last_name='User',
    )


@pytest.fixture
def user2(db):
    """Create a second test user for collaboration tests."""
    return User.objects.create_user(
        username='user2',
        email='user2@example.com',
        password='TestPass456!',
        first_name='Second',
        last_name='User',
    )


@pytest.fixture
def auth_client(api_client, user):
    """Authenticated API client."""
    api_client.force_authenticate(user=user)
    return api_client


@pytest.fixture
def auth_client2(api_client, user2):
    """Authenticated API client for user2."""
    client = APIClient()
    client.force_authenticate(user=user2)
    return client


@pytest.fixture
def project(user):
    """Create a test project owned by user."""
    project = Project.objects.create(
        name='Test Project',
        description='A test project',
        owner=user,
    )
    ProjectMembership.objects.create(
        user=user,
        project=project,
        role='admin',
    )
    return project


@pytest.fixture
def project_with_members(project, user2):
    """Create a project with a second member."""
    ProjectMembership.objects.create(
        user=user2,
        project=project,
        role='member',
    )
    return project


@pytest.fixture
def task(project, user):
    """Create a test task."""
    return Task.objects.create(
        title='Test Task',
        description='A test task',
        project=project,
        assigned_to=user,
        status='todo',
        priority='medium',
    )


@pytest.fixture
def multiple_tasks(project, user, user2):
    """Create multiple tasks with different statuses."""
    tasks = []
    statuses = ['todo', 'in_progress', 'done', 'todo', 'done']
    priorities = ['low', 'medium', 'high', 'low', 'high']
    for i in range(5):
        t = Task.objects.create(
            title=f'Task {i}',
            description=f'Description {i}',
            project=project,
            assigned_to=user if i < 3 else user2,
            status=statuses[i],
            priority=priorities[i],
            completed=(statuses[i] == 'done'),
        )
        tasks.append(t)
    return tasks
