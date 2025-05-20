from rest_framework import serializers
from .models import ProfesorDB, AulaVirtualDB, DepartamentoDB, CarreraDB, CursoDB

class ProfesorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfesorDB
        fields = '__all__'

class AulaVirtualSerializer(serializers.ModelSerializer):
    class Meta:
        model = AulaVirtualDB
        fields = '__all__'

class DepartamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DepartamentoDB
        fields = '__all__'

class CarreraSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarreraDB
        fields = '__all__'

class CursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CursoDB
        fields = '__all__'
