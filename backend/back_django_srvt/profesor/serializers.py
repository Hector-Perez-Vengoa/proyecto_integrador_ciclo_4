from rest_framework import serializers
from .models import ProfesorDB, CursoDB, CarreraDB, DepartamentoDB


class ProfesorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfesorDB
        fields = '__all__'
        read_only_fields = ['id', 'fecha_creacion']


class CursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CursoDB
        fields = '__all__'
        read_only_fields = ['id', 'fecha_creacion']

class CarreraSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarreraDB
        fields = '__all__'
        read_only_fields = ['id', 'fecha_creacion']


class DepartamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DepartamentoDB
        fields = '__all__'
        read_only_fields = ['id', 'fecha_creacion']


