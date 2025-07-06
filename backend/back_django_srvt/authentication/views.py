from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.middleware.csrf import get_token
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse
import json


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
