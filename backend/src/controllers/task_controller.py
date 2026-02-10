from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from src.models import Task, Project
from src.serializers import TaskSerializer, TaskCreateSerializer


class TaskViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Task CRUD operations.
    Tasks are scoped to a project via URL: /api/projects/<project_id>/tasks/
    """

    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return TaskCreateSerializer
        return TaskSerializer

    def get_queryset(self):
        project_id = self.kwargs.get('project_id')
        if project_id:
            return Task.objects.filter(project_id=project_id).select_related(
                'assigned_to', 'project'
            )
        # For listing all user tasks (dashboard)
        return Task.objects.filter(
            project__owner=self.request.user
        ).select_related('assigned_to', 'project') | Task.objects.filter(
            project__members=self.request.user
        ).select_related('assigned_to', 'project')

    def perform_create(self, serializer):
        project_id = self.kwargs.get('project_id')
        project = Project.objects.get(id=project_id)
        serializer.save(project=project)

    @action(detail=True, methods=['patch'])
    def toggle_complete(self, request, project_id=None, pk=None):
        """Toggle task completion status."""
        task = self.get_object()
        if task.completed:
            task.mark_incomplete()
        else:
            task.mark_complete()
        return Response(TaskSerializer(task).data)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['project_id'] = self.kwargs.get('project_id')
        return context
