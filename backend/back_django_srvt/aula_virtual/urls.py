from rest_framework.routers import DefaultRouter
from .views import ProfesorViewSet, CubiculoViewSet, DepartamentoViewSet, CarreraViewSet, CursoViewSet

router = DefaultRouter()
router.register(r'profesores', ProfesorViewSet)
router.register(r'cubiculos', CubiculoViewSet)
router.register(r'departamentos', DepartamentoViewSet)
router.register(r'carreras', CarreraViewSet)
router.register(r'cursos', CursoViewSet)

urlpatterns = router.urls
