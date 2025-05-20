from django.contrib import admin
from django.urls import path, include
from rest_framework.documentation import include_docs_urls

from .views import api_root

urlpatterns = [
    # Raíz que muestra todas las APIs disponibles
    path('', api_root, name='api_root'),
    
    # Rutas administrativas y de autenticación
    path('admin/', admin.site.urls),
    path("accounts/", include("allauth.urls")),
    
    # Rutas de frontend
    path("login/", include("authentication.urls")),
    
    # Rutas de autenticación API
    path("api/auth/", include("authentication.api_urls")),
    
    # API router - Corregido para usar include() con los urls del router
 
    
    # Comentado temporalmente para solucionar problema de coreapi
    # path("api/docs/", include_docs_urls(title="API de Reservas Tecsup")),
]


