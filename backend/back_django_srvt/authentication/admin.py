from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Perfil, UsuarioCustom, Rol, Departamento, Carrera, Curso

class PerfilInline(admin.StackedInline):
    model = Perfil
    can_delete = False
    verbose_name_plural = 'Perfil'
    fields = ('imagen_perfil', 'telefono', 'biografia', 'fecha_nacimiento', 'departamento')

class UsuarioCustomInline(admin.StackedInline):
    model = UsuarioCustom
    can_delete = False
    verbose_name_plural = 'Usuario Personalizado'
    fields = ('google_image_url', 'has_password')

class UserAdmin(BaseUserAdmin):
    inlines = (PerfilInline, UsuarioCustomInline)

@admin.register(Rol)
class RolAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'descripcion')
    search_fields = ('nombre',)

@admin.register(UsuarioCustom)
class UsuarioCustomAdmin(admin.ModelAdmin):
    list_display = ('user', 'google_image_url', 'has_password')
    list_filter = ('has_password',)
    search_fields = ('user__username', 'user__email')

@admin.register(Departamento)
class DepartamentoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'jefe', 'fecha_creacion')
    list_filter = ('fecha_creacion',)
    search_fields = ('nombre', 'jefe')
    readonly_fields = ('fecha_creacion',)

@admin.register(Carrera)
class CarreraAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'codigo', 'departamento', 'fecha_creacion')
    list_filter = ('departamento', 'fecha_creacion')
    search_fields = ('nombre', 'codigo')
    readonly_fields = ('fecha_creacion',)

@admin.register(Curso)
class CursoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'carrera', 'duracion', 'fecha_creacion')
    list_filter = ('carrera', 'fecha_creacion')
    search_fields = ('nombre',)
    readonly_fields = ('fecha_creacion',)

@admin.register(Perfil)
class PerfilAdmin(admin.ModelAdmin):
    list_display = ('user', 'telefono', 'departamento', 'fecha_actualizacion')
    list_filter = ('departamento', 'fecha_actualizacion')
    search_fields = ('user__username', 'user__first_name', 'user__last_name', 'user__email')
    readonly_fields = ('fecha_actualizacion',)
    filter_horizontal = ('carreras', 'cursos')

admin.site.unregister(User)
admin.site.register(User, UserAdmin)
