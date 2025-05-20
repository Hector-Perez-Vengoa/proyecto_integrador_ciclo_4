from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.decorators import api_view
from google.oauth2 import id_token
from google.auth.transport import requests
from django.contrib.auth import get_user_model, authenticate
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
        temp_password = request.data.get('temp_password')
        
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
            
            # Verificar si el usuario ya existe
            try:
                user = User.objects.get(email=email)
                # Usuario existente - actualizar datos
                user.first_name = idinfo.get('given_name', user.first_name)
                user.last_name = idinfo.get('family_name', user.last_name)
                user.save()
                created = False
            except User.DoesNotExist:
                # Si es un usuario nuevo y no se proporcionó contraseña temporal
                if not temp_password:
                    return Response({
                        'need_password': True,
                        'email': email,
                        'name': f"{idinfo.get('given_name', '')} {idinfo.get('family_name', '')}".strip(),
                        'message': 'Necesitas crear una contraseña para este sistema'
                    }, status=status.HTTP_200_OK)
                
                # Crear nuevo usuario con la contraseña proporcionada
                user = User.objects.create_user(
                    username=email.split('@')[0],  # Usar la parte antes del @ como username
                    email=email,
                    password=temp_password,  # Usar la contraseña proporcionada
                    first_name=idinfo.get('given_name', ''),
                    last_name=idinfo.get('family_name', ''),
                    is_active=True,
                )
                created = True
            
            # Generar tokens JWT
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'token': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'name': f'{user.first_name} {user.last_name}',
                    'is_new_user': created
                }
            })
            
        except ValueError:
            return Response({'error': 'Token inválido'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LoginView(APIView):
    """
    API para iniciar sesión con correo y contraseña.
    
    POST: Recibe credenciales y devuelve un token JWT
    """
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response(
                {'error': 'Correo y contraseña son requeridos'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Verificar que sea un correo de Tecsup
        if not email.endswith('@tecsup.edu.pe'):
            return Response(
                {'error': 'Solo se permiten correos con dominio @tecsup.edu.pe'}, 
                status=status.HTTP_403_FORBIDDEN
            )
            
        # Intentar autenticar (Django normaliza el email a minúsculas)
        user = authenticate(username=email, password=password)
        
        if not user:
            # Intentar autenticar usando el email directamente
            try:
                user_obj = User.objects.get(email=email)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                user = None
                
        if not user:
            return Response(
                {'error': 'Credenciales inválidas'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if not user.is_active:
            return Response(
                {'error': 'Esta cuenta ha sido desactivada'}, 
                status=status.HTTP_403_FORBIDDEN
            )
            
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

class RegisterView(APIView):
    """
    API para registrar nuevos usuarios.
    
    POST: Crea un nuevo usuario con correo y contraseña
    """
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        name = request.data.get('name', '')
        
        if not email or not password:
            return Response(
                {'error': 'Correo y contraseña son requeridos'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Verificar que sea un correo de Tecsup
        if not email.endswith('@tecsup.edu.pe'):
            return Response(
                {'error': 'Solo se permiten correos con dominio @tecsup.edu.pe'}, 
                status=status.HTTP_403_FORBIDDEN
            )
            
        # Verificar si el usuario ya existe
        if User.objects.filter(email=email).exists():
            return Response(
                {'error': 'Ya existe un usuario con este correo'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            # Crear nuevo usuario
            names = name.split(' ', 1)
            first_name = names[0]
            last_name = names[1] if len(names) > 1 else ''
            
            user = User.objects.create_user(
                username=email.split('@')[0],  # Usar la parte antes del @ como username
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
                is_active=True
            )
            
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
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

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

class ChangePasswordView(APIView):
    """
    API para cambiar la contraseña de un usuario.
    
    PUT: Actualiza la contraseña del usuario autenticado
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def put(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        
        # Verificar que la nueva contraseña esté presente
        if not new_password:
            return Response(
                {'error': 'La nueva contraseña es requerida'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Verificar si es un usuario de Google sin contraseña configurada
        # (Este caso es para usuarios que se registraron con Google y ahora están configurando su contraseña)
        need_old_password = True
        
        # Si el usuario está marcado como que no tiene contraseña o proporciona un token especial,
        # no requerimos la contraseña anterior
        if hasattr(user, 'has_usable_password') and not user.has_usable_password():
            need_old_password = False
        
        # Si necesitamos verificar la contraseña antigua
        if need_old_password:
            if not old_password:
                return Response(
                    {'error': 'La contraseña actual es requerida'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            # Verificar que la contraseña actual sea correcta
            if not user.check_password(old_password):
                return Response(
                    {'error': 'La contraseña actual es incorrecta'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
        # Verificar que la nueva contraseña cumple con los requisitos
        if len(new_password) < 6:
            return Response(
                {'error': 'La nueva contraseña debe tener al menos 6 caracteres'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Actualizar la contraseña
        user.set_password(new_password)
        user.save()
        
        # Generar nuevos tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Contraseña actualizada correctamente',
            'token': str(refresh.access_token),
            'refresh': str(refresh),
        })

@api_view(['GET'])
def api_root(request):
    """
    Raíz de la API que muestra los endpoints disponibles para autenticación
    """
    return Response({
        'google': request.build_absolute_uri('/api/auth/google/'),
        'login': request.build_absolute_uri('/api/auth/login/'),
        'register': request.build_absolute_uri('/api/auth/register/'),
        'password': request.build_absolute_uri('/api/auth/password/'),
        'me': request.build_absolute_uri('/api/auth/me/'),
        'users': request.build_absolute_uri('/api/auth/users/'),
        'user_by_id': request.build_absolute_uri('/api/auth/users/{id}/'),
        'message': 'API de autenticación del Sistema de Reservas de Tecsup'
    })

