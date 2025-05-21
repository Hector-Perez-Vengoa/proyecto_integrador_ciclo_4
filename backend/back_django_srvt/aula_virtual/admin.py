from django.contrib import admin
from .models import DepartamentoDB, CarreraDB, CursoDB, ProfesorDB,AulaVirtualDB

# Register your models here.
@admin.register(DepartamentoDB)
class DepartamentoAdmin(admin.ModelAdmin):
    list_fields = '__all__'



@admin.register(CarreraDB)
class CarreraAdmin(admin.ModelAdmin):
    list_fields = '__all__'



@admin.register(CursoDB)
class CursoAdmin(admin.ModelAdmin):
    list_fields = '__all__'


@admin.register(ProfesorDB)
class ProfesorAdmin(admin.ModelAdmin):
    list_fields = '__all__'



@admin.register(AulaVirtualDB)
class AulaVirtualAdmin(admin.ModelAdmin):
    list_fields = '__all__'



