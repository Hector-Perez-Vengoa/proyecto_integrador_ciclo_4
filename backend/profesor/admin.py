from django.contrib import admin
from .models import DepartamentoDB, CursoDB, CarreraDB, ProfesorDB

# Register your models here.
admin.site.register(DepartamentoDB)
admin.site.register(CursoDB)
admin.site.register(CarreraDB)
admin.site.register(ProfesorDB)