# 📊 Diagramas de Flujo - Sistema de Reservas

## 🏗️ Arquitectura General del Sistema

```mermaid
graph TB
    subgraph "Cliente Kotlin"
        A[Activity/Fragment]
        B[ViewModel]
        C[Repository]
        D[API Service]
    end
    
    subgraph "Interceptores"
        E[Auth Interceptor]
        F[Logging Interceptor]
    end
    
    subgraph "Backend Spring Boot"
        G[Controllers]
        H[Services]
        I[Repositories]
        J[Security]
    end
    
    subgraph "Base de Datos"
        K[(PostgreSQL)]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> K
    
    J --> G
```

## 🔐 Flujo de Autenticación Completo

```mermaid
sequenceDiagram
    participant U as Usuario
    participant K as App Kotlin
    participant B as Backend
    participant DB as Database
    participant G as Google OAuth
    
    Note over U,G: Caso 1: Login Normal
    U->>K: Ingresa email/password
    K->>K: Validar formato @tecsup.edu.pe
    K->>B: POST /api/auth/signin
    B->>DB: Verificar credenciales
    DB-->>B: Usuario válido
    B->>B: Generar JWT token
    B-->>K: AuthResponse + JWT
    K->>K: Guardar token y datos
    K-->>U: Navegar a pantalla principal
    
    Note over U,G: Caso 2: Login con Google
    U->>K: Selecciona "Login con Google"
    K->>G: Solicitar autenticación
    G-->>K: Google OAuth token
    K->>B: POST /api/auth/google
    B->>G: Validar token con Google
    G-->>B: Datos del usuario verificados
    B->>DB: Crear/actualizar usuario
    B->>B: Generar JWT token
    B-->>K: AuthResponse + JWT
    K->>K: Guardar token y datos
    K-->>U: Navegar a pantalla principal
```

## 📅 Flujo Completo de Creación de Reserva

```mermaid
flowchart TD
    Start([Usuario quiere hacer reserva]) --> CheckAuth{¿Usuario autenticado?}
    CheckAuth -->|No| Login[Redirigir a Login]
    CheckAuth -->|Sí| LoadAulas[GET /api/aulas/disponibles]
    
    LoadAulas --> ShowAulas[Mostrar lista de aulas]
    ShowAulas --> SelectAula[Usuario selecciona aula]
    SelectAula --> SelectDate[Usuario selecciona fecha]
    
    SelectDate --> CheckBlocked[GET /api/calendario/fechas-bloqueadas]
    CheckBlocked --> ValidateDate{¿Fecha válida?}
    ValidateDate -->|No| ShowError1[Mostrar error: Fecha bloqueada]
    ValidateDate -->|Sí| SelectTime[Usuario selecciona hora]
    
    SelectTime --> CheckAvailability[GET /api/reservas/disponibilidad]
    CheckAvailability --> ValidateTime{¿Horario disponible?}
    ValidateTime -->|No| ShowError2[Mostrar horarios sugeridos]
    ValidateTime -->|Sí| LoadCourses[GET /api/perfil/mis-cursos]
    
    LoadCourses --> SelectCourse[Usuario selecciona curso]
    SelectCourse --> FillForm[Usuario completa formulario]
    FillForm --> ValidateForm{¿Formulario válido?}
    ValidateForm -->|No| ShowValidationErrors[Mostrar errores de validación]
    ValidateForm -->|Sí| SubmitReserva[POST /api/reservas]
    
    SubmitReserva --> ProcessResult{¿Reserva exitosa?}
    ProcessResult -->|No| ShowSubmitError[Mostrar error del servidor]
    ProcessResult -->|Sí| ShowSuccess[Mostrar confirmación]
    ShowSuccess --> UpdateList[Actualizar lista de reservas]
    UpdateList --> End([Fin])
    
    ShowError1 --> SelectDate
    ShowError2 --> SelectTime
    ShowValidationErrors --> FillForm
    ShowSubmitError --> FillForm
    Login --> LoadAulas
```

## 👤 Flujo de Gestión de Perfil

