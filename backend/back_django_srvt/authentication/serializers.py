from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Perfil, UsuarioCustom, Rol, Departamento, Carrera, Curso

User = get_user_model()

class RolSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Rol
    """
    class Meta:
        model = Rol
        fields = ['id', 'nombre', 'descripcion']

class UsuarioCustomSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo UsuarioCustom
    """
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = UsuarioCustom
        fields = ['id', 'username', 'email', 'full_name', 'google_image_url', 'has_password']
        read_only_fields = ['id']
    
    def get_full_name(self, obj):
        """Devuelve el nombre completo del usuario"""
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer mejorado para el modelo User para uso como profesores
    Mapea campos de auth_user a la estructura esperada por el frontend
    """
    full_name = serializers.SerializerMethodField()
    nombre_completo = serializers.SerializerMethodField()  # Alias para compatibilidad
    nombres = serializers.CharField(source='first_name')  # Mapeo para compatibilidad
    apellidos = serializers.CharField(source='last_name')  # Mapeo para compatibilidad
    correo = serializers.EmailField(source='email')  # Mapeo para compatibilidad
    codigo = serializers.CharField(source='username')  # Mapeo para compatibilidad
    usuario_custom = UsuarioCustomSerializer(read_only=True)
    perfil = serializers.SerializerMethodField()  # Información del perfil si existe
    departamento = serializers.SerializerMethodField()  # Del perfil
    departamento_nombre = serializers.SerializerMethodField()  # Del perfil
    carreras = serializers.SerializerMethodField()  # Del perfil
    carreras_nombres = serializers.SerializerMethodField()  # Del perfil
    cursos = serializers.SerializerMethodField()  # Del perfil
    cursos_nombres = serializers.SerializerMethodField()  # Del perfil
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'codigo', 'nombres', 'apellidos', 'correo',  # Campos mapeados
            'full_name', 'nombre_completo', 'is_active', 'is_staff', 'is_superuser',
            'date_joined', 'last_login', 'usuario_custom', 'perfil',
            'departamento', 'departamento_nombre', 'carreras', 'carreras_nombres',
            'cursos', 'cursos_nombres'
        ]
        read_only_fields = ['id', 'username', 'date_joined', 'last_login']
    
    def get_full_name(self, obj):
        """Devuelve el nombre completo del usuario"""
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username
    
    def get_nombre_completo(self, obj):
        """Alias para compatibilidad con frontend"""
        return self.get_full_name(obj)
    
    def get_perfil(self, obj):
        """Obtiene información del perfil si existe"""
        # Por ahora retornamos None ya que simplificamos a solo usar auth_user
        return None
    
    def get_departamento(self, obj):
        """Obtiene el ID del departamento del perfil"""
        # Por ahora retornamos None ya que simplificamos a solo usar auth_user
        return None
    
    def get_departamento_nombre(self, obj):
        """Obtiene el nombre del departamento del perfil"""
        # Por ahora retornamos None ya que simplificamos a solo usar auth_user
        return None
    
    def get_carreras(self, obj):
        """Obtiene los IDs de las carreras del perfil"""
        # Por ahora retornamos lista vacía ya que simplificamos a solo usar auth_user
        return []
    
    def get_carreras_nombres(self, obj):
        """Obtiene los nombres de las carreras del perfil"""
        # Por ahora retornamos lista vacía ya que simplificamos a solo usar auth_user
        return []
    
    def get_cursos(self, obj):
        """Obtiene los IDs de los cursos del perfil"""
        # Por ahora retornamos lista vacía ya que simplificamos a solo usar auth_user
        return []
    
    def get_cursos_nombres(self, obj):
        """Obtiene los nombres de los cursos del perfil"""
        # Por ahora retornamos lista vacía ya que simplificamos a solo usar auth_user
        return []

class DepartamentoSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Departamento
    """
    class Meta:
        model = Departamento
        fields = ['id', 'nombre', 'descripcion', 'jefe', 'fecha_creacion']
        read_only_fields = ['id', 'fecha_creacion']

class CarreraSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Carrera
    """
    departamento_nombre = serializers.CharField(source='departamento.nombre', read_only=True)
    
    class Meta:
        model = Carrera
        fields = ['id', 'nombre', 'codigo', 'descripcion', 'departamento', 'departamento_nombre', 'fecha_creacion']
        read_only_fields = ['id', 'fecha_creacion']

class CursoSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Curso
    """
    carrera_nombre = serializers.CharField(source='carrera.nombre', read_only=True)
    
    class Meta:
        model = Curso
        fields = ['id', 'nombre', 'descripcion', 'carrera', 'carrera_nombre', 'duracion', 'fecha', 'fecha_creacion']
        read_only_fields = ['id', 'fecha_creacion']

