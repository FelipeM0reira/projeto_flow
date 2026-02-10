import pytest
from django.contrib.auth import get_user_model
from src.models import Project, ProjectMembership, Task

User = get_user_model()


@pytest.mark.django_db
class TestUserModel:
    """Tests for the custom User model."""

    def test_create_user(self, user):
        assert user.username == 'testuser'
        assert user.email == 'test@example.com'
        assert user.check_password('TestPass123!')
        assert user.theme_preference == 'light'

    def test_default_theme_is_light(self, user):
        assert user.theme_preference == 'light'

    def test_change_theme(self, user):
        user.theme_preference = 'dark'
        user.save()
        user.refresh_from_db()
        assert user.theme_preference == 'dark'

    def test_str_representation(self, user):
        assert str(user) == 'testuser'

    def test_unique_username(self, user):
        with pytest.raises(Exception):
            User.objects.create_user(
                username='testuser',
                email='other@example.com',
                password='Pass123!',
            )

    def test_unique_email(self, user):
        with pytest.raises(Exception):
            User.objects.create_user(
                username='otheruser',
                email='test@example.com',
                password='Pass123!',
            )


@pytest.mark.django_db
class TestProjectModel:
    """Tests for the Project model."""

    def test_create_project(self, project):
        assert project.name == 'Test Project'
        assert project.description == 'A test project'
        assert project.owner.username == 'testuser'

    def test_str_representation(self, project):
        assert str(project) == 'Test Project'

    def test_project_ordering(self, user):
        p1 = Project.objects.create(name='First', owner=user)
        p2 = Project.objects.create(name='Second', owner=user)
        projects = list(Project.objects.all())
        # Ordered by -created_at, newest first
        assert projects[0].name == 'Second'

    def test_project_membership(self, project_with_members, user, user2):
        assert project_with_members.memberships.count() == 2
        assert ProjectMembership.objects.filter(
            user=user2, project=project_with_members
        ).exists()


@pytest.mark.django_db
class TestProjectMembershipModel:
    """Tests for the ProjectMembership model."""

    def test_unique_together(self, project, user):
        # user is already a member from the project fixture
        with pytest.raises(Exception):
            ProjectMembership.objects.create(
                user=user, project=project, role='member'
            )

    def test_default_role_is_member(self, project, user2):
        membership = ProjectMembership.objects.create(
            user=user2, project=project
        )
        assert membership.role == 'member'

    def test_str_representation(self, project, user):
        membership = ProjectMembership.objects.get(user=user, project=project)
        assert 'testuser' in str(membership)
        assert 'Test Project' in str(membership)


@pytest.mark.django_db
class TestTaskModel:
    """Tests for the Task model."""

    def test_create_task(self, task):
        assert task.title == 'Test Task'
        assert task.project.name == 'Test Project'
        assert task.assigned_to.username == 'testuser'
        assert task.status == 'todo'
        assert task.priority == 'medium'
        assert task.completed is False

    def test_str_representation(self, task):
        assert str(task) == 'Test Task'

    def test_mark_complete(self, task):
        task.mark_complete()
        task.refresh_from_db()
        assert task.completed is True
        assert task.status == 'done'

    def test_mark_incomplete(self, task):
        task.mark_complete()
        task.mark_incomplete()
        task.refresh_from_db()
        assert task.completed is False
        assert task.status == 'todo'

    def test_default_status_is_todo(self, project):
        t = Task.objects.create(title='New', project=project)
        assert t.status == 'todo'
        assert t.completed is False

    def test_default_priority_is_medium(self, project):
        t = Task.objects.create(title='New', project=project)
        assert t.priority == 'medium'

    def test_task_cascade_delete_with_project(self, task):
        project = task.project
        project.delete()
        assert Task.objects.filter(id=task.id).count() == 0

    def test_assigned_to_set_null_on_delete(self, project, user2):
        """When assigned user is deleted, task.assigned_to becomes null."""
        t = Task.objects.create(
            title='Assigned Task',
            project=project,
            assigned_to=user2,
        )
        user2.delete()
        t.refresh_from_db()
        assert t.assigned_to is None
