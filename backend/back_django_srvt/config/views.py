from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def api_root(request, format=None):
    """
    Vista raíz que muestra todos los endpoints disponibles
    """
    base_url = request.build_absolute_uri('/').rstrip('/')
    
    return Response({
        # API de recursos principales (aula_virtual)
        "Departamentos": f"{base_url}/api/departamentos/",
        "Carreras": f"{base_url}/api/carreras/",
        "Cursos": f"{base_url}/api/cursos/",
        "Profesores": f"{base_url}/api/profesores/",
        "Aula Virtual": f"{base_url}/api/aula-virtual/",
        "Reservas": f"{base_url}/api/reservas/",
        
        # Django Admin
        "admin": f"{base_url}/admin/",
        "message": "Sistema de Aulas Virtuales - Tecsup (Backend Django para gestión de recursos)"
    })
