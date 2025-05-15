from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class GoogleAuthView(APIView):
    def post(self, request):
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
      
