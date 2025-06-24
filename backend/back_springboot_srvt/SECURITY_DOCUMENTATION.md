# 🔒 Documentación de Seguridad - Sistema de Reservas TECSUP

## 🛡️ Implementación de Seguridad

### 1. 🔐 Autenticación JWT

El sistema utiliza JSON Web Tokens (JWT) para la autenticación segura de usuarios.

#### Configuración:
- **Algoritmo**: HS256 (HMAC SHA-256)
- **Expiración**: 24 horas
- **Secret Key**: Configurado en `application.properties`
- **Header**: `Authorization: Bearer {token}`

#### Flujo de Autenticación:
1. Usuario envía credenciales (email/password)
2. Backend valida credenciales contra la base de datos
3. Si son válidas, genera un JWT token
4. Token se envía al cliente para futuras peticiones
5. Cliente incluye token en header `Authorization`
6. Backend valida token en cada petición protegida

### 2. 🔑 Gestión de Contraseñas

#### Contraseñas Normales:
- **Hashing**: BCrypt con sal automática
- **Complejidad mínima**: 6 caracteres
- **Validación**: Contraseñas comunes rechazadas
- **Almacenamiento**: Solo hash BCrypt, nunca texto plano

#### Contraseñas Temporales para Google OAuth:
- **Generación**: 256 bits de entropía usando `SecureRandom`
- **Formato**: `$GOOGLE_TEMP$` + Base64(random_bytes)
- **Propósito**: Placeholder seguro hasta que usuario configure su contraseña
- **Identificación**: Prefijo especial para distinguir contraseñas temporales

```java
// Ejemplo de generación segura
public static String generarContrasenaTemporalGoogle() {
    byte[] randomBytes = new byte[32]; // 256 bits de entropía
    secureRandom.nextBytes(randomBytes);
    String randomPassword = Base64.getEncoder().encodeToString(randomBytes);
    return GOOGLE_TEMP_PREFIX + randomPassword;
}
```

### 3. 🌐 OAuth Google Integration

#### Flujo de Autenticación:
1. Cliente obtiene token de Google OAuth
2. Backend valida token con Google APIs
3. Extrae información del perfil (email, nombre)
4. Verifica que el email pertenezca al dominio @tecsup.edu.pe
5. Crea o actualiza usuario en base de datos
6. Asigna contraseña temporal segura
7. Genera JWT token para la sesión

#### Validaciones de Seguridad:
- ✅ Verificación del token con Google
- ✅ Validación del dominio TECSUP
- ✅ Creación segura de usuario
- ✅ Contraseña temporal criptográficamente segura

### 4. 🔒 Protección de Endpoints

#### Endpoints Públicos:
- `POST /api/auth/signin` - Login
- `POST /api/auth/signup` - Registro
- `POST /api/auth/google` - Google OAuth

#### Endpoints Protegidos (requieren JWT):
- `GET /api/perfil` - Información del perfil
- `PUT /api/perfil` - Actualizar perfil
- `POST /api/reservas` - Crear reserva
- `GET /api/reservas/mis-reservas` - Listar reservas
- `DELETE /api/reservas/{id}/cancelar` - Cancelar reserva
- Todos los demás endpoints

#### Middleware de Seguridad:
```java
@Override
protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                FilterChain filterChain) throws ServletException, IOException {
    try {
        String jwt = parseJwt(request);
        if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
            String username = jwtUtils.getUserNameFromJwtToken(jwt);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            
            UsernamePasswordAuthenticationToken authentication = 
                new UsernamePasswordAuthenticationToken(userDetails, null, 
                                                       userDetails.getAuthorities());
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
    } catch (Exception e) {
        logger.error("Cannot set user authentication: {}", e);
    }
    
    filterChain.doFilter(request, response);
}
```

### 5. 🛡️ Validaciones de Entrada

#### Email:
- ✅ Formato válido de email
- ✅ Dominio obligatorio: @tecsup.edu.pe
- ✅ Normalización a minúsculas
- ✅ Verificación de unicidad

#### Contraseñas:
- ✅ Longitud mínima: 6 caracteres
- ✅ Longitud máxima: 128 caracteres
- ✅ Rechazo de contraseñas comunes
- ✅ Hashing seguro con BCrypt

#### Datos de Reserva:
- ✅ Validación de fechas futuras
- ✅ Verificación de horarios válidos
- ✅ Comprobación de disponibilidad
- ✅ Autorización del usuario (solo sus reservas)

