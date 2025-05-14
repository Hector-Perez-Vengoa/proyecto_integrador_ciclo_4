from rest_framework.routers import DefaultRouter
from .views import CubiculoViewSet
from profesor.views import ProfesorViewSet, DepartamentoViewSet, CursoViewSet, CarreraViewSet

# Crear el router
router = DefaultRouter()

# Registrar los viewsets con el router
router.register(r'cubiculos', CubiculoViewSet, basename='cubiculo')
router.register(r'profesores', ProfesorViewSet, basename='profesor')
router.register(r'departamentos', DepartamentoViewSet, basename='departamento')
router.register(r'cursos', CursoViewSet, basename='curso')
router.register(r'carreras', CarreraViewSet, basename='carrera')  # 👈 si estás usando CarreraViewSet

# Usar las rutas generadas por el router como urlpatterns
urlpatterns = router.urls
