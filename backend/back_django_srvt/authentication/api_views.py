from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.decorators import api_view
from google.oauth2 import id_token
from google.auth.transport import requests
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer
from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView

User = get_user_model()

class GoogleAuthView(APIView):
    """
    API para autenticación con Google OAuth.
    
    POST: Recibe un token de Google y devuelve un token JWT para la aplicación
    """
    def post(self, request):
        """
        Procesa la autenticación mediante token de Google
        """
        token = request.data.get('token')
        
        if not token:
            return Response({'error': 'Token no proporcionado'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Verificar el token con Google
            CLIENT_ID = "168128064756-k2uh7h3iggn34g05nop29vn0n5t5of8p.apps.googleusercontent.com"
            idinfo = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)
            
            # Verificar el dominio del correo
            email = idinfo['email']
            if not email.endswith('@tecsup.edu.pe'):
                return Response(
                    {'error': 'Solo se permiten correos con dominio @tecsup.edu.pe'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Buscar o crear el usuario
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email.split('@')[0],  # Usar la parte antes del @ como username
                    'first_name': idinfo.get('given_name', ''),
                    'last_name': idinfo.get('family_name', ''),
                    'is_active': True,
                }
            )
            
            # Si el usuario ya existía, actualizar información
            if not created:
                user.first_name = idinfo.get('given_name', user.first_name)
                user.last_name = idinfo.get('family_name', user.last_name)
                user.save()
            
            # Generar tokens JWT
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'token': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'name': f'{user.first_name} {user.last_name}'
                }
            })
            
        except ValueError:
            return Response({'error': 'Token inválido'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserDetailView(RetrieveUpdateDestroyAPIView):
    """
    API para gestionar un usuario específico.
    
    GET: Obtener detalles del usuario
    PUT/PATCH: Actualizar datos del usuario
    DELETE: Desactivar usuario
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        # Si no se proporciona un ID, devuelve el usuario autenticado
        pk = self.kwargs.get('pk', None)
        if pk is None:
            return self.request.user
        return super().get_object()
    
    def delete(self, request, *args, **kwargs):
        user = self.get_object()
        # En lugar de eliminar, desactivamos el usuario
        user.is_active = False
        user.save()
        return Response({"message": f"Usuario {user.username} desactivado"}, 
                       status=status.HTTP_200_OK)

class UserListView(ListAPIView):
    """
    API para listar usuarios.
    
    GET: Obtener lista de usuarios (solo administradores)
    """
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]  # Solo administradores
    
    def get_queryset(self):
        """Personaliza la consulta según parámetros"""
        queryset = super().get_queryset()
        
        # Filtrado opcional por parámetros
        username = self.request.query_params.get('username', None)
        if username:
            queryset = queryset.filter(username__icontains=username)
            
        email = self.request.query_params.get('email', None)
        if email:
            queryset = queryset.filter(email__icontains=email)
            
        return queryset

@api_view(['GET'])
def api_root(request):
    """
    Raíz de la API que muestra los endpoints disponibles para autenticación
    """
    return Response({
        'google': request.build_absolute_uri('/api/auth/google/'),
        'me': request.build_absolute_uri('/api/auth/me/'),
        'users': request.build_absolute_uri('/api/auth/users/'),
        'user_by_id': request.build_absolute_uri('/api/auth/users/{id}/'),
        'message': 'API de autenticación del Sistema de Reservas de Tecsup'
    })
      