class PerfilSerializer(serializers.ModelSerializer):
    """
    Serializer actualizado para el modelo Perfil
    """
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    nombre_completo = serializers.ReadOnlyField()
    departamento_nombre = serializers.CharField(source='departamento.nombre', read_only=True)
    carreras_nombres = serializers.SerializerMethodField()
    cursos_nombres = serializers.SerializerMethodField()
    is_active = serializers.BooleanField(source='user.is_active', read_only=True)
    perfil_completo = serializers.ReadOnlyField()
    
    class Meta:
        model = Perfil
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'imagen_perfil', 'telefono', 'biografia', 'fecha_nacimiento',
            'departamento', 'departamento_nombre', 'carreras', 'carreras_nombres',
            'cursos', 'cursos_nombres', 'nombre_completo', 'fecha_actualizacion',
            'is_active', 'perfil_completo'
        ]
        read_only_fields = ['id', 'username', 'email', 'fecha_actualizacion']
    
    def get_carreras_nombres(self, obj):
        """Devuelve los nombres de las carreras asociadas"""
        try:
            return [carrera.nombre for carrera in obj.carreras.all()]
        except AttributeError:
            return []
    
    def get_cursos_nombres(self, obj):
        """Devuelve los nombres de los cursos asociados"""
        try:
            return [curso.nombre for curso in obj.cursos.all()]
        except AttributeError:
            return []
    
    def update(self, instance, validated_data):
        """Actualiza tanto el perfil como los datos del usuario"""
        user_data = validated_data.pop('user', {})
        
        # Actualizar datos del usuario
        if user_data:
            for attr, value in user_data.items():
                setattr(instance.user, attr, value)
            instance.user.save()
        
        # Actualizar datos del perfil
        return super().update(instance, validated_data)

class PerfilCreateSerializer(serializers.ModelSerializer):
    """
    Serializer para crear perfiles con usuarios nuevos
    """
    username = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    
    class Meta:
        model = Perfil
        fields = [
            'username', 'email', 'password', 'first_name', 'last_name',
            'imagen_perfil', 'telefono', 'biografia', 'fecha_nacimiento',
            'departamento', 'carreras', 'cursos'
        ]
    
    def create(self, validated_data):
        """
        Crear usuario y perfil en una sola operación
        """
        # Extraer datos del usuario
        user_data = {
            'username': validated_data.pop('username'),
            'email': validated_data.pop('email'),
            'password': validated_data.pop('password'),
            'first_name': validated_data.pop('first_name'),
            'last_name': validated_data.pop('last_name'),
        }
        
        # Crear usuario
        user = User.objects.create_user(**user_data)
        
        # Crear perfil
        carreras = validated_data.pop('carreras', [])
        cursos = validated_data.pop('cursos', [])
        
        perfil = Perfil.objects.create(user=user, **validated_data)
        
        # Asignar relaciones many-to-many
        if carreras:
            perfil.carreras.set(carreras)
        if cursos:
            perfil.cursos.set(cursos)
        
        return perfil

class UserCreateSerializer(serializers.ModelSerializer):
    """
    Serializer para crear usuarios usando la estructura del frontend
    """
    nombres = serializers.CharField(write_only=True)
    apellidos = serializers.CharField(write_only=True)  
    correo = serializers.EmailField(write_only=True)
    codigo = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'}, required=False)
    
    class Meta:
        model = User
        fields = [
            'codigo', 'nombres', 'apellidos', 'correo', 'password',
            'is_active', 'is_staff'
        ]
    
    def create(self, validated_data):
        """
        Crear usuario mapeando campos del frontend
        """
        # Mapear campos del frontend a campos de User
        user_data = {
            'username': validated_data.pop('codigo'),
            'first_name': validated_data.pop('nombres'),
            'last_name': validated_data.pop('apellidos'),
            'email': validated_data.pop('correo'),
            'is_active': validated_data.get('is_active', True),
            'is_staff': validated_data.get('is_staff', False),
        }
        
        # Crear usuario
        password = validated_data.pop('password', None)
        if password:
            user = User.objects.create_user(password=password, **user_data)
        else:
            # Si no se proporciona password, crear usuario sin password utilizable
            user = User.objects.create_user(**user_data)
            user.set_unusable_password()
            user.save()
        
        return user
