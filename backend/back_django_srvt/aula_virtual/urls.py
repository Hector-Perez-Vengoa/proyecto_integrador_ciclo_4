from rest_framework.routers import DefaultRouter
from .views import ProfesorViewSet, AulaVirtualViewSet, DepartamentoViewSet, CarreraViewSet, CursoViewSet, ReservaViewSet

router = DefaultRouter()
router.register(r'profesores', ProfesorViewSet)
router.register(r'aula-virtual', AulaVirtualViewSet)
router.register(r'departamentos', DepartamentoViewSet)
router.register(r'carreras', CarreraViewSet)
router.register(r'cursos', CursoViewSet)
router.register(r'reservas', ReservaViewSet)

urlpatterns = router.urls
