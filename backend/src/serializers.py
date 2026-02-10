"""
Serializers for API models.
"""
from rest_framework import serializers
from src.models import User


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'theme_preference', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        """Create user with hashed password."""
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        """Update user, handling password separately."""
        password = validated_data.pop('password', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance


class ThemePreferenceSerializer(serializers.Serializer):
    """Serializer for theme preference update."""
    
    theme_preference = serializers.ChoiceField(choices=['light', 'dark'])

    def validate_theme_preference(self, value):
        """Validate theme preference value."""
        if value not in ['light', 'dark']:
            raise serializers.ValidationError("Theme must be 'light' or 'dark'")
        return value
