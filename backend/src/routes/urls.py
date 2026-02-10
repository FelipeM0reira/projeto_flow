"""
URL routes for API endpoints.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from src.controllers import (
    register, login, me, update_profile, update_theme,
    ProjectViewSet, TaskViewSet, dashboard,
)

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')

# Nested task routes under projects
task_list = TaskViewSet.as_view({'get': 'list', 'post': 'create'})
task_detail = TaskViewSet.as_view({
    'get': 'retrieve', 'put': 'update',
    'patch': 'partial_update', 'delete': 'destroy',
})
task_toggle = TaskViewSet.as_view({'patch': 'toggle_complete'})

urlpatterns = [
    # Auth
    path('auth/register/', register, name='register'),
    path('auth/login/', login, name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', me, name='me'),
    path('auth/profile/', update_profile, name='update_profile'),
    path('auth/theme/', update_theme, name='update_theme'),

    # Dashboard
    path('dashboard/', dashboard, name='dashboard'),

    # Projects (router)
    path('', include(router.urls)),

    # Tasks (nested under projects)
    path('projects/<int:project_id>/tasks/', task_list, name='task-list'),
    path('projects/<int:project_id>/tasks/<int:pk>/', task_detail, name='task-detail'),
    path('projects/<int:project_id>/tasks/<int:pk>/toggle_complete/', task_toggle, name='task-toggle'),
]
