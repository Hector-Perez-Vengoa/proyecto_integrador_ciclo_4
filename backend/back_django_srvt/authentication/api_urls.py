from django.urls import path
from .api_views import GoogleAuthView, UserDetailView, UserListView, api_root

app_name = 'auth_api'

urlpatterns = [
    # Endpoint principal que describe los recursos
    path('', api_root, name='api_root'),
    
    # Endpoint OAuth para autenticación con Google
    path('google/', GoogleAuthView.as_view(), name='google_auth'),
    
    # Endpoints para gestión de usuarios
    path('me/', UserDetailView.as_view(), name='current_user_detail'),
    path('users/', UserListView.as_view(), name='user_list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user_detail'),
]
