# Actualización de Modelos Django - Migración desde SpringBoot

## Resumen de Cambios

Se han traducido y migrado todos los modelos desde SpringBoot hacia Django, actualizando la estructura de la base de datos y mejorando la organización del código.

## Modelos Actualizados

### Authentication App

#### Modelos Nuevos:
1. **UsuarioCustom** - Extensión del User de Django con campos específicos para Google Auth
2. **Rol** - Sistema de roles personalizado
3. **Departamento** - Departamentos académicos (movido desde aula_virtual)
4. **Carrera** - Carreras académicas (movido desde aula_virtual)
5. **Curso** - Cursos académicos (movido desde aula_virtual)
6. **Perfil** - Perfil de usuario actualizado con relaciones ManyToMany

#### Modelos Eliminados:
- `PerfilDB` → Reemplazado por `Perfil`

### Aula Virtual App

#### Modelos Nuevos:
1. **AulaVirtual** - Aulas virtuales (mejorado desde AulaVirtualDB)
2. **AulaVirtualImagen** - Gestión de imágenes de aulas
3. **AulaVirtualComponente** - Componentes de las aulas virtuales
4. **Reserva** - Sistema de reservas mejorado (desde ReservaDB)
5. **BloqueHorario** - Gestión de bloques horarios
6. **Notificacion** - Sistema de notificaciones
7. **CalendarioInstitucional** - Eventos del calendario institucional
8. **Reglamento** - Gestión de reglamentos institucionales

#### Modelos Eliminados:
- `ProfesorDB` → Funcionalidad integrada en el modelo User/Perfil
- `DepartamentoDB` → Movido a authentication como `Departamento`
- `CarreraDB` → Movido a authentication como `Carrera`
- `CursoDB` → Movido a authentication como `Curso`
- `AulaVirtualDB` → Reemplazado por `AulaVirtual`
- `ReservaDB` → Reemplazado por `Reserva`

## Mejoras Implementadas

### 1. Estructura de Base de Datos
- Nombres de tablas más consistentes (sin sufijo DB)
- Relaciones mejoradas con claves foráneas apropiadas
- Índices optimizados para consultas frecuentes

### 2. Funcionalidades Nuevas
- Sistema de notificaciones integrado
- Gestión de imágenes para aulas virtuales
- Calendario institucional
- Sistema de reglamentos con contadores de visualización/descarga
- Bloques horarios para mejor gestión de disponibilidad

### 3. API REST Mejorada
- ViewSets con filtros avanzados
- Endpoints específicos para acciones (cancelar reserva, marcar notificaciones, etc.)
- Serializers optimizados con información relacionada
- Permisos granulares por usuario

### 4. Seguridad y Permisos
- Control de acceso mejorado
- Separación entre usuarios normales y administradores
- Validaciones en modelos y serializers

## Serializers Actualizados

### Authentication
- `UserSerializer` - Usuario con información completa
- `UsuarioCustomSerializer` - Datos específicos de Google Auth
- `PerfilSerializer` - Perfil con relaciones ManyToMany
- `DepartamentoSerializer`, `CarreraSerializer`, `CursoSerializer`
- `RolSerializer`

### Aula Virtual
- `AulaVirtualSerializer` - Con imágenes y componentes anidados
- `ReservaSerializer` - Con información de cancelación
- `NotificacionSerializer` - Sistema de notificaciones
- `CalendarioInstitucionalSerializer` - Eventos del calendario
- `ReglamentoSerializer` - Con contadores y metadatos

## ViewSets y Endpoints

### Authentication API (`/api/auth/api/`)
- `/departamentos/` - CRUD de departamentos
- `/carreras/` - CRUD de carreras (con filtro por departamento)
- `/cursos/` - CRUD de cursos (con filtro por carrera)
- `/perfiles/` - Gestión de perfiles de usuario
- `/roles/` - Gestión de roles (solo admin)
- `/usuarios-custom/` - Datos personalizados de usuario

### Aula Virtual API (`/api/`)
- `/aulas-virtuales/` - CRUD de aulas virtuales
  - `GET /aulas-virtuales/{id}/disponibilidad/?fecha=YYYY-MM-DD` - Verificar disponibilidad
- `/reservas/` - CRUD de reservas
  - `POST /reservas/{id}/cancelar/` - Cancelar reserva
- `/notificaciones/` - Sistema de notificaciones
  - `POST /notificaciones/{id}/marcar_leida/` - Marcar como leída
  - `POST /notificaciones/marcar_todas_leidas/` - Marcar todas como leídas
- `/reglamentos/` - Gestión de reglamentos
  - `POST /reglamentos/{id}/incrementar_visualizaciones/`
  - `POST /reglamentos/{id}/incrementar_descargas/`

## Pasos para Aplicar las Migraciones

```bash
# Aplicar migraciones de authentication
python manage.py migrate authentication

# Aplicar migraciones de aula_virtual
python manage.py migrate aula_virtual

# Verificar el estado de las migraciones
python manage.py showmigrations
```

## Consideraciones de Migración de Datos

⚠️ **IMPORTANTE**: Estas migraciones cambiarán significativamente la estructura de la base de datos. Se recomienda:

1. Hacer un backup completo de la base de datos antes de aplicar las migraciones
2. Ejecutar las migraciones en un entorno de prueba primero
3. Verificar que todos los datos existentes se migren correctamente
4. Actualizar cualquier código frontend que use las APIs antiguas

## Beneficios de la Nueva Estructura

1. **Mejor organización**: Separación lógica entre autenticación y funcionalidades de aula virtual
2. **Escalabilidad**: Estructura preparada para futuras expansiones
3. **Mantenibilidad**: Código más limpio y fácil de mantener
4. **Funcionalidades avanzadas**: Notificaciones, calendario, reglamentos, etc.
5. **API más robusta**: Endpoints especializados con filtros y acciones específicas
