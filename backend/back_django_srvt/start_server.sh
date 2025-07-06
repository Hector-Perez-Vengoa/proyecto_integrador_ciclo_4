#!/bin/bash

# Script para inicializar el servidor Django con las configuraciones necesarias

echo "🚀 Iniciando configuración del servidor Django..."

# Navegar al directorio del proyecto Django
cd "$(dirname "$0")"

# Instalar dependencias (si no están instaladas)
echo "📦 Verificando dependencias..."
pip install django djangorestframework django-cors-headers pymysql

# Ejecutar migraciones
echo "🔄 Ejecutando migraciones..."
python manage.py makemigrations
python manage.py migrate

# Crear superusuario si no existe
echo "👤 Verificando superusuario..."
python manage.py shell -c "
from django.contrib.auth.models import User
if not User.objects.filter(is_superuser=True).exists():
    print('Creando superusuario...')
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print('Superusuario creado: admin / admin123')
else:
    print('Ya existe un superusuario')
"

# Iniciar el servidor
echo "🌐 Iniciando servidor Django en puerto 8000..."
python manage.py runserver 8000
