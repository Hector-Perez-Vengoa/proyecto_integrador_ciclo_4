from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Router para las APIs REST
router = DefaultRouter()
router.register(r'departamentos', views.DepartamentoViewSet)
router.register(r'carreras', views.CarreraViewSet)
router.register(r'cursos', views.CursoViewSet)
router.register(r'perfiles', views.PerfilViewSet)
router.register(r'usuarios', views.UserViewSet)  # Endpoint principal para usuarios
router.register(r'roles', views.RolViewSet)
router.register(r'usuarios-custom', views.UsuarioCustomViewSet)

urlpatterns = [
    # URLs de autenticación tradicional
    path('login/', views.login_view, name='auth_login'),
    path('logout/', views.logout_view, name='auth_logout'),
    path('check/', views.check_auth, name='auth_check'),
    path('csrf/', views.csrf_token_view, name='csrf_token'),
    
    # URLs de la API REST
    path('api/', include(router.urls)),
]
