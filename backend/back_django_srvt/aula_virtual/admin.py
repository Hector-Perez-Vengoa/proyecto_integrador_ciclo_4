from django.contrib import admin
from .models import (
    AulaVirtual, AulaVirtualImagen, AulaVirtualComponente, 
    Reserva, BloqueHorario, Notificacion, CalendarioInstitucional, Reglamento
)

class AulaVirtualImagenInline(admin.TabularInline):
    model = AulaVirtualImagen
    extra = 1
    fields = ('url_imagen', 'nombre_archivo', 'es_principal', 'orden_visualizacion', 'activo')

class AulaVirtualComponenteInline(admin.TabularInline):
    model = AulaVirtualComponente
    extra = 1
    fields = ('nombre', 'descripcion')

@admin.register(AulaVirtual)
class AulaVirtualAdmin(admin.ModelAdmin):
    list_display = ('codigo', 'estado', 'descripcion', 'fecha_creacion')
    list_filter = ('estado', 'fecha_creacion')
    search_fields = ('codigo', 'descripcion')
    readonly_fields = ('fecha_creacion',)
    inlines = [AulaVirtualImagenInline, AulaVirtualComponenteInline]

@admin.register(AulaVirtualImagen)
class AulaVirtualImagenAdmin(admin.ModelAdmin):
    list_display = ('aula_virtual', 'nombre_archivo', 'es_principal', 'orden_visualizacion', 'activo')
    list_filter = ('es_principal', 'activo', 'fecha_creacion')
    search_fields = ('aula_virtual__codigo', 'nombre_archivo')
    readonly_fields = ('fecha_creacion',)

@admin.register(AulaVirtualComponente)
class AulaVirtualComponenteAdmin(admin.ModelAdmin):
    list_display = ('aula_virtual', 'nombre', 'descripcion')
    search_fields = ('aula_virtual__codigo', 'nombre')

@admin.register(Reserva)
class ReservaAdmin(admin.ModelAdmin):
    list_display = ('user', 'aula_virtual', 'curso', 'fecha_reserva', 'hora_inicio', 'hora_fin', 'estado')
    list_filter = ('estado', 'fecha_reserva', 'aula_virtual', 'curso')
    search_fields = ('user__username', 'user__first_name', 'user__last_name', 'aula_virtual__codigo', 'curso__nombre')
    readonly_fields = ('fecha_creacion', 'fecha_cancelacion')
    date_hierarchy = 'fecha_reserva'

@admin.register(BloqueHorario)
class BloqueHorarioAdmin(admin.ModelAdmin):
    list_display = ('aula_virtual', 'fecha', 'hora_inicio', 'hora_fin', 'tipo')
    list_filter = ('tipo', 'fecha', 'aula_virtual')
    search_fields = ('aula_virtual__codigo',)
    readonly_fields = ('fecha_creacion',)
    date_hierarchy = 'fecha'

@admin.register(Notificacion)
class NotificacionAdmin(admin.ModelAdmin):
    list_display = ('user', 'titulo', 'tipo', 'leida', 'fecha_creacion')
    list_filter = ('tipo', 'leida', 'fecha_creacion')
    search_fields = ('user__username', 'titulo', 'mensaje')
    readonly_fields = ('fecha_creacion', 'fecha_lectura')
    actions = ['marcar_como_leidas']

    def marcar_como_leidas(self, request, queryset):
        """Acción para marcar notificaciones como leídas"""
        for notificacion in queryset:
            notificacion.marcar_como_leida()
        self.message_user(request, f"{queryset.count()} notificaciones marcadas como leídas.")
    marcar_como_leidas.short_description = "Marcar como leídas"

@admin.register(CalendarioInstitucional)
class CalendarioInstitucionalAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'tipo_evento', 'fecha_inicio', 'fecha_fin', 'afecta_reservas')
    list_filter = ('tipo_evento', 'afecta_reservas', 'fecha_inicio')
    search_fields = ('titulo', 'descripcion')
    readonly_fields = ('fecha_creacion',)
    filter_horizontal = ('aulas_afectadas',)
    date_hierarchy = 'fecha_inicio'

@admin.register(Reglamento)
class ReglamentoAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'version', 'tipo', 'estado', 'es_obligatorio', 'fecha_modificacion')
    list_filter = ('tipo', 'estado', 'es_obligatorio', 'fecha_creacion')
    search_fields = ('titulo', 'descripcion', 'autor')
    readonly_fields = ('fecha_creacion', 'fecha_modificacion', 'contador_visualizaciones', 'contador_descargas', 'tamano_legible', 'nombre_archivo')
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('titulo', 'descripcion', 'tipo', 'version', 'estado')
        }),
        ('Archivo', {
            'fields': ('ruta_archivo', 'tamano_archivo', 'tamano_legible', 'nombre_archivo')
        }),
        ('Configuración', {
            'fields': ('autor', 'es_obligatorio')
        }),
        ('Estadísticas', {
            'fields': ('contador_visualizaciones', 'contador_descargas'),
            'classes': ('collapse',)
        }),
        ('Metadatos', {
            'fields': ('metadatos',),
            'classes': ('collapse',)
        }),
        ('Fechas', {
            'fields': ('fecha_creacion', 'fecha_modificacion'),
            'classes': ('collapse',)
        })
    )



