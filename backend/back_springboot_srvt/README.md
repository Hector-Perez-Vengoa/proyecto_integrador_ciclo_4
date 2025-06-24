# 📚 Sistema de Reservas de Aulas Virtuales - TECSUP

## 🚀 Documentación Completa del Backend

Este es un sistema completo de reservas de aulas virtuales desarrollado con **Spring Boot** para el Instituto TECSUP. El backend ha sido completamente refactorizado siguiendo principios de **Clean Architecture** y mejores prácticas de desarrollo.

---

## 📋 Índice de Documentación

### 📖 Documentación Principal
1. **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Guía completa de la API REST
2. **[FLOW_DIAGRAMS.md](./FLOW_DIAGRAMS.md)** - Diagramas de flujo del sistema
3. **[KOTLIN_EXAMPLES.md](./KOTLIN_EXAMPLES.md)** - Ejemplos prácticos para integración Android
4. **[SECURITY_DOCUMENTATION.md](./SECURITY_DOCUMENTATION.md)** - Implementación de seguridad

### 📝 Documentación Técnica
- **[CORRECCIONES_REALIZADAS.md](../../CORRECCIONES_REALIZADAS.md)** - Correcciones implementadas
- **[RESTRICCIONES_CALENDARIO_IMPLEMENTADAS.md](../../RESTRICCIONES_CALENDARIO_IMPLEMENTADAS.md)** - Restricciones del calendario

---

## 🏗️ Arquitectura del Proyecto

```
backend/back_springboot_srvt/
├── src/main/java/com/tecsup/back_springboot_srvt/
│   ├── controller/          # Controladores REST (Solo delegación)
│   ├── service/            # Lógica de negocio
│   ├── repository/         # Acceso a datos
│   ├── model/             # Entidades JPA
│   ├── dto/               # DTOs para requests/responses
│   ├── security/          # Configuración de seguridad JWT
│   └── config/            # Configuraciones Spring
├── src/main/resources/
│   ├── application.properties
│   └── static/
└── target/                # Archivos compilados
```

---

## ✨ Características Principales

### 🔐 Autenticación y Autorización
- ✅ **JWT Authentication** - Tokens seguros con expiración
- ✅ **Google OAuth Integration** - Login con cuentas Google @tecsup.edu.pe
- ✅ **BCrypt Password Hashing** - Contraseñas encriptadas de forma segura
- ✅ **Role-based Authorization** - Control de acceso por roles

### 👤 Gestión de Usuarios
- ✅ **Registro de Profesores** - Solo emails @tecsup.edu.pe
- ✅ **Perfiles Completos** - Información académica y personal
- ✅ **Subida de Imágenes** - Fotos de perfil con validación
- ✅ **Gestión de Contraseñas** - Cambio seguro de credenciales

### 🏢 Gestión de Aulas Virtuales
- ✅ **Catálogo de Aulas** - Lista completa con equipamiento
- ✅ **Búsqueda Avanzada** - Filtros por capacidad, fecha, horario
- ✅ **Disponibilidad en Tiempo Real** - Verificación instantánea
- ✅ **Información Detallada** - Ubicación, capacidad, equipos

### 📅 Sistema de Reservas
- ✅ **Reservas Inteligentes** - Validación automática de disponibilidad
- ✅ **Gestión Completa** - Crear, consultar, cancelar reservas
- ✅ **Historial Detallado** - Seguimiento de todas las operaciones
- ✅ **Notificaciones** - Confirmaciones y recordatorios

### 📊 Calendario y Restricciones
- ✅ **Calendario Institucional** - Fechas bloqueadas automáticamente
- ✅ **Restricciones Flexibles** - Feriados, mantenimiento, eventos
- ✅ **Validación Inteligente** - Prevención de conflictos de horarios

---

## 🛠️ Tecnologías Utilizadas

### Backend Framework
- **Spring Boot 3.2** - Framework principal
- **Spring Security 6** - Autenticación y autorización
- **Spring Data JPA** - Acceso a datos
- **JWT (JJWT)** - Tokens de autenticación

