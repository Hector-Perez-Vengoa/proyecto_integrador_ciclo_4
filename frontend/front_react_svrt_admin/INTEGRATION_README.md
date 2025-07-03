# Frontend React Admin - APIs Integradas

Este frontend de React Admin ahora está completamente integrado con las APIs de Django del backend.

## 🚀 APIs Disponibles

El sistema incluye gestión completa de las siguientes entidades:

### 1. **Profesores** (`/api/profesores/`)
- **Crear, Editar, Eliminar** profesores
- **Campos**: código, nombres, apellidos, correo, departamento, carreras, cursos
- **Relaciones**: Con departamentos, carreras y cursos

### 2. **Aulas Virtuales** (`/api/aula-virtual/`)
- **Gestión completa** de aulas virtuales
- **Campos**: código, descripción, estado
- **Estados**: disponible, reservada, en_uso, en_mantenimiento, inactiva, bloqueada

### 3. **Reservas** (`/api/reservas/`)
- **Sistema de reservas** completo
- **Campos**: profesor, aula_virtual, curso, fecha_reserva, hora_inicio, hora_fin, motivo, estado
- **Validación**: Solo aulas disponibles pueden ser reservadas

### 4. **Departamentos** (`/api/departamentos/`)
- **Gestión** de departamentos académicos
- **Campos**: nombre, descripción, jefe

### 5. **Carreras** (`/api/carreras/`)
- **Administración** de carreras académicas
- **Campos**: código, nombre, descripción, departamento
- **Relación**: Con departamentos

### 6. **Cursos** (`/api/cursos/`)
- **Gestión** de cursos
- **Campos**: nombre, descripción, duración, fecha, carrera
- **Relación**: Con carreras

## 🛠️ Funcionalidades Implementadas

### ✅ **Operaciones CRUD Completas**
- **Crear**: Formularios modales para cada entidad
- **Leer**: Tablas con datos en tiempo real
- **Actualizar**: Edición inline con formularios pre-poblados
- **Eliminar**: Confirmación antes de eliminar

### ✅ **Interfaz de Usuario**
- **Componente DataTable**: Tabla genérica reutilizable
- **Modales de formulario**: Para crear/editar entidades
- **Estados de carga**: Spinners y mensajes de error
- **Validación**: Campos requeridos y validación de tipos

### ✅ **Gestión de Estado**
- **Hooks personalizados**: `useApi`, `useEntities`
- **Estado global**: Para cada entidad del sistema
- **Actualización automática**: Cuando se realizan cambios

### ✅ **Integración con APIs**
- **Servicios API**: En `/src/services/api.js`
- **Configuración centralizada**: URL base configurable
- **Manejo de errores**: Try-catch en todas las operaciones

## 📁 Estructura de Archivos

```
src/
├── services/
│   └── api.js                    # Servicios para todas las APIs
├── hooks/
│   ├── useApi.js                 # Hook genérico para CRUD
│   └── useEntities.js            # Hooks específicos por entidad
├── components/
│   ├── DataTable.jsx             # Tabla genérica reutilizable
│   └── entities/
│       ├── ProfesoresManager.jsx
│       ├── AulasVirtualesManager.jsx
│       ├── ReservasManager.jsx
│       ├── DepartamentosManager.jsx
│       ├── CarrerasManager.jsx
│       └── CursosManager.jsx
└── pages/
    └── Dashboard.jsx             # Dashboard principal integrado
```

## 🔧 Configuración

### Backend Django
Asegúrate de que el servidor Django esté ejecutándose en:
```
http://localhost:8000/
```

### Frontend React
El frontend estará disponible en:
```
http://localhost:5173/
```

## 🎯 Navegación del Dashboard

El dashboard incluye un sidebar con las siguientes secciones:

1. **Dashboard** - Vista general con estadísticas
2. **Profesores** - Gestión de profesores
3. **Aulas Virtuales** - Administración de aulas
4. **Reservas** - Sistema de reservas
5. **Departamentos** - Gestión de departamentos
6. **Carreras** - Administración de carreras
7. **Cursos** - Gestión de cursos
8. **Reportes** - Módulo futuro

## 🚦 Uso del Sistema

### Crear una Nueva Entidad
1. Navega a la sección correspondiente en el sidebar
2. Haz clic en "Agregar Nuevo"
3. Completa el formulario modal
4. Haz clic en "Crear"

### Editar una Entidad
1. En la tabla, haz clic en "Editar" para la fila deseada
2. Modifica los campos en el formulario modal
3. Haz clic en "Actualizar"

### Eliminar una Entidad
1. En la tabla, haz clic en "Eliminar" para la fila deseada
2. Confirma la acción en el diálogo de confirmación

## 🔍 Características Técnicas

### Componente DataTable
- **Props**: `data`, `columns`, `loading`, `error`, `onEdit`, `onDelete`, `onAdd`, `title`
- **Características**: Responsive, estados de carga, manejo de errores

### Hook useApi
- **Funciones**: `fetchData`, `createItem`, `updateItem`, `deleteItem`
- **Estados**: `data`, `loading`, `error`
- **Manejo**: Automático de estados de carga y errores

### Servicios API
- **Configuración**: URL base configurable
- **Métodos**: GET, POST, PUT, DELETE para cada entidad
- **Headers**: Content-Type automático

## 🚨 Manejo de Errores

El sistema incluye manejo robusto de errores:
- **Errores de red**: Mostrados en la interfaz
- **Errores de validación**: Mensajes específicos
- **Estados de carga**: Indicadores visuales
- **Confirmaciones**: Para operaciones destructivas

## 🔄 Actualizaciones en Tiempo Real

- Los datos se actualizan automáticamente después de cada operación
- Las estadísticas del dashboard se recalculan cuando cambian los datos
- Los formularios se resetean después de crear/editar

## 🎨 Estilos y UI

- **Tailwind CSS**: Para estilos modernos y responsivos
- **Gradientes**: Para elementos destacados
- **Sombras**: Para profundidad visual
- **Animaciones**: Transiciones suaves
- **Iconos SVG**: Para una interfaz limpia

## 📱 Responsive Design

El sistema es completamente responsive:
- **Mobile**: Diseño adaptado para móviles
- **Tablet**: Layout optimizado para tablets
- **Desktop**: Interfaz completa para escritorio

---

¡El sistema está listo para usar! Todas las APIs de Django están integradas y funcionando en el frontend de React Admin.
