# backend/back_django_srvt/aula_virtual/models.py
# Agregar este modelo al archivo existente

from django.db import models
from django.core.validators import FileExtensionValidator
import os

def reglamento_upload_path(instance, filename):
    """Generar ruta para subir archivos de reglamento"""
    # Mantener la extensión original
    ext = filename.split('.')[-1]
    # Crear nombre único basado en título y timestamp
    import time
    timestamp = str(int(time.time()))
    safe_title = "".join(c for c in instance.titulo if c.isalnum() or c in (' ', '-', '_')).rstrip()
    safe_title = safe_title.replace(' ', '_')[:50]  # Limitar longitud
    new_filename = f"{safe_title}_{timestamp}.{ext}"
    return f"reglamentos/{new_filename}"

class Reglamento(models.Model):
    """
    Modelo para gestionar reglamentos de aulas virtuales
    """
    TIPOS_REGLAMENTO = [
        ('GENERAL', 'Reglamento General'),
        ('USO_AULAS', 'Uso de Aulas Virtuales'),
        ('RESERVAS', 'Normas de Reservas'),
        ('SANCIONES', 'Sanciones y Penalidades'),
        ('PROCEDIMIENTOS', 'Procedimientos Administrativos'),
        ('OTROS', 'Otros'),
    ]
    
    ESTADOS = [
        ('ACTIVO', 'Activo'),
        ('INACTIVO', 'Inactivo'),
        ('BORRADOR', 'Borrador'),
        ('ARCHIVADO', 'Archivado'),
    ]
    
    titulo = models.CharField(
        max_length=200,
        verbose_name="Título del Reglamento",
        help_text="Título descriptivo del reglamento"
    )
    
    descripcion = models.TextField(
        blank=True,
        null=True,
        verbose_name="Descripción",
        help_text="Descripción detallada del contenido del reglamento"
    )
    
    tipo = models.CharField(
        max_length=20,
        choices=TIPOS_REGLAMENTO,
        default='GENERAL',
        verbose_name="Tipo de Reglamento"
    )
    
    version = models.CharField(
        max_length=20,
        default='1.0',
        verbose_name="Versión",
        help_text="Versión del reglamento (ej: 1.0, 2.1, etc.)"
    )
    
    archivo_pdf = models.FileField(
        upload_to=reglamento_upload_path,
        validators=[FileExtensionValidator(['pdf'])],
        verbose_name="Archivo PDF",
        help_text="Archivo PDF del reglamento (solo archivos .pdf)"
    )
    
    tamaño_archivo = models.PositiveIntegerField(
        blank=True,
        null=True,
        verbose_name="Tamaño del archivo (bytes)",
        help_text="Tamaño del archivo en bytes (se calcula automáticamente)"
    )
    
    estado = models.CharField(
        max_length=20,
        choices=ESTADOS,
        default='ACTIVO',
        verbose_name="Estado"
    )
    
    fecha_vigencia = models.DateField(
        verbose_name="Fecha de Vigencia",
        help_text="Fecha desde la cual entra en vigencia el reglamento"
    )
    
    fecha_vencimiento = models.DateField(
        blank=True,
        null=True,
        verbose_name="Fecha de Vencimiento",
        help_text="Fecha hasta la cual es válido el reglamento (opcional)"
    )
    
    orden_visualizacion = models.PositiveIntegerField(
        default=0,
        verbose_name="Orden de Visualización",
        help_text="Orden en que se muestra en la lista (menor número = mayor prioridad)"
    )
    
    # Metadatos de auditoría
    creado_por = models.CharField(
        max_length=100,
        verbose_name="Creado por",
        help_text="Usuario que creó el reglamento"
    )
    
    fecha_creacion = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Fecha de Creación"
    )
    
    fecha_actualizacion = models.DateTimeField(
        auto_now=True,
        verbose_name="Fecha de Actualización"
    )
    
    actualizado_por = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name="Actualizado por",
        help_text="Último usuario que actualizó el reglamento"
    )
    
    # Campos para estadísticas
    numero_descargas = models.PositiveIntegerField(
        default=0,
        verbose_name="Número de Descargas"
    )
    
    ultima_descarga = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name="Última Descarga"
    )
    
    class Meta:
        db_table = 'reglamento'
        verbose_name = 'Reglamento'
        verbose_name_plural = 'Reglamentos'
        ordering = ['orden_visualizacion', 'fecha_vigencia']
        indexes = [
            models.Index(fields=['estado', 'fecha_vigencia']),
            models.Index(fields=['tipo', 'estado']),
            models.Index(fields=['orden_visualizacion']),
        ]
    
    def __str__(self):
        return f"{self.titulo} (v{self.version})"
    
    def save(self, *args, **kwargs):
        # Calcular tamaño del archivo automáticamente
        if self.archivo_pdf and hasattr(self.archivo_pdf, 'size'):
            self.tamaño_archivo = self.archivo_pdf.size
        super().save(*args, **kwargs)
    
    def delete(self, *args, **kwargs):
        # Eliminar archivo físico al eliminar el registro
        if self.archivo_pdf:
            if os.path.isfile(self.archivo_pdf.path):
                os.remove(self.archivo_pdf.path)
        super().delete(*args, **kwargs)
    
    @property
    def tamaño_legible(self):
        """Retorna el tamaño del archivo en formato legible"""
        if not self.tamaño_archivo:
            return "Desconocido"
        
        for unit in ['B', 'KB', 'MB', 'GB']:
            if self.tamaño_archivo < 1024.0:
                return f"{self.tamaño_archivo:.1f} {unit}"
            self.tamaño_archivo /= 1024.0
        return f"{self.tamaño_archivo:.1f} TB"
    
    @property
    def esta_vigente(self):
        """Verifica si el reglamento está vigente"""
        from django.utils import timezone
        hoy = timezone.now().date()
        
        if self.estado != 'ACTIVO':
            return False
        
        if self.fecha_vigencia > hoy:
            return False
            
        if self.fecha_vencimiento and self.fecha_vencimiento < hoy:
            return False
            
        return True
    
    def incrementar_descargas(self):
        """Incrementa el contador de descargas"""
        from django.utils import timezone
        self.numero_descargas += 1
        self.ultima_descarga = timezone.now()
        self.save(update_fields=['numero_descargas', 'ultima_descarga'])
