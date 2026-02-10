import pytest
from django.contrib.auth.models import User
from src.api.models import Project, Task, UserPreference


@pytest.mark.django_db
class TestProject:
    def test_project_creation(self, user):
        project = Project.objects.create(
            user=user,
            name='Test Project',
            description='A test project'
        )
        assert project.id is not None
        assert project.name == 'Test Project'
        assert project.user == user
        assert project.status == 'active'
    
    def test_project_str(self, project):
        assert str(project) == 'Test Project'
    
    def test_project_ordering(self, user):
        project1 = Project.objects.create(user=user, name='Project 1')
        project2 = Project.objects.create(user=user, name='Project 2')
        
        projects = Project.objects.all()
        assert projects[0] == project2  # Most recent first


@pytest.mark.django_db
class TestTask:
    def test_task_creation(self, project):
        task = Task.objects.create(
            project=project,
            title='Test Task',
            priority='high'
        )
        assert task.id is not None
        assert task.title == 'Test Task'
        assert task.project == project
        assert task.status == 'pending'
        assert task.priority == 'high'
    
    def test_task_str(self, task):
        assert str(task) == 'Test Task'
    
    def test_task_status_choices(self, task):
        valid_statuses = ['pending', 'in_progress', 'completed', 'cancelled']
        for status in valid_statuses:
            task.status = status
            task.save()
            assert task.status == status
    
    def test_task_priority_choices(self, task):
        valid_priorities = ['low', 'medium', 'high', 'urgent']
        for priority in valid_priorities:
            task.priority = priority
            task.save()
            assert task.priority == priority


@pytest.mark.django_db
class TestUserPreference:
    def test_user_preference_creation(self, user):
        preference = UserPreference.objects.create(
            user=user,
            theme='dark',
            language='pt'
        )
        assert preference.user == user
        assert preference.theme == 'dark'
        assert preference.language == 'pt'
    
    def test_user_preference_str(self, user_preference):
        assert 'testuser' in str(user_preference).lower()
    
    def test_user_preference_defaults(self, user):
        preference = UserPreference.objects.create(user=user)
        assert preference.theme == 'light'
        assert preference.language == 'en'
