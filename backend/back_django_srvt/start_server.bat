@echo off
echo 🚀 Iniciando configuración del servidor Django...

cd /d "%~dp0"

echo 📦 Verificando dependencias...
pip install django djangorestframework django-cors-headers pymysql

echo 🔄 Ejecutando migraciones...
python manage.py makemigrations
python manage.py migrate

echo 👤 Verificando superusuario...
python manage.py shell -c "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'admin123') if not User.objects.filter(is_superuser=True).exists() else print('Ya existe un superusuario')"

echo 🌐 Iniciando servidor Django en puerto 8000...
python manage.py runserver 8000

pause
