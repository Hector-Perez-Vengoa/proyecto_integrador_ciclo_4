# 📋 GUÍA PARA SUBIR REGLAMENTO PDF AL SISTEMA

## 🎯 **PASO 1: Preparar el archivo PDF**

### Ubicación del archivo:
1. Coloca tu archivo PDF en la carpeta de uploads del proyecto:
   ```
   proyecto_integrador_ciclo_4/uploads/reglamentos/
   ```

2. Renombra tu archivo para que tenga un nombre descriptivo:
   ```
   reglamento_aulas_virtuales_2025.pdf
   ```

## 🗂️ **PASO 2: Crear la estructura de carpetas**

```bash
# Ejecutar desde la raíz del proyecto
mkdir -p uploads/reglamentos
```

O manualmente:
- Crear carpeta `uploads` (si no existe)
- Crear subcarpeta `reglamentos` dentro de uploads

## 🗃️ **PASO 3: Insertar en la base de datos**

### Opción A: Usando phpMyAdmin o similar
1. Abre tu gestor de base de datos
2. Selecciona tu base de datos del proyecto
3. Ejecuta el script SQL: `scripts/insertar_reglamento.sql`

### Opción B: Desde línea de comandos MySQL
```bash
mysql -u usuario -p nombre_base_datos < scripts/insertar_reglamento.sql
```

### Opción C: Usando un cliente GUI como HeidiSQL, DBeaver, etc.
1. Conecta a tu base de datos
2. Abre y ejecuta el archivo `insertar_reglamento.sql`

## ⚙️ **PASO 4: Configurar Spring Boot para servir archivos**

Agregar en `application.properties` o `application.yml`:

```properties
# Configuración para servir archivos estáticos
spring.web.resources.static-locations=classpath:/static/,file:uploads/
spring.servlet.multipart.max-file-size=50MB
spring.servlet.multipart.max-request-size=50MB

# Ruta base para archivos
app.upload.dir=uploads/reglamentos/
```

## 🔧 **PASO 5: Actualizar datos en el script SQL**

Antes de ejecutar el SQL, actualiza estos valores en `insertar_reglamento.sql`:

1. **ruta_archivo**: Cambia por la ruta real de tu archivo
   ```sql
   '/uploads/reglamentos/TU_ARCHIVO.pdf'
   ```

2. **tamaño_archivo**: Obtén el tamaño real de tu PDF (en bytes)
   - Clic derecho en el archivo → Propiedades
   - Usar el valor en bytes

3. **titulo**: Personaliza el título
   ```sql
   'Reglamento de Aulas Virtuales - TECSUP 2025'
   ```

4. **descripcion**: Describe el contenido
   ```sql
   'Reglamento oficial que establece las normas para...'
   ```

## 📁 **ESTRUCTURA FINAL ESPERADA:**

```
proyecto_integrador_ciclo_4/
├── uploads/
│   └── reglamentos/
│       └── reglamento_aulas_virtuales_2025.pdf  ← Tu archivo aquí
├── scripts/
│   └── insertar_reglamento.sql  ← Script para DB
└── ...resto del proyecto
```

## ✅ **PASO 6: Verificar que funciona**

1. **Verificar en base de datos:**
   ```sql
   SELECT * FROM reglamento WHERE estado = 'activo';
   ```

2. **Probar desde el frontend:**
   - Ir a `/home/reglamento`
   - Debería mostrar tu reglamento
   - Probar visualización y descarga

3. **Verificar URLs de acceso:**
   - Ver: `http://localhost:8080/api/reglamentos/1/view`
   - Descargar: `http://localhost:8080/api/reglamentos/1/download`

## 🚨 **TROUBLESHOOTING**

### Si no se ve el PDF:
1. Verificar que el archivo existe en la ruta especificada
2. Verificar permisos de lectura del archivo
3. Comprobar configuración de Spring Boot para servir archivos estáticos

### Si el PDF no se descarga:
1. Verificar que el tamaño del archivo en DB coincide con el real
2. Comprobar configuración de CORS en Spring Boot
3. Verificar que el controlador está mapeando correctamente las rutas

## 📝 **EJEMPLO DE COMANDO COMPLETO:**

```bash
# 1. Crear carpetas
mkdir -p uploads/reglamentos

# 2. Copiar tu PDF
cp /ruta/a/tu/archivo.pdf uploads/reglamentos/reglamento_aulas_virtuales_2025.pdf

# 3. Obtener tamaño del archivo (Linux/Mac)
ls -la uploads/reglamentos/reglamento_aulas_virtuales_2025.pdf

# 4. Ejecutar script SQL
mysql -u root -p tu_base_datos < scripts/insertar_reglamento.sql
```

¡Listo! Tu reglamento estará disponible en el sistema.
