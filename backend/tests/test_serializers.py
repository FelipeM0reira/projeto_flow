import pytest
from django.contrib.auth.models import User
from src.api.serializers import (
    ProjectSerializer, TaskSerializer, UserSerializer,
    RegisterSerializer, LoginSerializer
)
from src.api.models import Project, Task


@pytest.mark.django_db
class TestProjectSerializer:
    def test_project_serialization(self, project):
        serializer = ProjectSerializer(project)
        data = serializer.data
        
        assert data['name'] == project.name
        assert data['description'] == project.description
        assert data['status'] == project.status
    
    def test_project_serialization_with_tasks(self, project, task):
        serializer = ProjectSerializer(project)
        data = serializer.data
        
        assert 'tasks' in data
        assert data['task_count'] == 1


@pytest.mark.django_db
class TestTaskSerializer:
    def test_task_serialization(self, task):
        serializer = TaskSerializer(task)
        data = serializer.data
        
        assert data['title'] == task.title
        assert data['status'] == task.status
        assert data['priority'] == task.priority
    
    def test_task_deserialization(self, project):
        data = {
            'project': str(project.id),
            'title': 'New Task',
            'status': 'pending',
            'priority': 'high'
        }
        serializer = TaskSerializer(data=data)
        assert serializer.is_valid()


@pytest.mark.django_db
class TestRegisterSerializer:
    def test_register_valid_data(self):
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'securepass123',
            'password2': 'securepass123'
        }
        serializer = RegisterSerializer(data=data)
        assert serializer.is_valid()
        
        user = serializer.save()
        assert user.username == 'newuser'
        assert user.email == 'newuser@example.com'
    
    def test_register_password_mismatch(self):
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'securepass123',
            'password2': 'differentpass123'
        }
        serializer = RegisterSerializer(data=data)
        assert not serializer.is_valid()
        assert 'password' in serializer.errors
    
    def test_register_duplicate_username(self, user):
        data = {
            'username': 'testuser',
            'email': 'another@example.com',
            'password': 'securepass123',
            'password2': 'securepass123'
        }
        serializer = RegisterSerializer(data=data)
        assert not serializer.is_valid()


@pytest.mark.django_db
class TestLoginSerializer:
    def test_login_valid_credentials(self, user):
        data = {
            'username': 'testuser',
            'password': 'testpass123'
        }
        serializer = LoginSerializer(data=data)
        assert serializer.is_valid()
    
    def test_login_invalid_credentials(self):
        data = {
            'username': 'nonexistent',
            'password': 'wrongpass'
        }
        serializer = LoginSerializer(data=data)
        assert not serializer.is_valid()
