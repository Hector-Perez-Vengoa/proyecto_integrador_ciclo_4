from django.db import models
from django.contrib.auth.models import User
from authentication.models import Departamento, Carrera, Curso

class AulaVirtual(models.Model):
    """
    Modelo para representar las aulas virtuales
    Traducido desde el modelo AulaVirtual de SpringBoot
    """
    ESTADO_CHOICES = [
        ('disponible', 'Disponible'),
        ('reservada', 'Reservada'),
        ('en_uso', 'En Uso'),
        ('en_mantenimiento', 'En Mantenimiento'),
        ('inactiva', 'Inactiva'),
        ('bloqueada', 'Bloqueada')
    ]
    
    codigo = models.CharField(max_length=20, unique=True, help_text="Código único del aula virtual")
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='disponible')
    descripcion = models.TextField(blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Aula Virtual {self.codigo}"
    
    class Meta:
        db_table = 'aula_virtualdb'
        ordering = ['codigo']
        verbose_name = "Aula Virtual"
        verbose_name_plural = "Aulas Virtuales"

class AulaVirtualImagen(models.Model):
    """
    Modelo para gestionar las imágenes de las aulas virtuales
    Traducido desde el modelo AulaVirtualImagen de SpringBoot
    """
    aula_virtual = models.ForeignKey(AulaVirtual, on_delete=models.CASCADE, related_name='imagenes')
    url_imagen = models.URLField(max_length=500, help_text="URL de la imagen")
    nombre_archivo = models.CharField(max_length=255, blank=True)
    descripcion = models.CharField(max_length=255, blank=True)
    es_principal = models.BooleanField(default=False, help_text="Indica si es la imagen principal")
    orden_visualizacion = models.PositiveIntegerField(default=1, help_text="Orden de visualización")
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)
    
    def __str__(self):
        return f"Imagen de {self.aula_virtual.codigo} - {self.nombre_archivo}"
    
    class Meta:
        db_table = 'aula_virtual_imagen'
        ordering = ['aula_virtual', 'orden_visualizacion']
        verbose_name = "Imagen de Aula Virtual"
        verbose_name_plural = "Imágenes de Aulas Virtuales"

class AulaVirtualComponente(models.Model):
    """
    Modelo para gestionar los componentes de las aulas virtuales
    Traducido desde el modelo AulaVirtualComponente de SpringBoot
    """
    aula_virtual = models.ForeignKey(AulaVirtual, on_delete=models.CASCADE, related_name='componentes')
    nombre = models.CharField(max_length=100, help_text="Nombre del componente")
    descripcion = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.nombre} - {self.aula_virtual.codigo}"
    
    class Meta:
        db_table = 'aula_virtual_componente'
        ordering = ['aula_virtual', 'nombre']
        verbose_name = "Componente de Aula Virtual"
        verbose_name_plural = "Componentes de Aulas Virtuales"

