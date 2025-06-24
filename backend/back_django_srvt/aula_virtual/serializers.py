from rest_framework import serializers
from .models import ProfesorDB, AulaVirtualDB, DepartamentoDB, CarreraDB, CursoDB, ReservaDB

class ProfesorSerializer(serializers.ModelSerializer):
    nombre_completo = serializers.SerializerMethodField()
    class Meta:
        model = ProfesorDB
        fields = '__all__'
    def get_nombre_completo(self, obj):
        return f"{obj.nombres} {obj.apellidos}".strip()

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

class ReservaSerializer(serializers.ModelSerializer):
    profesor_nombre = serializers.SerializerMethodField()
    aula_virtual_codigo = serializers.SerializerMethodField()
    curso_nombre = serializers.SerializerMethodField()
    class Meta:
        model = ReservaDB
        fields = '__all__'
        extra_fields = ['profesor_nombre', 'aula_virtual_codigo', 'curso_nombre']
    def get_profesor_nombre(self, obj):
        if obj.profesor:
            return f"{obj.profesor.nombres} {obj.profesor.apellidos}".strip()
        return None
    def get_aula_virtual_codigo(self, obj):
        if obj.aula_virtual:
            return obj.aula_virtual.codigo
        return None
    def get_curso_nombre(self, obj):
        if obj.curso:
            return obj.curso.nombre
        return None
