from rest_framework import viewsets
from .models import CubiculoDB
from .serializers import CubiculoSerializer 

# Create your views here.
class CubiculoViewSet(viewsets.ModelViewSet):
    queryset = CubiculoDB.objects.all()
    serializer_class = CubiculoSerializer
    http_method_names = ['get', 'post', 'put', 'delete']