class Reserva(models.Model):
    """
    Modelo para gestionar las reservas de aulas virtuales
    Traducido y mejorado desde el modelo Reserva de SpringBoot
    """
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('confirmada', 'Confirmada'),
        ('en_uso', 'En Uso'),
        ('completada', 'Completada'),
        ('cancelada', 'Cancelada'),
        ('no_presentado', 'No Presentado')
    ]
    
    # Relaciones principales
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reservas')
    aula_virtual = models.ForeignKey(AulaVirtual, on_delete=models.CASCADE, related_name='reservas')
    curso = models.ForeignKey(Curso, on_delete=models.CASCADE, related_name='reservas')
    
    # Información temporal
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    fecha_reserva = models.DateField()
    
    # Información adicional
    motivo = models.TextField(blank=True)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    # Campos para cancelación
    fecha_cancelacion = models.DateTimeField(blank=True, null=True)
    motivo_cancelacion = models.TextField(blank=True)
    cancelado_por = models.CharField(max_length=100, blank=True)
    observaciones_cancelacion = models.TextField(blank=True)
    
    def __str__(self):
        return f"Reserva de {self.user.get_full_name()} - {self.aula_virtual.codigo} - {self.fecha_reserva}"
    
    @property
    def duracion_horas(self):
        """Calcula la duración de la reserva en horas"""
        from datetime import datetime, timedelta
        inicio = datetime.combine(datetime.today(), self.hora_inicio)
        fin = datetime.combine(datetime.today(), self.hora_fin)
        duracion = fin - inicio
        return duracion.total_seconds() / 3600
    
    def puede_cancelar(self):
        """Verifica si la reserva puede ser cancelada"""
        return self.estado in ['pendiente', 'confirmada']
    
    def cancelar(self, motivo, cancelado_por, observaciones=None):
        """Cancela la reserva"""
        if self.puede_cancelar():
            from django.utils import timezone
            self.estado = 'cancelada'
            self.fecha_cancelacion = timezone.now()
            self.motivo_cancelacion = motivo
            self.cancelado_por = cancelado_por
            self.observaciones_cancelacion = observaciones
            self.save()
            return True
        return False
    
    class Meta:
        db_table = 'reservadb'
        ordering = ['-fecha_reserva', '-hora_inicio']
        verbose_name = "Reserva"
        verbose_name_plural = "Reservas"
        indexes = [
            models.Index(fields=['fecha_reserva', 'aula_virtual']),
            models.Index(fields=['user', 'estado']),
        ]

