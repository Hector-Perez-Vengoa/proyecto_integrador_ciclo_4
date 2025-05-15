from rest_framework.routers import DefaultRouter
from cubiculos.views import CubiculoViewSet
from profesor.views import ProfesorViewSet, DepartamentoViewSet, CursoViewSet, CarreraViewSet

api_router = DefaultRouter()

api_router.register(r'cubiculos', CubiculoViewSet, basename='cubiculo')
api_router.register(r'profesores', ProfesorViewSet, basename='profesor')
api_router.register(r'departamentos', DepartamentoViewSet, basename='departamento')
api_router.register(r'cursos', CursoViewSet, basename='curso')
api_router.register(r'carreras', CarreraViewSet, basename='carrera')

