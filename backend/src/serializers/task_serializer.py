from rest_framework import serializers

from src.models import Task


class TaskSerializer(serializers.ModelSerializer):
    """Serializer for Task model."""

    assigned_to_username = serializers.CharField(
        source='assigned_to.username',
        read_only=True,
        default=None,
    )
    project_name = serializers.CharField(source='project.name', read_only=True)

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'project', 'project_name',
            'assigned_to', 'assigned_to_username', 'status', 'priority',
            'due_date', 'completed', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class TaskCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating tasks (project set via URL)."""

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'assigned_to',
            'status', 'priority', 'due_date',
        ]
        read_only_fields = ['id']
