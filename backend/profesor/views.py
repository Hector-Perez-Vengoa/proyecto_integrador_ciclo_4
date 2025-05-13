from rest_framework import viewsets
from .models import DepartamentoDB , CursoDB, CarreraDB, ProfesorDB
from .serializers import DepartamentoSerializer , CursoSerializer, CarreraSerializer, ProfesorSerializer

# Create your views here.
class DepartamentoViewSet(viewsets.ModelViewSet):
    queryset = DepartamentoDB.objects.all()
    serializer_class = DepartamentoSerializer
    http_method_names = ['get', 'post', 'put', 'delete']

class CursoViewSet(viewsets.ModelViewSet):
    queryset = CursoDB.objects.all()
    serializer_class = CursoSerializer
    http_method_names = ['get', 'post', 'put', 'delete']

class CarreraViewSet(viewsets.ModelViewSet):
    queryset = CarreraDB.objects.all()
    serializer_class = CarreraSerializer
    http_method_names = ['get', 'post', 'put', 'delete']

class ProfesorViewSet(viewsets.ModelViewSet):
    queryset = ProfesorDB.objects.all()
    serializer_class = ProfesorSerializer
    http_method_names = ['get', 'post', 'put', 'delete']