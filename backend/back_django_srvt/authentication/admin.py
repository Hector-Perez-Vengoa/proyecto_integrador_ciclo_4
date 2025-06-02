from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import PerfilDB

class PerfilInline(admin.StackedInline):
    model = PerfilDB
    can_delete = False
    verbose_name_plural = 'Perfil'
    fields = ('imagen_perfil', 'telefono', 'biografia', 'fecha_nacimiento', 'ubicacion')

class UserAdmin(BaseUserAdmin):
    inlines = (PerfilInline,)

@admin.register(PerfilDB)
class PerfilAdmin(admin.ModelAdmin):
    list_display = ('user', 'telefono', 'fecha_actualizacion')
    list_filter = ('fecha_actualizacion',)
    search_fields = ('user__username', 'user__first_name', 'user__last_name', 'user__email')
    readonly_fields = ('fecha_actualizacion',)

admin.site.unregister(User)
admin.site.register(User, UserAdmin)
