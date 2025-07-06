from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def api_root(request, format=None):
    """
    Vista raíz que muestra todos los endpoints disponibles
    """
    base_url = request.build_absolute_uri('/').rstrip('/')
    
    return Response({
        # API de autenticación
        "Auth - Login": f"{base_url}/api/auth/login/",
        "Auth - Logout": f"{base_url}/api/auth/logout/",
        "Auth - Check": f"{base_url}/api/auth/check/",
        "Auth - CSRF": f"{base_url}/api/auth/csrf/",
        
        # API de gestión de usuarios y perfiles (rutas principales)
        "Departamentos": f"{base_url}/api/departamentos/",
        "Carreras": f"{base_url}/api/carreras/",
        "Cursos": f"{base_url}/api/cursos/",
        "Profesores": f"{base_url}/api/profesores/",
        
        # API de gestión detallada (rutas auth)
        "Perfiles (detallado)": f"{base_url}/api/auth/api/perfiles/",
        "Roles": f"{base_url}/api/auth/api/roles/",
        "Usuarios Custom": f"{base_url}/api/auth/api/usuarios-custom/",
        
        # API de aula virtual
        "Aulas Virtuales": f"{base_url}/api/aulas-virtuales/",
        "Reservas": f"{base_url}/api/reservas/",
        "Bloques Horarios": f"{base_url}/api/bloques-horarios/",
        "Notificaciones": f"{base_url}/api/notificaciones/",
        "Calendario": f"{base_url}/api/calendario-institucional/",
        "Reglamentos": f"{base_url}/api/reglamentos/",
        
        # Django Admin
        "Admin": f"{base_url}/admin/",
        "message": "Sistema de Aulas Virtuales - Tecsup (Backend Django para gestión de recursos)"
    })
