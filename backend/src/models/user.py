from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user model with theme preference."""

    THEME_CHOICES = [
        ('light', 'Claro'),
        ('dark', 'Escuro'),
    ]

    email = models.EmailField(unique=True)
    theme_preference = models.CharField(
        max_length=10,
        choices=THEME_CHOICES,
        default='light',
    )

    class Meta:
        db_table = 'users'
        ordering = ['-date_joined']

    def __str__(self):
        return self.username
