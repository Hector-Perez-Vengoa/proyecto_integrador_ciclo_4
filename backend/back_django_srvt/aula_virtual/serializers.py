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
    aula_virtual_codigo = serializers.CharField(source=AULA_VIRTUAL_CODIGO_SOURCE, read_only=True)
    
    class Meta:
        model = AulaVirtualComponente
        fields = ['id', 'aula_virtual', 'aula_virtual_codigo', 'nombre', 'descripcion']
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
    duracion_horas = serializers.SerializerMethodField()
    puede_cancelar = serializers.SerializerMethodField()
    
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
    
    def get_duracion_horas(self, obj):
        """Devuelve la duración de la reserva en horas"""
        return obj.duracion_horas
    
    def get_puede_cancelar(self, obj):
        """Verifica si la reserva puede ser cancelada"""
        return obj.puede_cancelar()

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
    esta_activo = serializers.SerializerMethodField()
    tamano_legible = serializers.SerializerMethodField()
    nombre_archivo = serializers.SerializerMethodField()
    
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
            'fecha_creacion', 'fecha_modificacion'
        ]
    
    def get_esta_activo(self, obj):
        """Verifica si el reglamento está activo"""
        return obj.esta_activo
    
    def get_tamano_legible(self, obj):
        """Convierte el tamaño del archivo a formato legible"""
        return obj.tamano_legible
    
    def get_nombre_archivo(self, obj):
        """Extrae el nombre del archivo de la ruta"""
        return obj.nombre_archivo

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
            'id', 'user', 'user_nombre', 'aula_virtual', 'aula_virtual_codigo', 'curso', 'curso_nombre',
            'hora_inicio', 'hora_fin', 'fecha_reserva', 'motivo', 'estado', 'fecha_creacion'
        ]
        read_only_fields = ['id', 'fecha_creacion']
    
    def get_user_nombre(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username

# Serializers adicionales para operaciones específicas
class ReservaCancelacionSerializer(serializers.Serializer):
    """
    Serializer para cancelar reservas
    """
    motivo_cancelacion = serializers.CharField(max_length=500, required=True)
    observaciones_cancelacion = serializers.CharField(max_length=1000, required=False, allow_blank=True)
    
    def validate_motivo_cancelacion(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError("El motivo de cancelación debe tener al menos 10 caracteres.")
        return value.strip()

class NotificacionDetailSerializer(serializers.ModelSerializer):
    """
    Serializer detallado para notificaciones con información completa de la reserva
    """
    user_nombre = serializers.SerializerMethodField()
    reserva_detalle = serializers.SerializerMethodField()
    tiempo_transcurrido = serializers.SerializerMethodField()
    
    class Meta:
        model = Notificacion
        fields = [
            'id', 'user', 'user_nombre', 'tipo', 'titulo', 'mensaje',
            'reserva', 'reserva_detalle', 'leida', 'fecha_creacion', 
            'fecha_lectura', 'tiempo_transcurrido'
        ]
        read_only_fields = ['id', 'fecha_creacion', 'fecha_lectura']
    
    def get_user_nombre(self, obj):
        """Devuelve el nombre completo del usuario"""
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username
    
    def get_reserva_detalle(self, obj):
        """Devuelve información detallada de la reserva asociada"""
        if obj.reserva:
            return {
                'id': obj.reserva.id,
                'aula_codigo': obj.reserva.aula_virtual.codigo,
                'curso_nombre': obj.reserva.curso.nombre,
                'fecha': obj.reserva.fecha_reserva,
                'hora_inicio': obj.reserva.hora_inicio,
                'hora_fin': obj.reserva.hora_fin,
                'estado': obj.reserva.estado,
                'motivo': obj.reserva.motivo
            }
        return None
    
    def get_tiempo_transcurrido(self, obj):
        """Calcula el tiempo transcurrido desde la creación"""
        from django.utils import timezone
        from datetime import timedelta
        
        ahora = timezone.now()
        diferencia = ahora - obj.fecha_creacion
        
        if diferencia < timedelta(minutes=1):
            return "Hace menos de un minuto"
        elif diferencia < timedelta(hours=1):
            minutos = int(diferencia.total_seconds() / 60)
            return f"Hace {minutos} minuto{'s' if minutos != 1 else ''}"
        elif diferencia < timedelta(days=1):
            horas = int(diferencia.total_seconds() / 3600)
            return f"Hace {horas} hora{'s' if horas != 1 else ''}"
        else:
            dias = diferencia.days
            return f"Hace {dias} día{'s' if dias != 1 else ''}"

class AulaVirtualDisponibilidadSerializer(serializers.ModelSerializer):
    """
    Serializer para verificar disponibilidad de aulas virtuales
    """
    reservas_activas = serializers.SerializerMethodField()
    bloques_no_disponibles = serializers.SerializerMethodField()
    total_reservas_mes = serializers.SerializerMethodField()
    
    class Meta:
        model = AulaVirtual
        fields = [
            'id', 'codigo', 'estado', 'descripcion', 
            'reservas_activas', 'bloques_no_disponibles', 'total_reservas_mes'
        ]
    
    def get_reservas_activas(self, obj):
        """Devuelve las reservas activas del día actual"""
        from django.utils import timezone
        hoy = timezone.now().date()
        reservas = obj.reservas.filter(
            fecha_reserva=hoy,
            estado__in=['confirmada', 'en_uso']
        ).order_by('hora_inicio')
        
        return [{
            'id': r.id,
            'hora_inicio': r.hora_inicio,
            'hora_fin': r.hora_fin,
            'usuario': f"{r.user.first_name} {r.user.last_name}".strip() or r.user.username,
            'curso': r.curso.nombre,
            'estado': r.estado
        } for r in reservas]
    
    def get_bloques_no_disponibles(self, obj):
        """Devuelve los bloques horarios no disponibles"""
        from django.utils import timezone
        hoy = timezone.now().date()
        bloques = obj.bloques_horarios.filter(
            fecha=hoy,
            tipo__in=['bloqueado', 'mantenimiento']
        ).order_by('hora_inicio')
        
        return [{
            'hora_inicio': b.hora_inicio,
            'hora_fin': b.hora_fin,
            'tipo': b.tipo,
            'motivo': b.motivo
        } for b in bloques]
    
    def get_total_reservas_mes(self, obj):
        """Devuelve el total de reservas del mes actual"""
        from django.utils import timezone
        ahora = timezone.now()
        return obj.reservas.filter(
            fecha_reserva__year=ahora.year,
            fecha_reserva__month=ahora.month
        ).count()
