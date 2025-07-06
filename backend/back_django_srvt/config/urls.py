from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from .views import api_root

urlpatterns = [
    # Raíz que muestra todas las APIs disponibles
    path('', api_root, name='api_root'),
    
    # Rutas administrativas 
    path('admin/', admin.site.urls),
    
    # Rutas de autenticación
    path("api/auth/", include("authentication.urls")),
    
    # Rutas de la API de aula_virtual
    path("api/", include("aula_virtual.urls")),
]


