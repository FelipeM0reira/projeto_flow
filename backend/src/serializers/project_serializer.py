from django.contrib.auth import get_user_model
from rest_framework import serializers

from src.models import Project, ProjectMembership

User = get_user_model()


class ProjectMemberSerializer(serializers.ModelSerializer):
    """Serializer for project membership details."""

    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)

    class Meta:
        model = ProjectMembership
        fields = ['id', 'user_id', 'username', 'email', 'role', 'joined_at']
        read_only_fields = ['id', 'joined_at']


class AddMemberSerializer(serializers.Serializer):
    """Serializer for adding a member to a project."""

    username = serializers.CharField(required=True)
    role = serializers.ChoiceField(
        choices=['admin', 'member'],
        default='member',
    )

    def validate_username(self, value):
        try:
            User.objects.get(username=value)
        except User.DoesNotExist:
            raise serializers.ValidationError('Usuário não encontrado.')
        return value


class ProjectSerializer(serializers.ModelSerializer):
    """Serializer for Project model."""

    owner_username = serializers.CharField(source='owner.username', read_only=True)
    members_count = serializers.SerializerMethodField()
    tasks_count = serializers.SerializerMethodField()
    completed_tasks_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'owner', 'owner_username',
            'members_count', 'tasks_count', 'completed_tasks_count',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']

    def get_members_count(self, obj):
        return obj.memberships.count()

    def get_tasks_count(self, obj):
        return obj.tasks.count()

    def get_completed_tasks_count(self, obj):
        return obj.tasks.filter(completed=True).count()


class ProjectDetailSerializer(ProjectSerializer):
    """Extended serializer with members list."""

    members = ProjectMemberSerializer(source='memberships', many=True, read_only=True)

    class Meta(ProjectSerializer.Meta):
        fields = ProjectSerializer.Meta.fields + ['members']
