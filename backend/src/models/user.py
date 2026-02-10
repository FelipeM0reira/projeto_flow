"""
User model for theme preference management.
"""
from django.db import models
from django.contrib.auth.hashers import make_password, check_password


class User(models.Model):
    """
    User model with theme preference.
    """
    THEME_CHOICES = [
        ('light', 'Light'),
        ('dark', 'Dark'),
    ]

    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(max_length=254, unique=True)
    password_hash = models.CharField(max_length=255)
    theme_preference = models.CharField(
        max_length=10,
        choices=THEME_CHOICES,
        default='light'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'users'
        ordering = ['-created_at']

    def __str__(self):
        return self.username

    def set_password(self, raw_password):
        """Set hashed password."""
        self.password_hash = make_password(raw_password)

    def check_password(self, raw_password):
        """Check if password is correct."""
        return check_password(raw_password, self.password_hash)

    def to_dict(self):
        """Convert model to dictionary."""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'theme_preference': self.theme_preference,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }
