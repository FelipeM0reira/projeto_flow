from django.db.models import Q, Count
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from src.models import Project, Task


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    """
    Dashboard endpoint returning project and task statistics
    for the authenticated user.
    """
    user = request.user

    # Projects the user owns or is a member of
    projects = Project.objects.filter(
        Q(owner=user) | Q(members=user)
    ).distinct()

    total_projects = projects.count()

    # Tasks from those projects
    tasks = Task.objects.filter(project__in=projects)
    total_tasks = tasks.count()
    completed_tasks = tasks.filter(completed=True).count()
    pending_tasks = tasks.filter(completed=False).count()
    my_tasks = tasks.filter(assigned_to=user).count()
    my_pending_tasks = tasks.filter(assigned_to=user, completed=False).count()

    # Tasks by status
    tasks_by_status = dict(
        tasks.values_list('status').annotate(count=Count('id')).values_list('status', 'count')
    )

    # Tasks by priority
    tasks_by_priority = dict(
        tasks.values_list('priority').annotate(count=Count('id')).values_list('priority', 'count')
    )

    # Recent projects
    recent_projects = projects[:5].values('id', 'name', 'created_at')

    # Overdue tasks
    from django.utils import timezone
    overdue_tasks = tasks.filter(
        completed=False,
        due_date__lt=timezone.now().date(),
    ).count()

    return Response({
        'total_projects': total_projects,
        'total_tasks': total_tasks,
        'completed_tasks': completed_tasks,
        'pending_tasks': pending_tasks,
        'my_tasks': my_tasks,
        'my_pending_tasks': my_pending_tasks,
        'overdue_tasks': overdue_tasks,
        'tasks_by_status': tasks_by_status,
        'tasks_by_priority': tasks_by_priority,
        'recent_projects': list(recent_projects),
    })
