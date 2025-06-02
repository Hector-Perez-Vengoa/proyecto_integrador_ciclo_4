

from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import PerfilDB

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer básico para el modelo User (solo para admin)
    """
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'full_name', 'is_active', 'date_joined', 'last_login'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login']
    
    def get_full_name(self, obj):
        """Devuelve el nombre completo del usuario"""
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username

class PerfilSerializer(serializers.ModelSerializer):
    """
    Serializer básico para el modelo PerfilDB (solo para admin)
    """
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    nombre_completo = serializers.ReadOnlyField()
    
    class Meta:
        model = PerfilDB
        fields = [
            'id', 'username', 'email', 'imagen_perfil', 'telefono', 
            'biografia', 'fecha_nacimiento', 'ubicacion', 'sitio_web', 
            'linkedin', 'twitter', 'nombre_completo', 'fecha_actualizacion'
        ]
        read_only_fields = ['id', 'username', 'email', 'fecha_actualizacion']
