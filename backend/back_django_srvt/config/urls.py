from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from authentication.views import UserViewSet, DepartamentoViewSet, CarreraViewSet, CursoViewSet

from .views import api_root

# Router para endpoints de compatibilidad en la raíz
compatibility_router = DefaultRouter()
compatibility_router.register(r'usuarios', UserViewSet, basename='usuarios-root')  # Solo usuarios
compatibility_router.register(r'departamentos', DepartamentoViewSet, basename='departamentos-root')
compatibility_router.register(r'carreras', CarreraViewSet, basename='carreras-root')
compatibility_router.register(r'cursos', CursoViewSet, basename='cursos-root')

urlpatterns = [
    # Raíz que muestra todas las APIs disponibles
    path('', api_root, name='api_root'),
    
    # Rutas administrativas 
    path('admin/', admin.site.urls),
    
    # Rutas de autenticación
    path("api/auth/", include("authentication.urls")),
    
    # Rutas de la API de aula_virtual
    path("api/", include("aula_virtual.urls")),
    
    # Rutas de compatibilidad (profesores -> perfiles)
    path("api/", include(compatibility_router.urls)),
]