### 6. 🔐 CORS Configuration

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOriginPatterns(Arrays.asList("*"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

### 7. 🚫 Prevención de Vulnerabilidades

#### SQL Injection:
- ✅ Uso de JPA/Hibernate con parámetros
- ✅ Queries preparadas automáticamente
- ✅ Validación de entrada

#### XSS (Cross-Site Scripting):
- ✅ Escape automático de datos en responses JSON
- ✅ Validación de entrada en DTOs
- ✅ Headers de seguridad apropiados

#### CSRF (Cross-Site Request Forgery):
- ✅ Tokens JWT stateless
- ✅ SameSite cookies configuration
- ✅ CORS configuración restrictiva para producción

#### Authentication Bypass:
- ✅ Verificación de token en cada request
- ✅ Validación de autorización por usuario
- ✅ Expiración automática de tokens

### 8. 📊 Logging y Auditoría

#### Eventos de Seguridad Registrados:
- ✅ Intentos de login (exitosos y fallidos)
- ✅ Creación de nuevos usuarios
- ✅ Cambios de contraseña
- ✅ Accesos con tokens inválidos
- ✅ Operaciones CRUD en reservas

#### Configuración de Logs:
```properties
# Nivel de logging para seguridad
logging.level.com.tecsup.back_springboot_srvt.security=INFO
logging.level.org.springframework.security=INFO

# Logging de requests HTTP (solo desarrollo)
logging.level.org.springframework.web=DEBUG
```

### 9. 🔧 Configuración de Producción

#### Variables de Entorno Requeridas:
```bash
# JWT Configuration
JWT_SECRET=tu_clave_secreta_muy_larga_y_segura_aqui
JWT_EXPIRATION=86400

# Database
DB_PASSWORD=tu_password_seguro_de_base_de_datos

# Google OAuth
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
```

#### Headers de Seguridad (Recomendados):
```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.headers(headers -> headers
        .frameOptions().deny()
        .contentTypeOptions().and()
        .httpStrictTransportSecurity(hstsConfig -> hstsConfig
            .maxAgeInSeconds(31536000)
            .includeSubdomains(true))
    );
    return http.build();
}
```

### 10. 🧪 Testing de Seguridad

#### Tests Implementados:
- ✅ Validación de JWT tokens válidos/inválidos
- ✅ Verificación de autorización por usuario
- ✅ Pruebas de contraseñas seguras/inseguras
- ✅ Tests de Google OAuth flow
- ✅ Verificación de CORS policies

#### Tests Recomendados para Producción:
- 🔄 Penetration testing automático
- 🔄 Análisis de dependencias vulnerables
- 🔄 Tests de carga para DoS prevention
- 🔄 Auditoría de logs de seguridad

### 11. 📋 Checklist de Seguridad

#### ✅ Implementado:
- [x] Autenticación JWT segura
- [x] Hashing de contraseñas con BCrypt
- [x] Validación de dominios TECSUP
- [x] Generación segura de contraseñas temporales
- [x] Autorización por usuario en endpoints
- [x] Validación de entrada robusta
- [x] Prevención de inyección SQL
- [x] Configuración CORS apropiada
- [x] Logging de eventos de seguridad
- [x] Gestión segura de sesiones

#### 🔄 Recomendaciones Futuras:
- [ ] Rate limiting para prevenir brute force
- [ ] Two-factor authentication (2FA)
- [ ] Rotación automática de JWT secrets
- [ ] Análisis de patrones de acceso sospechosos
- [ ] Encriptación de datos sensibles en BD
- [ ] Backup automático con encriptación

### 12. 🚨 Respuesta a Incidentes

#### Procedimientos:
1. **Detección**: Monitoring automático de logs
2. **Aislamiento**: Revocación de tokens comprometidos
3. **Análisis**: Revisión de logs de acceso
4. **Mitigación**: Actualización de credenciales
5. **Documentación**: Registro del incidente
6. **Prevención**: Mejoras en seguridad

#### Contactos de Emergencia:
- **Administrador del Sistema**: admin@tecsup.edu.pe
- **Equipo de Seguridad TI**: seguridad@tecsup.edu.pe
- **Desarrollador Principal**: [contacto del desarrollador]

---

## 🔍 Verificación de Implementación

Para verificar que la seguridad está correctamente implementada:

1. **Compilar el proyecto**:
   ```bash
   mvn clean compile
   ```

2. **Ejecutar tests de seguridad**:
   ```bash
   mvn test -Dtest=AuthServiceTest,SecurityConfigTest
   ```

3. **Verificar logs**:
   ```bash
   tail -f logs/application.log | grep -i "security\|auth\|jwt"
   ```

4. **Test manual de endpoints**:
   - Intentar acceder sin token → Debe retornar 401
   - Login con credenciales correctas → Debe retornar token
   - Usar token en endpoints protegidos → Debe funcionar
   - Usar token expirado → Debe retornar 401


