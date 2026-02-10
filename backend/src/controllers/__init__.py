from .auth_controller import register, login, me, update_profile, update_theme
from .project_controller import ProjectViewSet
from .task_controller import TaskViewSet
from .dashboard_controller import dashboard

__all__ = [
    'register', 'login', 'me', 'update_profile', 'update_theme',
    'ProjectViewSet', 'TaskViewSet', 'dashboard',
]
