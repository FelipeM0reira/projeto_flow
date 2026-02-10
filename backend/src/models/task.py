from django.conf import settings
from django.db import models

from .project import Project


class Task(models.Model):
    """Represents a task within a project."""

    STATUS_CHOICES = [
        ('todo', 'A Fazer'),
        ('in_progress', 'Em Progresso'),
        ('done', 'Concluída'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Baixa'),
        ('medium', 'Média'),
        ('high', 'Alta'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, default='')
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='tasks',
    )
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_tasks',
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='todo',
    )
    priority = models.CharField(
        max_length=10,
        choices=PRIORITY_CHOICES,
        default='medium',
    )
    due_date = models.DateField(null=True, blank=True)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tasks'
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def mark_complete(self):
        """Mark the task as completed."""
        self.completed = True
        self.status = 'done'
        self.save()

    def mark_incomplete(self):
        """Mark the task as incomplete."""
        self.completed = False
        self.status = 'todo'
        self.save()
