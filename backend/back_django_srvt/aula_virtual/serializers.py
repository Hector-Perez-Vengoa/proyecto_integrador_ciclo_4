from rest_framework import serializers
from django.contrib.auth.models import User
from authentication.models import Departamento, Carrera, Curso
from .models import (
    AulaVirtual, AulaVirtualImagen, AulaVirtualComponente, 
    Reserva, BloqueHorario, Notificacion, CalendarioInstitucional, Reglamento
)

# Constantes para evitar duplicación de literales
AULA_VIRTUAL_CODIGO_SOURCE = 'aula_virtual.codigo'
CURSO_NOMBRE_SOURCE = 'curso.nombre'
USER_EMAIL_SOURCE = 'user.email'

class AulaVirtualImagenSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo AulaVirtualImagen
    """
    class Meta:
        model = AulaVirtualImagen
        fields = [
            'id', 'url_imagen', 'nombre_archivo', 'descripcion', 
            'es_principal', 'orden_visualizacion', 'fecha_creacion', 'activo'
        ]
        read_only_fields = ['id', 'fecha_creacion']

class AulaVirtualComponenteSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo AulaVirtualComponente
    """
    class Meta:
        model = AulaVirtualComponente
        fields = ['id', 'nombre', 'descripcion']
        read_only_fields = ['id']

class AulaVirtualSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo AulaVirtual
    """
    imagenes = AulaVirtualImagenSerializer(many=True, read_only=True)
    componentes = AulaVirtualComponenteSerializer(many=True, read_only=True)
    total_reservas = serializers.SerializerMethodField()
    imagen_principal = serializers.SerializerMethodField()
    
    class Meta:
        model = AulaVirtual
        fields = [
            'id', 'codigo', 'estado', 'descripcion', 'fecha_creacion',
            'imagenes', 'componentes', 'total_reservas', 'imagen_principal'
        ]
        read_only_fields = ['id', 'fecha_creacion']
    
    def get_total_reservas(self, obj):
        """Devuelve el total de reservas del aula"""
        return obj.reservas.count()
    
    def get_imagen_principal(self, obj):
        """Devuelve la imagen principal del aula"""
        imagen_principal = obj.imagenes.filter(es_principal=True, activo=True).first()
        if imagen_principal:
            return AulaVirtualImagenSerializer(imagen_principal).data
        return None

class ReservaSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Reserva
    """
    user_nombre = serializers.SerializerMethodField()
    user_email = serializers.CharField(source=USER_EMAIL_SOURCE, read_only=True)
    aula_virtual_codigo = serializers.CharField(source=AULA_VIRTUAL_CODIGO_SOURCE, read_only=True)
    curso_nombre = serializers.CharField(source=CURSO_NOMBRE_SOURCE, read_only=True)
    duracion_horas = serializers.ReadOnlyField()
    puede_cancelar = serializers.ReadOnlyField()
    
    class Meta:
        model = Reserva
        fields = [
            'id', 'user', 'user_nombre', 'user_email', 'aula_virtual', 'aula_virtual_codigo',
            'curso', 'curso_nombre', 'hora_inicio', 'hora_fin', 'fecha_reserva',
            'motivo', 'estado', 'fecha_creacion', 'duracion_horas', 'puede_cancelar',
            'fecha_cancelacion', 'motivo_cancelacion', 'cancelado_por', 'observaciones_cancelacion'
        ]
        read_only_fields = [
            'id', 'fecha_creacion', 'duracion_horas', 'puede_cancelar',
            'fecha_cancelacion', 'motivo_cancelacion', 'cancelado_por', 'observaciones_cancelacion'
        ]
    
    def get_user_nombre(self, obj):
        """Devuelve el nombre completo del usuario"""
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username

class BloqueHorarioSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo BloqueHorario
    """
    aula_virtual_codigo = serializers.CharField(source=AULA_VIRTUAL_CODIGO_SOURCE, read_only=True)
    
    class Meta:
        model = BloqueHorario
        fields = [
            'id', 'aula_virtual', 'aula_virtual_codigo', 'fecha', 
            'hora_inicio', 'hora_fin', 'tipo', 'motivo', 'fecha_creacion'
        ]
        read_only_fields = ['id', 'fecha_creacion']

class NotificacionSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Notificacion
    """
    user_nombre = serializers.SerializerMethodField()
    reserva_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Notificacion
        fields = [
            'id', 'user', 'user_nombre', 'tipo', 'titulo', 'mensaje',
            'reserva', 'reserva_info', 'leida', 'fecha_creacion', 'fecha_lectura'
        ]
        read_only_fields = ['id', 'fecha_creacion', 'fecha_lectura']
    
    def get_user_nombre(self, obj):
        """Devuelve el nombre completo del usuario"""
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username
    
    def get_reserva_info(self, obj):
        """Devuelve información básica de la reserva asociada"""
        if obj.reserva:
            return {
                'id': obj.reserva.id,
                'aula_codigo': obj.reserva.aula_virtual.codigo,
                'fecha': obj.reserva.fecha_reserva,
                'hora_inicio': obj.reserva.hora_inicio,
                'hora_fin': obj.reserva.hora_fin
            }
        return None

class CalendarioInstitucionalSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo CalendarioInstitucional
    """
    aulas_afectadas_codigos = serializers.SerializerMethodField()
    creado_por_nombre = serializers.SerializerMethodField()
    
    class Meta:
        model = CalendarioInstitucional
        fields = [
            'id', 'titulo', 'descripcion', 'tipo_evento', 'fecha_inicio', 'fecha_fin',
            'afecta_reservas', 'aulas_afectadas', 'aulas_afectadas_codigos',
            'fecha_creacion', 'creado_por', 'creado_por_nombre'
        ]
        read_only_fields = ['id', 'fecha_creacion']
    
    def get_aulas_afectadas_codigos(self, obj):
        """Devuelve los códigos de las aulas afectadas"""
        return [aula.codigo for aula in obj.aulas_afectadas.all()]
    
    def get_creado_por_nombre(self, obj):
        """Devuelve el nombre del usuario que creó el evento"""
        if obj.creado_por:
            return f"{obj.creado_por.first_name} {obj.creado_por.last_name}".strip() or obj.creado_por.username
        return None

class ReglamentoSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Reglamento
    """
    esta_activo = serializers.ReadOnlyField()
    tamano_legible = serializers.ReadOnlyField()
    nombre_archivo = serializers.ReadOnlyField()
    
    class Meta:
        model = Reglamento
        fields = [
            'id', 'titulo', 'descripcion', 'tipo', 'version', 'estado',
            'ruta_archivo', 'tamano_archivo', 'tamano_legible', 'autor',
            'es_obligatorio', 'contador_visualizaciones', 'contador_descargas',
            'fecha_creacion', 'fecha_modificacion', 'metadatos',
            'esta_activo', 'nombre_archivo'
        ]
        read_only_fields = [
            'id', 'contador_visualizaciones', 'contador_descargas',
            'fecha_creacion', 'fecha_modificacion', 'esta_activo',
            'tamano_legible', 'nombre_archivo'
        ]

# Serializers simplificados para listados
class AulaVirtualListSerializer(serializers.ModelSerializer):
    """
    Serializer simplificado para listado de aulas virtuales
    """
    total_reservas = serializers.SerializerMethodField()
    
    class Meta:
        model = AulaVirtual
        fields = ['id', 'codigo', 'estado', 'descripcion', 'total_reservas']
    
    def get_total_reservas(self, obj):
        return obj.reservas.count()

class ReservaListSerializer(serializers.ModelSerializer):
    """
    Serializer simplificado para listado de reservas
    """
    user_nombre = serializers.SerializerMethodField()
    aula_virtual_codigo = serializers.CharField(source=AULA_VIRTUAL_CODIGO_SOURCE, read_only=True)
    curso_nombre = serializers.CharField(source=CURSO_NOMBRE_SOURCE, read_only=True)
    
    class Meta:
        model = Reserva
        fields = [
            'id', 'user_nombre', 'aula_virtual_codigo', 'curso_nombre',
            'hora_inicio', 'hora_fin', 'fecha_reserva', 'estado'
        ]
    
    def get_user_nombre(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username
