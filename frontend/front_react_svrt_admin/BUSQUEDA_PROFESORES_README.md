# Funcionalidad de Búsqueda de Profesores

## Nuevas Características Implementadas

### 🔍 **Sistema de Filtros Avanzado**

#### Filtros Disponibles:
1. **Búsqueda por Nombre o Código**
   - Campo de texto libre
   - Busca en nombres, apellidos y código del profesor
   - Búsqueda insensible a mayúsculas/minúsculas

2. **Filtro por Departamento**
   - Dropdown con todos los departamentos disponibles
   - Permite filtrar profesores por departamento específico

3. **Filtro por Carrera**
   - Dropdown con todas las carreras disponibles
   - Muestra profesores que enseñan en una carrera específica

### 🎯 **Características de la Búsqueda**

#### Filtrado Combinado:
- Los filtros se pueden combinar (nombre + departamento + carrera)
- La búsqueda se actualiza en tiempo real
- Filtrado tipo AND (todos los criterios deben cumplirse)

#### Indicadores Visuales:
- **Etiquetas de filtros activos**: Muestra qué filtros están aplicados
- **Contador de resultados**: Indica cuántos profesores se encontraron
- **Mensajes contextuales**: Diferentes mensajes según el estado

### 🎨 **Interfaz de Usuario**

#### Panel de Filtros:
```
┌─────────────────────────────────────────────────────┐
│ 🔍 Filtros de Búsqueda                              │
├─────────────────────────────────────────────────────┤
│ [Nombre/Código] [Departamento▼] [Carrera▼]         │
│                                                     │
│ Filtros activos: [Nombre: "Juan"] [Depto: Sistemas] │
│                                [Limpiar Filtros]    │
└─────────────────────────────────────────────────────┘
```

#### Estados de Resultados:
- **Sin filtros**: "Mostrando todos los profesores (X)"
- **Con filtros**: "Mostrando X de Y profesores"
- **Sin resultados**: Mensaje con opción de limpiar filtros

### 💡 **Casos de Uso**

1. **Buscar profesor específico**:
   - Escribir nombre o código en el campo de búsqueda

2. **Ver profesores de un departamento**:
   - Seleccionar departamento en el dropdown

3. **Encontrar profesores de una carrera**:
   - Seleccionar carrera en el dropdown

4. **Búsqueda combinada**:
   - Ejemplo: Profesores del departamento "Sistemas" que enseñan "Ingeniería de Software"

### 🔧 **Funcionalidades Técnicas**

#### Filtrado en Tiempo Real:
```javascript
const filteredProfesores = profesores.filter(profesor => {
  const matchesNombre = // Búsqueda en nombre/código
  const matchesDepartamento = // Filtro por departamento
  const matchesCarrera = // Filtro por carrera
  return matchesNombre && matchesDepartamento && matchesCarrera;
});
```

#### Gestión de Estado:
- Estado centralizado para todos los filtros
- Función de limpieza de filtros
- Actualización reactiva de resultados

### 📱 **Responsive Design**
- Grid adaptativo de filtros (1-3 columnas según pantalla)
- Etiquetas de filtros que se adaptan al espacio disponible
- Botones y controles optimizados para móvil

### 🎯 **Mejoras de UX**
- **Placeholder descriptivo**: "Buscar por nombre o código..."
- **Feedback inmediato**: Resultados se actualizan al escribir
- **Limpieza fácil**: Botón para quitar todos los filtros
- **Estado visual**: Etiquetas coloradas por tipo de filtro
