import pytest
from rest_framework import status
from django.urls import reverse
from src.api.models import Project, Task


@pytest.mark.django_db
class TestProjectViewSet:
    def test_list_projects_unauthorized(self, api_client):
        """Test that unauthorized users cannot list projects."""
        response = api_client.get('/api/v1/projects/')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_list_projects_authorized(self, api_client, authenticated_user, project):
        """Test that authorized users can list their projects."""
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {authenticated_user['token']}")
        response = api_client.get('/api/v1/projects/')
        assert response.status_code == status.HTTP_200_OK
    
    def test_create_project(self, api_client, authenticated_user):
        """Test creating a new project."""
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {authenticated_user['token']}")
        data = {
            'name': 'New Project',
            'description': 'A new test project'
        }
        response = api_client.post('/api/v1/projects/', data)
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['name'] == 'New Project'
    
    def test_retrieve_project(self, api_client, authenticated_user, project):
        """Test retrieving a specific project."""
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {authenticated_user['token']}")
        response = api_client.get(f'/api/v1/projects/{project.id}/')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] == project.name


@pytest.mark.django_db
class TestTaskViewSet:
    def test_list_tasks_unauthorized(self, api_client):
        """Test that unauthorized users cannot list tasks."""
        response = api_client.get('/api/v1/tasks/')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_list_tasks_authorized(self, api_client, authenticated_user, task):
        """Test that authorized users can list their tasks."""
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {authenticated_user['token']}")
        response = api_client.get('/api/v1/tasks/')
        assert response.status_code == status.HTTP_200_OK
    
    def test_create_task(self, api_client, authenticated_user, project):
        """Test creating a new task."""
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {authenticated_user['token']}")
        data = {
            'project': str(project.id),
            'title': 'New Task',
            'status': 'pending'
        }
        response = api_client.post('/api/v1/tasks/', data)
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['title'] == 'New Task'


@pytest.mark.django_db
class TestAuthViews:
    def test_register_user(self, api_client):
        """Test user registration."""
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'securepass123',
            'password2': 'securepass123'
        }
        response = api_client.post('/api/v1/auth/register/', data)
        assert response.status_code == status.HTTP_201_CREATED
        assert 'access' in response.data
        assert 'refresh' in response.data
    
    def test_login_user(self, api_client, user):
        """Test user login."""
        data = {
            'username': 'testuser',
            'password': 'testpass123'
        }
        response = api_client.post('/api/v1/auth/login/', data)
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data
    
    def test_login_invalid_credentials(self, api_client):
        """Test login with invalid credentials."""
        data = {
            'username': 'nonexistent',
            'password': 'wrongpass'
        }
        response = api_client.post('/api/v1/auth/login/', data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