```mermaid
stateDiagram-v2
    [*] --> VerPerfil
    VerPerfil --> CargandoPerfil : GET /api/perfil
    CargandoPerfil --> MostrarPerfil : Éxito
    CargandoPerfil --> ErrorCarga : Error
    
    MostrarPerfil --> EditarPerfil : Usuario edita
    MostrarPerfil --> CambiarImagen : Usuario cambia foto
    MostrarPerfil --> [*] : Salir
    
    EditarPerfil --> ValidandoEdicion : Validar datos
    ValidandoEdicion --> GuardandoEdicion : Datos válidos
    ValidandoEdicion --> ErrorValidacion : Datos inválidos
    GuardandoEdicion --> MostrarPerfil : PUT /api/perfil exitoso
    GuardandoEdicion --> ErrorGuardado : Error al guardar
    
    CambiarImagen --> SubiendoImagen : POST /api/perfil/imagen
    SubiendoImagen --> MostrarPerfil : Éxito
    SubiendoImagen --> ErrorImagen : Error
    
    ErrorCarga --> VerPerfil : Reintentar
    ErrorValidacion --> EditarPerfil : Corregir datos
    ErrorGuardado --> EditarPerfil : Reintentar
    ErrorImagen --> CambiarImagen : Reintentar
```

## 🔄 Flujo de Manejo de Tokens JWT

```mermaid
flowchart TD
    AppStart([App Inicia]) --> CheckToken{¿Token guardado existe?}
    CheckToken -->|No| ShowLogin[Mostrar Login]
    CheckToken -->|Sí| ValidateToken[Validar token]
    
    ValidateToken --> MakeRequest[Hacer petición con token]
    MakeRequest --> CheckResponse{¿Respuesta?}
    CheckResponse -->|200 OK| Success[Continuar normal]
    CheckResponse -->|401 Unauthorized| ExpiredToken[Token expirado]
    CheckResponse -->|403 Forbidden| NoPermission[Sin permisos]
    CheckResponse -->|500+ Error| ServerError[Error servidor]
    
    ExpiredToken --> ClearToken[Limpiar token guardado]
    ClearToken --> ShowLogin
    
    NoPermission --> ShowError[Mostrar error permisos]
    ServerError --> RetryOption{¿Reintentar?}
    RetryOption -->|Sí| MakeRequest
    RetryOption -->|No| ShowError
    
    ShowLogin --> LoginSuccess{¿Login exitoso?}
    LoginSuccess -->|Sí| SaveNewToken[Guardar nuevo token]
    LoginSuccess -->|No| ShowLogin
    SaveNewToken --> Success
    
    Success --> End([Continuar con la app])
    ShowError --> End
```

## 📋 Flujo de Lista de Reservas con Paginación

```mermaid
sequenceDiagram
    participant U as Usuario
    participant K as App Kotlin
    participant B as Backend
    participant DB as Database
    
    U->>K: Abrir "Mis Reservas"
    K->>B: GET /api/reservas/mis-reservas?page=0&size=10
    B->>DB: Consultar reservas paginadas
    DB-->>B: Lista de reservas (página 1)
    B-->>K: Respuesta con reservas + metadata
    K->>K: Mostrar lista inicial
    K-->>U: Mostrar primeras 10 reservas
    
    Note over U,DB: Usuario hace scroll para cargar más
    U->>K: Scroll hasta el final
    K->>K: Detectar necesidad de más datos
    K->>B: GET /api/reservas/mis-reservas?page=1&size=10
    B->>DB: Consultar siguiente página
    DB-->>B: Lista de reservas (página 2)
    B-->>K: Más reservas
    K->>K: Agregar a lista existente
    K-->>U: Mostrar reservas adicionales
    
    Note over U,DB: Usuario aplica filtros
    U->>K: Selecciona filtro por estado
    K->>B: GET /api/reservas/mis-reservas?page=0&size=10&estado=CONFIRMADA
    B->>DB: Consultar con filtros
    DB-->>B: Reservas filtradas
    B-->>K: Lista filtrada
    K->>K: Reemplazar lista actual
    K-->>U: Mostrar reservas filtradas
```

## ❌ Flujo de Cancelación de Reserva

```mermaid
flowchart TD
    Start([Usuario selecciona reserva]) --> CheckStatus{¿Reserva cancelable?}
    CheckStatus -->|No| ShowNotCancelable[Mostrar: No se puede cancelar]
    CheckStatus -->|Sí| ShowConfirmDialog[Mostrar diálogo de confirmación]
    
    ShowConfirmDialog --> UserChoice{¿Usuario confirma?}
    UserChoice -->|No| Cancel[Cancelar acción]
    UserChoice -->|Sí| ShowReasonDialog[Mostrar diálogo para motivo]
    
    ShowReasonDialog --> ValidateReason{¿Motivo válido?}
    ValidateReason -->|No| ShowReasonError[Mostrar error: Motivo requerido]
    ValidateReason -->|Sí| SubmitCancellation[DELETE /api/reservas/{id}/cancelar]
    
    SubmitCancellation --> ProcessResponse{¿Éxito?}
    ProcessResponse -->|No| ShowCancelError[Mostrar error de cancelación]
    ProcessResponse -->|Sí| ShowCancelSuccess[Mostrar confirmación]
    
    ShowCancelSuccess --> UpdateLocalList[Actualizar lista local]
    UpdateLocalList --> NotifyUser[Notificar cambio de estado]
    NotifyUser --> End([Fin])
    
    ShowNotCancelable --> End
    Cancel --> End
    ShowReasonError --> ShowReasonDialog
    ShowCancelError --> End
```

