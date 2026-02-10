import pytest
from src.models import Task


@pytest.mark.django_db
class TestTaskCRUD:
    """Tests for task CRUD operations."""

    def get_url(self, project_id, task_id=None):
        base = f'/api/projects/{project_id}/tasks/'
        if task_id:
            return f'{base}{task_id}/'
        return base

    def test_create_task(self, auth_client, project):
        data = {
            'title': 'New Task',
            'description': 'Task description',
            'priority': 'high',
        }
        response = auth_client.post(
            self.get_url(project.id), data, format='json'
        )
        assert response.status_code == 201
        assert response.data['title'] == 'New Task'

    def test_create_task_with_assignee(self, auth_client, project, user):
        data = {
            'title': 'Assigned Task',
            'assigned_to': user.id,
        }
        response = auth_client.post(
            self.get_url(project.id), data, format='json'
        )
        assert response.status_code == 201

    def test_list_tasks(self, auth_client, project, multiple_tasks):
        response = auth_client.get(self.get_url(project.id))
        assert response.status_code == 200
        assert response.data['count'] == 5

    def test_retrieve_task(self, auth_client, project, task):
        response = auth_client.get(self.get_url(project.id, task.id))
        assert response.status_code == 200
        assert response.data['title'] == 'Test Task'

    def test_update_task(self, auth_client, project, task):
        response = auth_client.patch(
            self.get_url(project.id, task.id),
            {'title': 'Updated Task'},
            format='json',
        )
        assert response.status_code == 200
        assert response.data['title'] == 'Updated Task'

    def test_delete_task(self, auth_client, project, task):
        response = auth_client.delete(self.get_url(project.id, task.id))
        assert response.status_code == 204
        assert not Task.objects.filter(id=task.id).exists()

    def test_unauthenticated_access(self, api_client, project):
        response = api_client.get(self.get_url(project.id))
        assert response.status_code == 401


@pytest.mark.django_db
class TestTaskCompletion:
    """Tests for task completion toggle."""

    def test_toggle_complete(self, auth_client, project, task):
        url = f'/api/projects/{project.id}/tasks/{task.id}/toggle_complete/'
        response = auth_client.patch(url)
        assert response.status_code == 200
        assert response.data['completed'] is True
        assert response.data['status'] == 'done'

    def test_toggle_incomplete(self, auth_client, project, task):
        task.mark_complete()
        url = f'/api/projects/{project.id}/tasks/{task.id}/toggle_complete/'
        response = auth_client.patch(url)
        assert response.status_code == 200
        assert response.data['completed'] is False
        assert response.data['status'] == 'todo'
