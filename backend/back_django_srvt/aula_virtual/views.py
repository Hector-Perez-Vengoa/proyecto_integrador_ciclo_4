from rest_framework import viewsets
from .models import ProfesorDB, AulaVirtualDB, DepartamentoDB, CarreraDB, CursoDB
from .serializers import (
    ProfesorSerializer, AulaVirtualSerializer, DepartamentoSerializer, CarreraSerializer, CursoSerializer
)

class ProfesorViewSet(viewsets.ModelViewSet):
    queryset = ProfesorDB.objects.all()
    serializer_class = ProfesorSerializer

class AulaVirtualViewSet(viewsets.ModelViewSet):
    queryset = AulaVirtualDB.objects.all()
    serializer_class = AulaVirtualSerializer

class DepartamentoViewSet(viewsets.ModelViewSet):
    queryset = DepartamentoDB.objects.all()
    serializer_class = DepartamentoSerializer

class CarreraViewSet(viewsets.ModelViewSet):
    queryset = CarreraDB.objects.all()
    serializer_class = CarreraSerializer

class CursoViewSet(viewsets.ModelViewSet):
    queryset = CursoDB.objects.all()
    serializer_class = CursoSerializer