class BloqueHorario(models.Model):
    """
    Modelo para gestionar bloques horarios disponibles
    Nuevo modelo basado en la lógica de SpringBoot
    """
    TIPO_CHOICES = [
        ('disponible', 'Disponible'),
        ('bloqueado', 'Bloqueado'),
        ('mantenimiento', 'Mantenimiento'),
    ]
    
    aula_virtual = models.ForeignKey(AulaVirtual, on_delete=models.CASCADE, related_name='bloques_horarios')
    fecha = models.DateField()
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, default='disponible')
    motivo = models.TextField(blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Bloque {self.aula_virtual.codigo} - {self.fecha} ({self.hora_inicio}-{self.hora_fin})"
    
    class Meta:
        db_table = 'bloque_horario'
        ordering = ['fecha', 'hora_inicio']
        verbose_name = "Bloque Horario"
        verbose_name_plural = "Bloques Horarios"
        unique_together = ['aula_virtual', 'fecha', 'hora_inicio', 'hora_fin']

class Notificacion(models.Model):
    """
    Modelo para gestionar notificaciones del sistema
    Nuevo modelo basado en SpringBoot
    """
    TIPO_CHOICES = [
        ('reserva_confirmada', 'Reserva Confirmada'),
        ('reserva_cancelada', 'Reserva Cancelada'),
        ('recordatorio', 'Recordatorio'),
        ('mantenimiento', 'Mantenimiento'),
        ('sistema', 'Sistema'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notificaciones')
    tipo = models.CharField(max_length=30, choices=TIPO_CHOICES)
    titulo = models.CharField(max_length=200)
    mensaje = models.TextField()
    reserva = models.ForeignKey(Reserva, on_delete=models.CASCADE, null=True, blank=True, related_name='notificaciones')
    leida = models.BooleanField(default=False)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_lectura = models.DateTimeField(null=True, blank=True)
    
    def marcar_como_leida(self):
        """Marca la notificación como leída"""
        if not self.leida:
            from django.utils import timezone
            self.leida = True
            self.fecha_lectura = timezone.now()
            self.save()
    
    def __str__(self):
        return f"Notificación para {self.user.username}: {self.titulo}"
    
    class Meta:
        db_table = 'notificacion'
        ordering = ['-fecha_creacion']
        verbose_name = "Notificación"
        verbose_name_plural = "Notificaciones"

class CalendarioInstitucional(models.Model):
    """
    Modelo para gestionar eventos del calendario institucional
    Nuevo modelo basado en SpringBoot
    """
    TIPO_EVENTO_CHOICES = [
        ('feriado', 'Feriado'),
        ('mantenimiento', 'Mantenimiento'),
        ('evento_especial', 'Evento Especial'),
        ('suspension_clases', 'Suspensión de Clases'),
    ]
    
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)
    tipo_evento = models.CharField(max_length=30, choices=TIPO_EVENTO_CHOICES)
    fecha_inicio = models.DateTimeField()
    fecha_fin = models.DateTimeField()
    afecta_reservas = models.BooleanField(default=True, help_text="Indica si afecta la disponibilidad de reservas")
    aulas_afectadas = models.ManyToManyField(AulaVirtual, blank=True, related_name='eventos_calendario')
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    creado_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        return f"{self.titulo} - {self.fecha_inicio.date()}"
    
    class Meta:
        db_table = 'calendario_institucionaldb'
        ordering = ['fecha_inicio']
        verbose_name = "Evento de Calendario"
        verbose_name_plural = "Eventos de Calendario"

class Reglamento(models.Model):
    """
    Modelo para gestionar reglamentos institucionales
    Traducido desde el modelo Reglamento de SpringBoot
    """
    TIPO_CHOICES = [
        ('general', 'General'),
        ('academico', 'Académico'),
        ('disciplinario', 'Disciplinario'),
        ('administrativo', 'Administrativo'),
        ('tecnico', 'Técnico'),
    ]
    
    ESTADO_CHOICES = [
        ('borrador', 'Borrador'),
        ('revision', 'En Revisión'),
        ('activo', 'Activo'),
        ('inactivo', 'Inactivo'),
        ('archivado', 'Archivado'),
    ]
    
    titulo = models.CharField(max_length=200, help_text="Título del reglamento")
    descripcion = models.TextField(blank=True, help_text="Descripción del reglamento")
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, default='general')
    version = models.CharField(max_length=20, help_text="Versión del reglamento")
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='borrador')
    ruta_archivo = models.CharField(max_length=500, blank=True, help_text="Ruta del archivo")
    tamano_archivo = models.BigIntegerField(null=True, blank=True, help_text="Tamaño del archivo en bytes")
    autor = models.CharField(max_length=100, blank=True, help_text="Autor del reglamento")
    es_obligatorio = models.BooleanField(default=False, help_text="Indica si la lectura es obligatoria")
    contador_visualizaciones = models.BigIntegerField(default=0)
    contador_descargas = models.BigIntegerField(default=0)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_modificacion = models.DateTimeField(auto_now=True)
    metadatos = models.TextField(blank=True, help_text="Metadatos adicionales en formato JSON")
    
    def __str__(self):
        return f"{self.titulo} (v{self.version})"
    
    @property
    def esta_activo(self):
        """Verifica si el reglamento está activo"""
        return self.estado == 'activo'
    
    @property
    def tamano_legible(self):
        """Convierte el tamaño del archivo a formato legible"""
        if not self.tamano_archivo:
            return "Desconocido"
        
        tamano = float(self.tamano_archivo)
        unidades = ['B', 'KB', 'MB', 'GB', 'TB']
        
        unidad_index = 0
        while tamano >= 1024 and unidad_index < len(unidades) - 1:
            tamano /= 1024
            unidad_index += 1
        
        return f"{tamano:.1f} {unidades[unidad_index]}"
    
    @property
    def nombre_archivo(self):
        """Extrae el nombre del archivo de la ruta"""
        if not self.ruta_archivo:
            return "reglamento.pdf"
        return self.ruta_archivo.split('/')[-1]
    
    def incrementar_visualizaciones(self):
        """Incrementa el contador de visualizaciones"""
        self.contador_visualizaciones += 1
        self.save(update_fields=['contador_visualizaciones'])
    
    def incrementar_descargas(self):
        """Incrementa el contador de descargas"""
        self.contador_descargas += 1
        self.save(update_fields=['contador_descargas'])
    
    class Meta:
        db_table = 'reglamento'
        ordering = ['-fecha_modificacion']
        verbose_name = "Reglamento"
        verbose_name_plural = "Reglamentos"
        indexes = [
            models.Index(fields=['estado', 'tipo']),
            models.Index(fields=['es_obligatorio']),
        ]
