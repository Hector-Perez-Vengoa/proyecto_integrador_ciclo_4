from django.urls import path
from .api_views import GoogleAuthView, UserDetailView, UserListView, api_root, LoginView, RegisterView, ChangePasswordView

app_name = 'auth_api'

urlpatterns = [
    # Endpoint principal que describe los recursos
    path('', api_root, name='api_root'),
    
    # Endpoints para autenticación
    path('google/', GoogleAuthView.as_view(), name='google_auth'),
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
      # Endpoints para gestión de usuarios
    path('me/', UserDetailView.as_view(), name='current_user_detail'),
    path('users/', UserListView.as_view(), name='user_list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user_detail'),
    path('password/', ChangePasswordView.as_view(), name='change_password'),
]
