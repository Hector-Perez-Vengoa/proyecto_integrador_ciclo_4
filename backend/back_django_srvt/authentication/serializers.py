from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo User.
    
    Permite ver y editar información básica del usuario manteniendo 
    seguros campos como el email y contraseña.
    """
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'full_name', 'is_active', 'date_joined', 'last_login'
        ]
        read_only_fields = ['id', 'email', 'date_joined', 'last_login']
    
    def get_full_name(self, obj):
        """Devuelve el nombre completo del usuario"""
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username

class UserAdminSerializer(UserSerializer):
    """
    Serializer extendido para administradores.
    Permite acceso a más campos y capacidad para modificarlos.
    """
    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + ['is_staff', 'is_superuser', 'groups']
        read_only_fields = ['id', 'date_joined']  # Los admins pueden editar email