## 🔍 Flujo de Búsqueda de Aulas con Filtros

```mermaid
graph TD
    A[Usuario abre buscador] --> B[Cargar filtros por defecto]
    B --> C[Mostrar formulario de búsqueda]
    
    C --> D[Usuario modifica filtros]
    D --> E{¿Fecha seleccionada?}
    E -->|No| F[Mostrar error: Fecha requerida]
    E -->|Sí| G{¿Horario válido?}
    
    G -->|No| H[Mostrar error: Horario inválido]
    G -->|Sí| I[POST /api/aulas/buscar]
    
    I --> J{¿Respuesta exitosa?}
    J -->|No| K[Mostrar error de búsqueda]
    J -->|Sí| L{¿Aulas encontradas?}
    
    L -->|No| M[Mostrar: No hay aulas disponibles]
    L -->|Sí| N[Mostrar resultados]
    
    N --> O[Usuario selecciona aula]
    O --> P[Navegar a crear reserva]
    
    F --> D
    H --> D
    K --> D
    M --> Q[Sugerir modificar filtros]
    Q --> D
```

## 🔔 Flujo de Notificaciones

```mermaid
stateDiagram-v2
    [*] --> CheckNotificationStatus
    CheckNotificationStatus --> LoadingStatus : GET /api/reservas/notificaciones/estado
    LoadingStatus --> ShowNotifications : Notificaciones habilitadas
    LoadingStatus --> NotificationsDisabled : Notificaciones deshabilitadas
    LoadingStatus --> ErrorLoading : Error de carga
    
    ShowNotifications --> PendingNotifications : Hay notificaciones
    ShowNotifications --> NoNotifications : Sin notificaciones
    
    PendingNotifications --> ShowNotificationList : Mostrar lista
    ShowNotificationList --> MarkAsRead : Usuario lee notificación
    MarkAsRead --> UpdateStatus : Actualizar estado
    UpdateStatus --> ShowNotificationList : Volver a lista
    
    NoNotifications --> RefreshNotifications : Usuario actualiza
    RefreshNotifications --> LoadingStatus
    
    NotificationsDisabled --> EnableOption : Mostrar opción habilitar
    EnableOption --> EnableNotifications : Usuario habilita
    EnableNotifications --> ShowNotifications
    
    ErrorLoading --> RetryOption : Mostrar opción reintentar
    RetryOption --> CheckNotificationStatus
```

## 📊 Manejo de Estados de la App

```mermaid
stateDiagram-v2
    [*] --> AppLaunching
    AppLaunching --> CheckingAuth : Verificar autenticación
    
    CheckingAuth --> Authenticated : Token válido
    CheckingAuth --> NotAuthenticated : Sin token/Token inválido
    
    NotAuthenticated --> LoginScreen : Mostrar login
    LoginScreen --> Authenticating : Usuario ingresa credenciales
    Authenticating --> Authenticated : Login exitoso
    Authenticating --> LoginError : Error de login
    LoginError --> LoginScreen : Mostrar error
    
    Authenticated --> MainScreen : Cargar pantalla principal
    MainScreen --> ProfileScreen : Ver perfil
    MainScreen --> ReservationsScreen : Ver reservas
    MainScreen --> CreateReservationScreen : Crear reserva
    MainScreen --> SettingsScreen : Configuración
    
    ProfileScreen --> EditingProfile : Editar perfil
    EditingProfile --> ProfileScreen : Guardar cambios
    
    ReservationsScreen --> ReservationDetail : Ver detalle
    ReservationDetail --> CancellingReservation : Cancelar reserva
    CancellingReservation --> ReservationsScreen : Reserva cancelada
    
    CreateReservationScreen --> CreatingReservation : Enviar reserva
    CreatingReservation --> ReservationsScreen : Reserva creada
    CreatingReservation --> CreateReservationScreen : Error en creación
    
    note right of Authenticated
        En cualquier pantalla autenticada,
        si se recibe 401, regresar a
        NotAuthenticated
    end note
```

Estos diagramas proporcionan una guía visual completa para entender todos los flujos principales del sistema y facilitarán la implementación en la aplicación Kotlin.
