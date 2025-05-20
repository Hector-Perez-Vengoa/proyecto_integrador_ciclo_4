from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

@api_view(['GET'])
def api_root(request, format=None):
    """
    Vista raíz que muestra todos los endpoints disponibles
    """
    base_url = request.build_absolute_uri('/').rstrip('/')
    
    return Response({
        # API de recursos
        "Aula Virtual": f"{base_url}/api/aula-virtual/",
        "profesores": f"{base_url}/api/profesores/",
        "departamentos": f"{base_url}/api/departamentos/",
        "cursos": f"{base_url}/api/cursos/",
        "carreras": f"{base_url}/api/carreras/",
        
        # API de autenticación
        "auth": f"{base_url}/api/auth/",
        "auth/google": f"{base_url}/api/auth/google/",
        "auth/users": f"{base_url}/api/auth/users/",
        "auth/user": f"{base_url}/api/auth/me/"
    })