### Base de Datos
- **PostgreSQL** - Base de datos principal
- **Hibernate** - ORM para persistencia
- **Flyway** - Migraciones de base de datos

### Herramientas de Desarrollo
- **Maven** - Gestión de dependencias
- **Lombok** - Reducción de código boilerplate
- **Jackson** - Serialización JSON
- **Validation API** - Validación de datos

---

## 🚀 Guía de Inicio Rápido

### 1. 📋 Prerrequisitos
```bash
# Java 17 o superior
java -version

# Maven 3.6+
mvn -version

# PostgreSQL 12+
psql --version
```

### 2. ⚙️ Configuración
```bash
# Clonar el repositorio
git clone [url-del-repositorio]
cd proyecto_integrador_ciclo_4/backend/back_springboot_srvt

# Configurar base de datos en application.properties
cp application.properties.example application.properties
# Editar las credenciales de BD
```

### 3. 🗄️ Base de Datos
```sql
-- Crear base de datos
CREATE DATABASE tecsup_reservas;

-- El esquema se crea automáticamente al iniciar la aplicación
```

### 4. ▶️ Ejecutar la Aplicación
```bash
# Compilar y ejecutar
mvn clean install
mvn spring-boot:run

# O usando el JAR compilado
java -jar target/back_springboot_srvt-0.0.1-SNAPSHOT.jar
```

### 5. 🧪 Verificar Instalación
```bash
# Health check
curl http://localhost:8080/actuator/health

# Test de login
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"profesor@tecsup.edu.pe","password":"password123"}'
```

---

## 📱 Integración con Aplicaciones Móviles

### Para Desarrolladores Android/Kotlin
👉 **[Ver KOTLIN_EXAMPLES.md](./KOTLIN_EXAMPLES.md)** para:
- Configuración completa de Retrofit
- Ejemplos de ViewModels y Repositories
- Manejo de estados y errores
- Implementación de autenticación JWT

