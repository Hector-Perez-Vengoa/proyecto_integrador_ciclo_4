# Script para crear la migración en Django
# Ejecutar estos comandos en el backend Django

# 1. Crear la migración
python manage.py makemigrations aula_virtual

# 2. Aplicar la migración
python manage.py migrate

# 3. (Opcional) Crear datos de prueba
python manage.py shell

# En el shell de Django:
from aula_virtual.models import Reglamento
from django.utils import timezone
from datetime import date

# Crear reglamento de ejemplo
reglamento = Reglamento.objects.create(
    titulo="Reglamento General de Aulas Virtuales",
    descripcion="Normativas generales para el uso de aulas virtuales en la institución",
    tipo="GENERAL",
    version="1.0",
    estado="ACTIVO",
    fecha_vigencia=date.today(),
    creado_por="admin",
    orden_visualizacion=1
)

print(f"Reglamento creado: {reglamento}")
