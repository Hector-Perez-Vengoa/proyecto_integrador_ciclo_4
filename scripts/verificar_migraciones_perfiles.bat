@echo off
echo === APLICANDO MIGRACIONES PARA NUEVOS MODELOS ===

REM Navegar al directorio del proyecto Django
cd backend\back_django_srvt

echo 1. Creando migraciones para authentication...
python manage.py makemigrations authentication

echo 2. Aplicando migraciones...
python manage.py migrate

echo 3. Creando datos de prueba...
python manage.py crear_datos_prueba

echo 4. APIs disponibles:
echo   - GET /api/auth/api/perfiles/ (Lista de perfiles)
echo   - GET /api/profesores/ (Alias para perfiles)
echo   - GET /api/auth/api/departamentos/ (Lista de departamentos)
echo   - GET /api/auth/api/carreras/ (Lista de carreras)
echo   - GET /api/auth/api/cursos/ (Lista de cursos)

echo.
echo Ejecuta 'python manage.py runserver' para iniciar el servidor
pause
