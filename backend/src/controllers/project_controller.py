from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from src.models import Project, ProjectMembership
from src.serializers import (
    ProjectSerializer,
    ProjectDetailSerializer,
    AddMemberSerializer,
    ProjectMemberSerializer,
)

User = get_user_model()


class ProjectViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Project CRUD operations.
    Users see projects they own OR are members of.
    """

    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProjectDetailSerializer
        return ProjectSerializer

    def get_queryset(self):
        user = self.request.user
        return Project.objects.filter(
            Q(owner=user) | Q(members=user)
        ).distinct()

    def perform_create(self, serializer):
        project = serializer.save(owner=self.request.user)
        # Owner is automatically added as admin member
        ProjectMembership.objects.create(
            user=self.request.user,
            project=project,
            role='admin',
        )

    def perform_update(self, serializer):
        project = self.get_object()
        if project.owner != self.request.user:
            membership = project.memberships.filter(
                user=self.request.user, role='admin'
            ).first()
            if not membership:
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied('Apenas o dono ou admins podem editar o projeto.')
        serializer.save()

    def perform_destroy(self, instance):
        if instance.owner != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Apenas o dono pode excluir o projeto.')
        instance.delete()

    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        """Add a member to the project."""
        project = self.get_object()
        serializer = AddMemberSerializer(data=request.data)
        if serializer.is_valid():
            user = User.objects.get(username=serializer.validated_data['username'])
            if ProjectMembership.objects.filter(user=user, project=project).exists():
                return Response(
                    {'detail': 'Usuário já é membro do projeto.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            membership = ProjectMembership.objects.create(
                user=user,
                project=project,
                role=serializer.validated_data['role'],
            )
            return Response(
                ProjectMemberSerializer(membership).data,
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'], url_path='remove_member/(?P<user_id>[^/.]+)')
    def remove_member(self, request, pk=None, user_id=None):
        """Remove a member from the project."""
        project = self.get_object()
        if project.owner_id == int(user_id):
            return Response(
                {'detail': 'Não é possível remover o dono do projeto.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        membership = ProjectMembership.objects.filter(
            user_id=user_id, project=project,
        ).first()
        if not membership:
            return Response(
                {'detail': 'Membro não encontrado.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        membership.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['get'])
    def members(self, request, pk=None):
        """List all members of a project."""
        project = self.get_object()
        memberships = project.memberships.select_related('user').all()
        serializer = ProjectMemberSerializer(memberships, many=True)
        return Response(serializer.data)
