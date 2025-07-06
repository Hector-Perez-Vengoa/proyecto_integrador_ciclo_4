# Migración de Profesores a Perfiles - Documentación

## Resumen de Cambios

Este documento describe los cambios realizados para migrar de la tabla `profesores` al modelo `Perfil` en el sistema de gestión de aulas virtuales.

## Cambios en Modelos (authentication/models.py)

### Modelo Perfil Actualizado
- ✅ **Campo `user`**: OneToOneField con User de Django
- ✅ **Campos de perfil**: imagen_perfil, telefono, biografia, fecha_nacimiento
- ✅ **Relaciones académicas**: departamento (ForeignKey), carreras y cursos (ManyToMany)
- ✅ **Metadata**: tabla 'perfildb', auto_now en fecha_actualizacion
- ✅ **Propiedades**: nombre_completo, perfil_completo()

## Cambios en Serializers (authentication/serializers.py)

### PerfilSerializer Mejorado
- ✅ **Campos expandidos**: Incluye datos del usuario y relaciones
- ✅ **Campos calculados**: nombre_completo, carreras_nombres, cursos_nombres
- ✅ **Manejo robusto**: Try-catch para evitar errores en relaciones
- ✅ **Actualización**: Maneja tanto datos del perfil como del usuario

### Nuevo PerfilCreateSerializer
- ✅ **Creación completa**: Crea usuario y perfil en una operación
- ✅ **Validación**: Incluye campos obligatorios del usuario
- ✅ **Relaciones**: Maneja ManyToMany correctamente

## Cambios en Views (authentication/views.py)

### PerfilViewSet Mejorado
- ✅ **Filtros avanzados**: Por departamento, carrera, estado activo
- ✅ **Optimización**: Select_related y prefetch_related
- ✅ **Permisos**: Diferencia entre usuarios normales y admins
- ✅ **Serializers dinámicos**: Usa PerfilCreateSerializer para creación

## Cambios en URLs

### authentication/urls.py
- ✅ **Endpoint perfiles**: `/api/auth/api/perfiles/`
- ✅ **Alias profesores**: `/api/auth/api/profesores/` (compatibilidad)

### config/urls.py
- ✅ **Compatibilidad global**: `/api/profesores/` redirige a perfiles
- ✅ **Router centralizado**: Manejo unificado de rutas

### config/views.py
- ✅ **API root actualizada**: Muestra todas las rutas disponibles
- ✅ **Documentación clara**: Organizada por categorías

## Endpoints Disponibles

### APIs de Autenticación
- `POST /api/auth/login/` - Login de usuarios
- `POST /api/auth/logout/` - Logout
- `GET /api/auth/check/` - Verificar autenticación
- `GET /api/auth/csrf/` - Obtener token CSRF

### APIs de Gestión de Usuarios
- `GET|POST|PUT|DELETE /api/auth/api/perfiles/` - Gestión de perfiles
- `GET|POST|PUT|DELETE /api/profesores/` - Alias para perfiles (compatibilidad)
- `GET|POST|PUT|DELETE /api/auth/api/departamentos/` - Gestión de departamentos
- `GET|POST|PUT|DELETE /api/auth/api/carreras/` - Gestión de carreras
- `GET|POST|PUT|DELETE /api/auth/api/cursos/` - Gestión de cursos
- `GET|POST|PUT|DELETE /api/auth/api/roles/` - Gestión de roles
- `GET|POST|PUT|DELETE /api/auth/api/usuarios-custom/` - Usuarios personalizados

### Filtros Disponibles
- `?departamento_id=1` - Filtrar por departamento
- `?carrera_id=1` - Filtrar por carrera
- `?activo=true/false` - Filtrar por estado activo

## Comandos para Aplicar Cambios

### En Windows:
```batch
cd backend\back_django_srvt
python manage.py makemigrations authentication
python manage.py migrate
python manage.py runserver
```

### En Linux/Mac:
```bash
cd backend/back_django_srvt
python manage.py makemigrations authentication
python manage.py migrate
python manage.py runserver
```

## Testing de APIs

### Obtener lista de perfiles:
```bash
curl -X GET http://localhost:8000/api/auth/api/perfiles/
curl -X GET http://localhost:8000/api/profesores/  # Alias
```

### Crear un nuevo perfil:
```bash
curl -X POST http://localhost:8000/api/auth/api/perfiles/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "profesor1",
    "email": "profesor1@tecsup.edu.pe",
    "password": "password123",
    "first_name": "Juan",
    "last_name": "Pérez",
    "telefono": "123456789",
    "biografia": "Profesor de Ingeniería de Sistemas"
  }'
```

## Migración de Datos Existentes

Si tienes datos existentes en la tabla `profesores`, necesitarás:

1. **Crear un script de migración** para transferir datos
2. **Mapear campos** de la estructura antigua a la nueva
3. **Verificar relaciones** entre usuarios y perfiles
4. **Ejecutar validaciones** post-migración

## Notas Importantes

- ✅ **Compatibilidad**: El endpoint `/api/profesores/` sigue funcionando
- ✅ **Permisos**: Los usuarios normales solo ven su propio perfil
- ✅ **Validaciones**: Se mantienen todas las validaciones originales
- ✅ **Optimización**: Queries optimizadas con select_related
- ✅ **Extensibilidad**: Fácil agregar nuevos campos al perfil

## Próximos Pasos

1. **Ejecutar migraciones** en el entorno de desarrollo
2. **Probar todas las APIs** con datos reales
3. **Actualizar frontend** si es necesario
4. **Documentar cambios** para el equipo
5. **Planificar migración** en producción
