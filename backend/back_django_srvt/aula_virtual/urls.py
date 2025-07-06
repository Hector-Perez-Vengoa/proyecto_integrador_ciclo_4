from rest_framework.routers import DefaultRouter
from .views import (
    AulaVirtualViewSet, AulaVirtualImagenViewSet, AulaVirtualComponenteViewSet,
    ReservaViewSet, BloqueHorarioViewSet, NotificacionViewSet, 
    CalendarioInstitucionalViewSet, ReglamentoViewSet
)

router = DefaultRouter()
router.register(r'aulas-virtuales', AulaVirtualViewSet)
router.register(r'aula-virtual-imagenes', AulaVirtualImagenViewSet)
router.register(r'aula-virtual-componentes', AulaVirtualComponenteViewSet)
router.register(r'reservas', ReservaViewSet)
router.register(r'bloques-horarios', BloqueHorarioViewSet)
router.register(r'notificaciones', NotificacionViewSet)
router.register(r'calendario-institucional', CalendarioInstitucionalViewSet)
router.register(r'reglamentos', ReglamentoViewSet)

urlpatterns = router.urls
