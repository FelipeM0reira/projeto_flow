"""
Unit tests for User model.
"""
import pytest
from django.db import IntegrityError
from src.models import User


@pytest.mark.django_db
class TestUserModel:
    """Test cases for User model."""

    def test_create_user(self):
        """Test creating a user with valid data."""
        user = User.objects.create(
            username='newuser',
            email='newuser@example.com',
            theme_preference='light'
        )
        user.set_password('securepass123')
        user.save()

        assert user.id is not None
        assert user.username == 'newuser'
        assert user.email == 'newuser@example.com'
        assert user.theme_preference == 'light'
        assert user.check_password('securepass123')

    def test_user_default_theme(self):
        """Test that default theme is light."""
        user = User.objects.create(
            username='defaultuser',
            email='default@example.com'
        )
        
        assert user.theme_preference == 'light'

    def test_user_unique_username(self):
        """Test that username must be unique."""
        User.objects.create(
            username='uniqueuser',
            email='unique1@example.com'
        )
        
        with pytest.raises(IntegrityError):
            User.objects.create(
                username='uniqueuser',
                email='unique2@example.com'
            )

    def test_user_unique_email(self):
        """Test that email must be unique."""
        User.objects.create(
            username='user1',
            email='same@example.com'
        )
        
        with pytest.raises(IntegrityError):
            User.objects.create(
                username='user2',
                email='same@example.com'
            )

    def test_set_password(self):
        """Test password hashing."""
        user = User.objects.create(
            username='passuser',
            email='pass@example.com'
        )
        user.set_password('mypassword123')
        user.save()

        assert user.password_hash != 'mypassword123'
        assert user.check_password('mypassword123')
        assert not user.check_password('wrongpassword')

    def test_change_theme_preference(self):
        """Test changing theme preference."""
        user = User.objects.create(
            username='themeuser',
            email='theme@example.com',
            theme_preference='light'
        )
        
        assert user.theme_preference == 'light'
        
        user.theme_preference = 'dark'
        user.save()
        
        user.refresh_from_db()
        assert user.theme_preference == 'dark'

    def test_user_to_dict(self):
        """Test converting user to dictionary."""
        user = User.objects.create(
            username='dictuser',
            email='dict@example.com',
            theme_preference='dark'
        )
        
        user_dict = user.to_dict()
        
        assert user_dict['username'] == 'dictuser'
        assert user_dict['email'] == 'dict@example.com'
        assert user_dict['theme_preference'] == 'dark'
        assert 'password_hash' not in user_dict
        assert 'id' in user_dict
        assert 'created_at' in user_dict
        assert 'updated_at' in user_dict

    def test_user_str_representation(self):
        """Test string representation of user."""
        user = User.objects.create(
            username='struser',
            email='str@example.com'
        )
        
        assert str(user) == 'struser'
