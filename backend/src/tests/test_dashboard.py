import pytest
from datetime import date, timedelta
from src.models import Task


@pytest.mark.django_db
class TestDashboard:
    """Tests for the dashboard endpoint."""

    URL = '/api/dashboard/'

    def test_dashboard_empty(self, auth_client):
        response = auth_client.get(self.URL)
        assert response.status_code == 200
        assert response.data['total_projects'] == 0
        assert response.data['total_tasks'] == 0

    def test_dashboard_with_data(self, auth_client, project, multiple_tasks):
        response = auth_client.get(self.URL)
        assert response.status_code == 200
        assert response.data['total_projects'] == 1
        assert response.data['total_tasks'] == 5
        assert response.data['completed_tasks'] == 2
        assert response.data['pending_tasks'] == 3

    def test_dashboard_tasks_by_status(self, auth_client, project, multiple_tasks):
        response = auth_client.get(self.URL)
        status_data = response.data['tasks_by_status']
        assert status_data.get('todo', 0) == 2
        assert status_data.get('in_progress', 0) == 1
        assert status_data.get('done', 0) == 2

    def test_dashboard_overdue_tasks(self, auth_client, project, user):
        Task.objects.create(
            title='Overdue',
            project=project,
            assigned_to=user,
            due_date=date.today() - timedelta(days=1),
        )
        Task.objects.create(
            title='Not overdue',
            project=project,
            assigned_to=user,
            due_date=date.today() + timedelta(days=1),
        )
        response = auth_client.get(self.URL)
        assert response.data['overdue_tasks'] == 1

    def test_dashboard_unauthenticated(self, api_client):
        response = api_client.get(self.URL)
        assert response.status_code == 401