### Para Desarrolladores iOS/Swift
👉 **[Ver API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** para:
- Documentación completa de endpoints
- Formatos de request/response
- Códigos de error y manejo
- Flujos de autenticación

---

## 🔒 Seguridad

### Características de Seguridad Implementadas
- 🔐 **Encriptación de Contraseñas** con BCrypt
- 🎫 **JWT Tokens** con expiración automática
- 🛡️ **CORS Configuration** para acceso controlado
- 🔍 **Validación de Entrada** en todos los endpoints
- 📊 **Logging de Seguridad** para auditoría
- 🚫 **Protección contra SQL Injection**

👉 **[Ver SECURITY_DOCUMENTATION.md](./SECURITY_DOCUMENTATION.md)** para detalles completos.

---

## 📊 API Endpoints

### Autenticación
```
POST /api/auth/signin     # Login
POST /api/auth/signup     # Registro
POST /api/auth/google     # Google OAuth
```

### Perfil de Usuario
```
GET    /api/perfil          # Obtener perfil
PUT    /api/perfil          # Actualizar perfil
POST   /api/perfil/imagen   # Subir imagen
```

### Reservas
```
POST   /api/reservas                    # Crear reserva
GET    /api/reservas/mis-reservas       # Mis reservas
DELETE /api/reservas/{id}/cancelar      # Cancelar reserva
GET    /api/reservas/disponibilidad     # Verificar disponibilidad
```

### Aulas Virtuales
```
GET    /api/aulas              # Listar todas
GET    /api/aulas/disponibles  # Solo disponibles
POST   /api/aulas/buscar       # Búsqueda con filtros
```

👉 **[Ver API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** para documentación completa.

---

## 🔧 Configuración de Entorno

### Desarrollo Local
```properties
# application-dev.properties
spring.profiles.active=dev
server.port=8080
logging.level.com.tecsup=DEBUG
```

### Producción
```properties
# application-prod.properties
spring.profiles.active=prod
server.port=8080
logging.level.com.tecsup=INFO
spring.jpa.show-sql=false
```

### Variables de Entorno
```bash
# JWT Configuration
JWT_SECRET=tu_clave_secreta_muy_larga
JWT_EXPIRATION=86400

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tecsup_reservas
DB_USERNAME=usuario
DB_PASSWORD=password_seguro

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
```

---

## 🧪 Testing

### Ejecutar Tests
```bash
# Todos los tests
mvn test

# Tests específicos
mvn test -Dtest=AuthServiceTest
mvn test -Dtest=ReservaServiceTest

# Tests de integración
mvn test -Dtest=*IntegrationTest
```

### Coverage Report
```bash
mvn jacoco:report
# Ver en: target/site/jacoco/index.html
```

---

## 📈 Monitoreo y Logs

### Health Checks
```bash
# Estado general
GET /actuator/health

# Métricas
GET /actuator/metrics

# Info de la aplicación
GET /actuator/info
```

### Logs
```bash
# Logs en tiempo real
tail -f logs/application.log

# Filtrar por nivel
grep -i "error\|warn" logs/application.log

# Logs de seguridad
grep -i "auth\|jwt\|security" logs/application.log
```

---

## 🚀 Deployment

### Docker (Recomendado)
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/back_springboot_srvt-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]
```

### Heroku
```bash
# Crear app
heroku create tecsup-reservas-api

# Configurar variables
heroku config:set JWT_SECRET=tu_clave_secreta
heroku config:set DB_URL=postgresql://...

# Deploy
git push heroku main
```

### AWS EC2
```bash
# Instalar Java 17
sudo apt update
sudo apt install openjdk-17-jdk

# Transferir JAR
scp target/back_springboot_srvt-0.0.1-SNAPSHOT.jar usuario@ec2-instance:/home/usuario/

# Ejecutar
nohup java -jar back_springboot_srvt-0.0.1-SNAPSHOT.jar &
```

---

## 🤝 Contribución

### Proceso de Desarrollo
1. **Fork** el repositorio
2. **Crear** rama para feature: `git checkout -b feature/nueva-funcionalidad`
3. **Desarrollar** siguiendo las convenciones del proyecto
4. **Ejecutar** tests: `mvn test`
5. **Commit** con mensaje descriptivo
6. **Push** a la rama: `git push origin feature/nueva-funcionalidad`
7. **Crear** Pull Request

### Estándares de Código
- ✅ Usar DTOs para todos los requests/responses
- ✅ Toda la lógica de negocio en Services
- ✅ Controllers solo para delegación
- ✅ Manejo de errores estandarizado
- ✅ Documentación de métodos públicos
- ✅ Tests unitarios para nueva funcionalidad

---

## 📞 Soporte

### Documentación
- 📖 **API**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- 🔒 **Seguridad**: [SECURITY_DOCUMENTATION.md](./SECURITY_DOCUMENTATION.md)
- 📱 **Kotlin**: [KOTLIN_EXAMPLES.md](./KOTLIN_EXAMPLES.md)
- 📊 **Diagramas**: [FLOW_DIAGRAMS.md](./FLOW_DIAGRAMS.md)

### Contacto
- 📧 **Email**: soporte.ti@tecsup.edu.pe
- 💬 **Slack**: #desarrollo-backend
- 🐛 **Issues**: GitHub Issues del proyecto
- 📋 **Wiki**: Documentación extendida

---

## 📝 Licencia

Este proyecto está desarrollado para uso interno del Instituto TECSUP. Todos los derechos reservados.

---

## 🎯 Roadmap

### Versión Actual (v1.0)
- ✅ Sistema de autenticación completo
- ✅ CRUD de reservas
- ✅ Gestión de perfiles
- ✅ API REST documentada

### Próximas Versiones
- 🔄 **v1.1**: Notificaciones push y emails
- 🔄 **v1.2**: Sistema de reportes y estadísticas
- 🔄 **v1.3**: Integración con sistemas académicos
- 🔄 **v1.4**: API GraphQL alternativa

---

**¡El sistema está listo para producción y completamente documentado para facilitar la integración con aplicaciones frontend y móviles!** 🚀
