from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.middleware.csrf import get_token
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse
import json
from rest_framework import viewsets, permissions
from .models import Departamento, Carrera, Curso, Perfil, UsuarioCustom, Rol
from .serializers import (
    DepartamentoSerializer, CarreraSerializer, CursoSerializer, 
    PerfilSerializer, PerfilCreateSerializer, UsuarioCustomSerializer, RolSerializer,
    UserSerializer, UserCreateSerializer
)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Endpoint para login de administradores
    """
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({
            'error': 'Username y password son requeridos'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(request, username=username, password=password)
    
    if user is not None and user.is_staff:  # Solo usuarios staff (admin)
        login(request, user)
        
        # Crear respuesta con datos del usuario
        response_data = {
            'success': True,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
                'first_name': user.first_name,
                'last_name': user.last_name
            },
            'csrf_token': get_token(request)
        }
        
        response = Response(response_data, status=status.HTTP_200_OK)
        
        # Configurar cookies explícitamente
        response.set_cookie(
            'sessionid',
            request.session.session_key,
            max_age=86400,
            httponly=False,
            samesite='Lax',
            secure=False
        )
        
        return response
    else:
        return Response({
            'error': 'Credenciales inválidas o usuario sin permisos de administrador'
        }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    Endpoint para logout
    """
    logout(request)
    return Response({
        'success': True,
        'message': 'Sesión cerrada exitosamente'
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def check_auth(request):
    """
    Endpoint para verificar si el usuario está autenticado
    """
    print(f"Check auth - User: {request.user}")
    print(f"Check auth - Is authenticated: {request.user.is_authenticated}")
    print(f"Check auth - Session key: {request.session.session_key}")
    print(f"Check auth - Cookies: {request.COOKIES}")
    
    if request.user.is_authenticated and request.user.is_staff:
        return Response({
            'authenticated': True,
            'user': {
                'id': request.user.id,
                'username': request.user.username,
                'email': request.user.email,
                'is_staff': request.user.is_staff,
                'is_superuser': request.user.is_superuser,
                'first_name': request.user.first_name,
                'last_name': request.user.last_name
            }
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            'authenticated': False,
            'error': 'Usuario no autenticado o sin permisos de administrador'
        }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
@permission_classes([AllowAny])
def csrf_token_view(request):
    """
    Endpoint para obtener el token CSRF
    """
    return Response({
        'csrf_token': get_token(request)
    }, status=status.HTTP_200_OK)


# Agregando ViewSets para los modelos de authentication

class DepartamentoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar departamentos
    """
    queryset = Departamento.objects.all()
    serializer_class = DepartamentoSerializer
    permission_classes = [permissions.IsAuthenticated]

class CarreraViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar carreras
    """
    queryset = Carrera.objects.all()
    serializer_class = CarreraSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Filtrar carreras por departamento si se especifica
        """
        queryset = Carrera.objects.all()
        departamento_id = self.request.query_params.get('departamento_id')
        
        if departamento_id:
            queryset = queryset.filter(departamento_id=departamento_id)
            
        return queryset

class CursoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar cursos
    """
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Filtrar cursos por carrera si se especifica
        """
        queryset = Curso.objects.all()
        carrera_id = self.request.query_params.get('carrera_id')
        
        if carrera_id:
            queryset = queryset.filter(carrera_id=carrera_id)
            
        return queryset

class PerfilViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar perfiles de usuario (anteriormente profesores)
    """
    queryset = Perfil.objects.all()
    serializer_class = PerfilSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Filtrar perfiles según el tipo de usuario y parámetros de consulta
        """
        queryset = Perfil.objects.select_related('user', 'departamento').prefetch_related('carreras', 'cursos')
        
        # Los usuarios normales solo ven su propio perfil, los admins ven todos
        if not self.request.user.is_staff:
            queryset = queryset.filter(user=self.request.user)
        
        # Filtros opcionales
        departamento_id = self.request.query_params.get('departamento_id')
        carrera_id = self.request.query_params.get('carrera_id')
        activo = self.request.query_params.get('activo')
        
        if departamento_id:
            queryset = queryset.filter(departamento_id=departamento_id)
        
        if carrera_id:
            queryset = queryset.filter(carreras__id=carrera_id)
            
        if activo is not None:
            queryset = queryset.filter(user__is_active=activo.lower() == 'true')
        
        return queryset.distinct()
    
    def perform_create(self, serializer):
        """
        Crear perfil asegurando que se asocie al usuario correcto
        """
        # Si no es admin, solo puede crear su propio perfil
        if not self.request.user.is_staff:
            serializer.save(user=self.request.user)
        else:
            serializer.save()
    
    def get_serializer_class(self):
        """
        Usar diferente serializer para creación
        """
        if self.action == 'create':
            return PerfilCreateSerializer
        return PerfilSerializer
    
    def get_serializer_context(self):
        """
        Agregar contexto adicional al serializer
        """
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class RolViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar roles (solo administradores)
    """
    queryset = Rol.objects.all()
    serializer_class = RolSerializer
    permission_classes = [permissions.IsAdminUser]

class UsuarioCustomViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar usuarios personalizados
    """
    queryset = UsuarioCustom.objects.all()
    serializer_class = UsuarioCustomSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Los usuarios normales solo ven su propio usuario custom
        """
        if self.request.user.is_staff:
            return UsuarioCustom.objects.all()
        else:
            return UsuarioCustom.objects.filter(user=self.request.user)

class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar usuarios directamente desde auth_user
    Esto reemplaza a los profesores utilizando la tabla de usuarios nativos de Django
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]  # Temporalmente permitir acceso sin autenticación
    
    def get_queryset(self):
        """
        Filtrar usuarios y aplicar filtros de consulta
        """
        queryset = User.objects.select_related('usuario_custom')
        
        # Para pruebas, mostrar todos los usuarios
        # En producción, los usuarios normales solo ven su propio usuario, los admins ven todos
        # if not self.request.user.is_staff:
        #     queryset = queryset.filter(id=self.request.user.id)
        
        # Filtros opcionales
        activo = self.request.query_params.get('activo')
        is_staff = self.request.query_params.get('is_staff')
        tipo_usuario = self.request.query_params.get('tipo_usuario')  # 'profesores', 'estudiantes', 'admin'
        
        if activo is not None:
            queryset = queryset.filter(is_active=activo.lower() == 'true')
            
        if is_staff is not None:
            queryset = queryset.filter(is_staff=is_staff.lower() == 'true')
            
        # Filtro por tipo de usuario
        if tipo_usuario == 'profesores':
            # Solo usuarios que son staff (consideramos profesores como staff)
            queryset = queryset.filter(is_staff=True)
        elif tipo_usuario == 'estudiantes':
            # Solo usuarios que NO son staff
            queryset = queryset.filter(is_staff=False)
        elif tipo_usuario == 'admin':
            # Solo usuarios superuser
            queryset = queryset.filter(is_superuser=True)
            
        return queryset.distinct()
    
    def perform_create(self, serializer):
        """
        Personalizar la creación de usuarios
        """
        # Solo admins pueden crear usuarios
        if not self.request.user.is_staff:
            raise PermissionDenied("No tienes permisos para crear usuarios")
        
        serializer.save()
    
    def perform_update(self, serializer):
        """
        Personalizar la actualización de usuarios
        """
        # Los usuarios pueden actualizar su propio perfil, los admins pueden actualizar cualquiera
        if not self.request.user.is_staff and serializer.instance != self.request.user:
            raise PermissionDenied("No tienes permisos para actualizar este usuario")
        
        serializer.save()
    
    def destroy(self, request, *args, **kwargs):
        """
        Personalizar la eliminación de usuarios para devolver una respuesta JSON consistente
        """
        instance = self.get_object()
        
        # Solo admins pueden eliminar usuarios
        if not request.user.is_staff:
            raise PermissionDenied("No tienes permisos para eliminar usuarios")
        
        # No permitir eliminar superusuarios
        if instance.is_superuser:
            return Response({
                'error': 'No se puede eliminar un superusuario'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # No permitir que los usuarios se eliminen a sí mismos
        if instance == request.user:
            return Response({
                'error': 'No puedes eliminarte a ti mismo'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Realizar la eliminación
        instance.delete()
        
        return Response({
            'success': True,
            'message': f'Usuario {instance.username} eliminado exitosamente'
        }, status=status.HTTP_200_OK)
    
    def get_serializer_class(self):
        """
        Usar diferente serializer para creación
        """
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer
