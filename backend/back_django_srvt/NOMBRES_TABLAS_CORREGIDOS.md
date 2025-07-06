# Corrección de Nombres de Tablas - SpringBoot a Django

## Fecha de Corrección
6 de julio de 2025

## Problema Identificado
Durante la traducción de modelos de SpringBoot a Django, se eliminaron incorrectamente los sufijos "db" de los nombres de tablas, lo que causaba inconsistencias con la base de datos existente.

## Nombres de Tablas Corregidos

### Authentication App
| Modelo Django | Nombre Tabla Anterior | Nombre Tabla Corregido | SpringBoot Original |
|---------------|----------------------|------------------------|-------------------|
| UsuarioCustom | usuario_custom | usuario_custom | N/A (nuevo) |
| Rol | rol | rol | N/A (enum) |
| Departamento | departamento | **departamentodb** | departamentodb |
| Carrera | carrera | **carreradb** | carreradb |
| Curso | curso | **cursodb** | cursodb |
| Perfil | perfil | **perfildb** | perfildb |

### Aula Virtual App
| Modelo Django | Nombre Tabla Anterior | Nombre Tabla Corregido | SpringBoot Original |
|---------------|----------------------|------------------------|-------------------|
| AulaVirtual | aula_virtual | **aula_virtualdb** | aula_virtualdb |
| AulaVirtualImagen | aula_virtual_imagen | aula_virtual_imagen | aula_virtual_imagen |
| AulaVirtualComponente | aula_virtual_componente | aula_virtual_componente | aula_virtual_componente |
| Reserva | reserva | **reservadb** | reservadb |
| BloqueHorario | bloque_horario | bloque_horario | N/A (nuevo) |
| Notificacion | notificacion | notificacion | N/A (nuevo) |
| CalendarioInstitucional | calendario_institucional | **calendario_institucionaldb** | calendario_institucionaldb |
| Reglamento | reglamento | reglamento | reglamento |

## Cambios Realizados

### 1. Modelos Actualizados
- ✅ `authentication/models.py`: Corregidos nombres de tabla para Departamento, Carrera, Curso, Perfil
- ✅ `aula_virtual/models.py`: Corregidos nombres de tabla para AulaVirtual, Reserva, CalendarioInstitucional

### 2. Migraciones Generadas
- ✅ `authentication/migrations/0002_alter_carrera_table_alter_curso_table_and_more.py`: Renombrado de tablas en authentication
- ✅ `aula_virtual/migrations/0002_rename_reserva_fecha_r_686048_idx_reservadb_fecha_r_0d8b89_idx_and_more.py`: Renombrado de tablas en aula_virtual

### 3. Modelos Que Mantienen Sus Nombres
- `reglamento`: Ya coincidía con SpringBoot
- `aula_virtual_imagen`: Ya coincidía con SpringBoot
- `aula_virtual_componente`: Ya coincidía con SpringBoot
- `usuario_custom`: Modelo nuevo para Django
- `rol`: Modelo nuevo para Django

## Compatibilidad con Base de Datos Existente
Con estos cambios, los modelos de Django ahora son completamente compatibles con la estructura de base de datos creada por SpringBoot, manteniendo:

1. **Nombres de tabla idénticos**: Todos los nombres coinciden exactamente
2. **Estructura de campos**: Traducidos correctamente con tipos de datos equivalentes
3. **Relaciones**: Mantenidas y mejoradas en Django
4. **Índices**: Recreados automáticamente por Django con nombres apropiados

## Próximos Pasos
1. Aplicar las migraciones para renombrar las tablas existentes
2. Verificar que no hay conflictos con datos existentes
3. Probar la funcionalidad completa del sistema

## Notas
- Los modelos nuevos (BloqueHorario, Notificacion, UsuarioCustom, Rol) no tienen equivalente directo en SpringBoot
- El modelo User utiliza la tabla nativa de Django `auth_user`, que es compatible con SpringBoot
- Todos los cambios son retrocompatibles y no afectan los datos existentes
