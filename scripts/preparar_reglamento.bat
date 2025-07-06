@echo off
REM Script para preparar reglamento PDF para inserción en la base de datos
REM Uso: preparar_reglamento.bat "ruta\a\tu\archivo.pdf"

echo ========================================
echo   PREPARADOR DE REGLAMENTO PDF
echo ========================================
echo.

REM Verificar que se proporcionó un archivo
if "%~1"=="" (
    echo ERROR: Debes proporcionar la ruta al archivo PDF
    echo Uso: preparar_reglamento.bat "ruta\a\tu\archivo.pdf"
    pause
    exit /b 1
)

REM Obtener información del archivo
set "archivo=%~1"
set "nombre=%~n1"
set "extension=%~x1"
set "tamaño=%~z1"

echo Archivo: %archivo%
echo Nombre: %nombre%
echo Extension: %extension%
echo Tamaño: %tamaño% bytes
echo.

REM Verificar que es un PDF
if /i not "%extension%"==".pdf" (
    echo ERROR: El archivo debe ser un PDF
    pause
    exit /b 1
)

REM Crear carpeta de destino si no existe
if not exist "uploads\reglamentos" (
    echo Creando carpeta uploads\reglamentos...
    mkdir "uploads\reglamentos"
)

REM Copiar archivo a la ubicación correcta
set "destino=uploads\reglamentos\reglamento_aulas_virtuales_2025.pdf"
echo Copiando archivo a: %destino%
copy "%archivo%" "%destino%"

if errorlevel 1 (
    echo ERROR: No se pudo copiar el archivo
    pause
    exit /b 1
)

echo.
echo ✅ Archivo copiado exitosamente!
echo.

REM Generar SQL con los datos reales
echo Generando script SQL personalizado...
echo.

set "sql_file=scripts\insertar_reglamento_personalizado.sql"

echo -- Script generado automáticamente para insertar reglamento > "%sql_file%"
echo -- Archivo: %nombre%%extension% >> "%sql_file%"
echo -- Tamaño: %tamaño% bytes >> "%sql_file%"
echo -- Fecha: %date% %time% >> "%sql_file%"
echo. >> "%sql_file%"
echo INSERT INTO reglamento ^( >> "%sql_file%"
echo     titulo, >> "%sql_file%"
echo     descripcion, >> "%sql_file%"
echo     tipo, >> "%sql_file%"
echo     version, >> "%sql_file%"
echo     estado, >> "%sql_file%"
echo     ruta_archivo, >> "%sql_file%"
echo     tamaño_archivo, >> "%sql_file%"
echo     autor, >> "%sql_file%"
echo     es_obligatorio, >> "%sql_file%"
echo     contador_visualizaciones, >> "%sql_file%"
echo     contador_descargas, >> "%sql_file%"
echo     fecha_creacion, >> "%sql_file%"
echo     fecha_modificacion, >> "%sql_file%"
echo     metadatos >> "%sql_file%"
echo ^) VALUES ^( >> "%sql_file%"
echo     'Reglamento de Aulas Virtuales - TECSUP', >> "%sql_file%"
echo     'Reglamento oficial para el uso y reserva de aulas virtuales en la institución.', >> "%sql_file%"
echo     'general', >> "%sql_file%"
echo     '1.0', >> "%sql_file%"
echo     'activo', >> "%sql_file%"
echo     '/uploads/reglamentos/reglamento_aulas_virtuales_2025.pdf', >> "%sql_file%"
echo     %tamaño%, >> "%sql_file%"
echo     'Administración TECSUP', >> "%sql_file%"
echo     TRUE, >> "%sql_file%"
echo     0, >> "%sql_file%"
echo     0, >> "%sql_file%"
echo     NOW^(^), >> "%sql_file%"
echo     NOW^(^), >> "%sql_file%"
echo     '{\"categoria\": \"institucional\", \"vigencia\": \"2025\"}' >> "%sql_file%"
echo ^); >> "%sql_file%"

echo ✅ Script SQL generado: %sql_file%
echo.

echo ========================================
echo           RESUMEN
echo ========================================
echo Archivo copiado a: %destino%
echo Tamaño del archivo: %tamaño% bytes
echo Script SQL: %sql_file%
echo.
echo SIGUIENTE PASO:
echo Ejecuta el script SQL en tu base de datos:
echo   mysql -u usuario -p basedatos ^< %sql_file%
echo.
echo O copia y pega el contenido del archivo en phpMyAdmin
echo ========================================

pause
