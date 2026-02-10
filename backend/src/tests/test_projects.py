import pytest
from src.models import Project, ProjectMembership


@pytest.mark.django_db
class TestProjectCRUD:
    """Tests for project CRUD operations."""

    URL = '/api/projects/'

    def test_create_project(self, auth_client):
        data = {'name': 'New Project', 'description': 'Description'}
        response = auth_client.post(self.URL, data, format='json')
        assert response.status_code == 201
        assert response.data['name'] == 'New Project'
        assert response.data['owner_username'] == 'testuser'

    def test_create_project_auto_membership(self, auth_client, user):
        data = {'name': 'New Project'}
        response = auth_client.post(self.URL, data, format='json')
        project_id = response.data['id']
        assert ProjectMembership.objects.filter(
            user=user, project_id=project_id, role='admin'
        ).exists()

    def test_list_projects(self, auth_client, project):
        response = auth_client.get(self.URL)
        assert response.status_code == 200
        assert response.data['count'] == 1

    def test_list_only_own_projects(self, auth_client2, project):
        # user2 is not a member of project
        response = auth_client2.get(self.URL)
        assert response.data['count'] == 0

    def test_list_member_projects(self, auth_client2, project_with_members):
        # user2 is a member of project_with_members
        response = auth_client2.get(self.URL)
        assert response.data['count'] == 1

    def test_retrieve_project(self, auth_client, project):
        response = auth_client.get(f'{self.URL}{project.id}/')
        assert response.status_code == 200
        assert response.data['name'] == 'Test Project'
        assert 'members' in response.data  # Detail serializer

    def test_update_project(self, auth_client, project):
        response = auth_client.patch(
            f'{self.URL}{project.id}/',
            {'name': 'Updated Project'},
            format='json',
        )
        assert response.status_code == 200
        assert response.data['name'] == 'Updated Project'

    def test_delete_project(self, auth_client, project):
        response = auth_client.delete(f'{self.URL}{project.id}/')
        assert response.status_code == 204
        assert not Project.objects.filter(id=project.id).exists()

    def test_delete_project_not_owner(self, auth_client2, project_with_members):
        response = auth_client2.delete(
            f'{self.URL}{project_with_members.id}/'
        )
        assert response.status_code == 403

    def test_unauthenticated_access(self, api_client):
        response = api_client.get(self.URL)
        assert response.status_code == 401


@pytest.mark.django_db
class TestProjectMembers:
    """Tests for project member management."""

    def test_add_member(self, auth_client, project, user2):
        response = auth_client.post(
            f'/api/projects/{project.id}/add_member/',
            {'username': 'user2', 'role': 'member'},
            format='json',
        )
        assert response.status_code == 201
        assert response.data['username'] == 'user2'

    def test_add_member_duplicate(self, auth_client, project_with_members):
        response = auth_client.post(
            f'/api/projects/{project_with_members.id}/add_member/',
            {'username': 'user2'},
            format='json',
        )
        assert response.status_code == 400

    def test_add_member_nonexistent_user(self, auth_client, project):
        response = auth_client.post(
            f'/api/projects/{project.id}/add_member/',
            {'username': 'nonexistent'},
            format='json',
        )
        assert response.status_code == 400

    def test_remove_member(self, auth_client, project_with_members, user2):
        response = auth_client.delete(
            f'/api/projects/{project_with_members.id}/remove_member/{user2.id}/'
        )
        assert response.status_code == 204

    def test_remove_owner_fails(self, auth_client, project, user):
        response = auth_client.delete(
            f'/api/projects/{project.id}/remove_member/{user.id}/'
        )
        assert response.status_code == 400

    def test_list_members(self, auth_client, project_with_members):
        response = auth_client.get(
            f'/api/projects/{project_with_members.id}/members/'
        )
        assert response.status_code == 200
        assert len(response.data) == 2
