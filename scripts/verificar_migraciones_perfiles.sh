#!/bin/bash

# Script para aplicar migraciones y verificar la estructura de la base de datos
# después de los cambios en los modelos

echo "=== APLICANDO MIGRACIONES PARA NUEVOS MODELOS ==="

# Navegar al directorio del proyecto Django
cd backend/back_django_srvt

echo "1. Creando migraciones para authentication..."
python manage.py makemigrations authentication

echo "2. Aplicando migraciones..."
python manage.py migrate

echo "3. Verificando estructura de la base de datos..."
python manage.py shell << EOF
from authentication.models import Perfil, Departamento, Carrera, Curso, UsuarioCustom, Rol
from django.contrib.auth.models import User

print("=== VERIFICANDO MODELOS ===")

# Verificar que las tablas existen
print(f"Perfiles en BD: {Perfil.objects.count()}")
print(f"Departamentos en BD: {Departamento.objects.count()}")
print(f"Carreras en BD: {Carrera.objects.count()}")
print(f"Cursos en BD: {Curso.objects.count()}")
print(f"Usuarios en BD: {User.objects.count()}")

# Crear datos de prueba si no existen
if Departamento.objects.count() == 0:
    print("Creando departamento de prueba...")
    dept = Departamento.objects.create(
        nombre="Ingeniería de Sistemas",
        descripcion="Departamento de Ingeniería de Sistemas y Computación",
        jefe="Dr. Juan Pérez"
    )
    print(f"Departamento creado: {dept}")

if Carrera.objects.count() == 0:
    print("Creando carrera de prueba...")
    dept = Departamento.objects.first()
    carrera = Carrera.objects.create(
        nombre="Ingeniería de Software",
        codigo="ISW001",
        descripcion="Carrera de Ingeniería de Software",
        departamento=dept
    )
    print(f"Carrera creada: {carrera}")

print("=== VERIFICACIÓN COMPLETADA ===")
EOF

echo "4. Iniciando servidor de desarrollo..."
echo "Para probar las APIs, puedes usar:"
echo "  - GET /api/auth/api/perfiles/ (Lista de perfiles)"
echo "  - GET /api/profesores/ (Alias para perfiles)"
echo "  - GET /api/auth/api/departamentos/ (Lista de departamentos)"
echo "  - GET /api/auth/api/carreras/ (Lista de carreras)"
echo "  - GET /api/auth/api/cursos/ (Lista de cursos)"

echo "Ejecuta 'python manage.py runserver' para iniciar el servidor"
