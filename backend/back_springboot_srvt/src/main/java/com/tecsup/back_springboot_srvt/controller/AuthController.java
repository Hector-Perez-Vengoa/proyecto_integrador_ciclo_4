package com.tecsup.back_springboot_srvt.controller;

import com.tecsup.back_springboot_srvt.model.User;
import com.tecsup.back_springboot_srvt.repository.UserRepository;
import com.tecsup.back_springboot_srvt.security.JwtUtils;
import com.tecsup.back_springboot_srvt.security.UserDetailsImpl;
import com.tecsup.back_springboot_srvt.service.GoogleAuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8000"})
public class AuthController {

    // Constante para identificar usuarios que necesitan configurar contraseña
    private static final String GOOGLE_TEMP_PASSWORD = "GOOGLE_OAUTH_NEEDS_PASSWORD_SETUP";

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;    
    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    GoogleAuthService googleAuthService;

    // Endpoint de prueba
    @GetMapping("/test")
    public ResponseEntity<?> testConnection() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Spring Boot Auth funcionando - BD MySQL directa");
        response.put("timestamp", LocalDateTime.now());
        response.put("backend", "Spring Boot");
        response.put("database", "MySQL directo (sin Django)");
        return ResponseEntity.ok(response);
    }    // Login 
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // Validaciones básicas primero
            if (loginRequest.getEmail() == null || loginRequest.getEmail().trim().isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Email requerido");
                error.put("message", "El email es obligatorio");
                error.put("field", "email");
                return ResponseEntity.badRequest().body(error);
            }

            if (loginRequest.getPassword() == null || loginRequest.getPassword().trim().isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Password requerido");
                error.put("message", "La contraseña es obligatoria");
                error.put("field", "password");
                return ResponseEntity.badRequest().body(error);
            }
              // Verificar dominio tecsup.edu.pe
            String normalizedEmail = loginRequest.getEmail().trim().toLowerCase();
            if (!normalizedEmail.endsWith("@tecsup.edu.pe")) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Dominio no permitido");
                error.put("message", "Solo se permiten correos @tecsup.edu.pe");
                error.put("field", "email");
                return ResponseEntity.status(403).body(error);
            }
            
            // Verificar si el usuario existe y necesita configurar contraseña
            User existingUser = userRepository.findByEmail(normalizedEmail).orElse(null);
            if (existingUser != null && GOOGLE_TEMP_PASSWORD.equals(existingUser.getPassword())) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Configuración pendiente");
                error.put("message", "Debe configurar su contraseña antes de iniciar sesión");
                error.put("requirePassword", true);
                return ResponseEntity.badRequest().body(error);
            }
            
            // Autenticación con email normalizado
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                        normalizedEmail, 
                        loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            
            User user = userRepository.findByUsername(userDetails.getUsername()).orElse(null);
            if (user != null) {
                user.setLastLogin(LocalDateTime.now());
                userRepository.save(user);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("type", "Bearer");
            response.put("user", Map.of(
                "id", userDetails.getId(),
                "username", userDetails.getUsername(),
                "email", userDetails.getEmail(),
                "firstName", user != null ? user.getFirstName() : "",
                "lastName", user != null ? user.getLastName() : ""
            ));

            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error interno del servidor");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }// Registro 
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        try {
            // Validaciones básicas primero
            if (signUpRequest.getFirstName() == null || signUpRequest.getFirstName().trim().isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Nombre requerido");
                error.put("message", "El nombre es obligatorio");
                error.put("field", "firstName");
                return ResponseEntity.badRequest().body(error);
            }

            if (signUpRequest.getEmail() == null || signUpRequest.getEmail().trim().isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Email requerido");
                error.put("message", "El email es obligatorio");
                error.put("field", "email");
                return ResponseEntity.badRequest().body(error);
            }

            if (signUpRequest.getPassword() == null || signUpRequest.getPassword().length() < 6) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Password inválido");
                error.put("message", "La contraseña debe tener al menos 6 caracteres");
                error.put("field", "password");
                return ResponseEntity.badRequest().body(error);
            }            // Verificar dominio tecsup.edu.pe
            String normalizedEmail = signUpRequest.getEmail().trim().toLowerCase();
            if (!normalizedEmail.endsWith("@tecsup.edu.pe")) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Dominio no permitido");
                error.put("message", "Solo se permiten correos de TECSUP");
                error.put("field", "email");
                return ResponseEntity.status(403).body(error);
            }            // Verificar si el username ya existe
            String username = normalizedEmail; // Use normalized email as username
            if (userRepository.existsByUsername(username)) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Username ya está en uso!"));
            }

            // Verificar si el email ya existe
            if (userRepository.existsByEmail(normalizedEmail)) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Email ya está en uso!"));
            }            // Crear nueva cuenta de usuario
            User user = new User(username,
                    normalizedEmail,
                    encoder.encode(signUpRequest.getPassword()),
                    signUpRequest.getFirstName(),
                    signUpRequest.getLastName());userRepository.save(user);
              // Generar token automáticamente después del registro
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    normalizedEmail, 
                    signUpRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
            
            // Respuesta exitosa con datos del usuario y token
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Usuario registrado exitosamente!");
            response.put("token", jwt);
            response.put("type", "Bearer");
            response.put("user", Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "firstName", user.getFirstName(),
                "lastName", user.getLastName(),
                "username", user.getUsername()
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error interno del servidor");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }    }    // Google OAuth Login
    @PostMapping("/google")
    public ResponseEntity<?> googleAuth(@Valid @RequestBody GoogleAuthRequest googleRequest) {
        try {
            // SEGURIDAD: Verificar el token con Google antes de confiar en los datos
            String idToken = googleRequest.getToken();
            
            if (idToken == null || idToken.trim().isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Token requerido");
                error.put("message", "Token de Google es requerido para autenticación");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Verificar el token con Google y obtener datos verificados
            GoogleAuthService.GoogleUserInfo userInfo = googleAuthService.verifyGoogleToken(idToken);
            
            if (userInfo == null) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Token inválido");
                error.put("message", "El token de Google no es válido o ha expirado");
                return ResponseEntity.status(401).body(error);
            }
            
            // Extraer datos verificados del token (NO del frontend)
            String email = userInfo.getEmail();
            String firstName = userInfo.getGivenName();
            String lastName = userInfo.getFamilyName();
            
            // Validar que el token contenga email
            if (email == null || email.trim().isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Email no encontrado");
                error.put("message", "El token de Google no contiene información de email");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Normalizar email
            email = email.trim().toLowerCase();
            
            // Verificar dominio TECSUP
            if (!email.endsWith("@tecsup.edu.pe")) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Dominio no permitido");
                error.put("message", "Solo se permiten correos @tecsup.edu.pe");
                error.put("receivedEmail", email);
                return ResponseEntity.status(403).body(error);
            }

            // Buscar usuario existente
            User existingUser = userRepository.findByEmail(email).orElse(null);
            
            if (existingUser != null) {
                // Usuario existente - actualizar datos y login
                existingUser.setLastLogin(LocalDateTime.now());
                
                // Actualizar nombre si cambió en Google
                if (firstName != null && !firstName.trim().isEmpty()) {
                    existingUser.setFirstName(firstName.trim());
                }
                if (lastName != null && !lastName.trim().isEmpty()) {
                    existingUser.setLastName(lastName.trim());
                }
                
                userRepository.save(existingUser);
                
                // Generate JWT token
                String jwt = jwtUtils.generateTokenFromUsername(existingUser.getUsername());
                
                Map<String, Object> response = new HashMap<>();
                response.put("token", jwt);
                response.put("type", "Bearer");
                
                // Verificar si necesita configurar contraseña
                boolean needsPassword = GOOGLE_TEMP_PASSWORD.equals(existingUser.getPassword());
                
                if (needsPassword) {
                    response.put("requirePassword", true);
                }
                
                response.put("user", Map.of(
                    "id", existingUser.getId(),
                    "email", existingUser.getEmail(),
                    "firstName", existingUser.getFirstName(),
                    "lastName", existingUser.getLastName()
                ));
                
                return ResponseEntity.ok(response);
                
            } else {
                // Usuario nuevo - crear cuenta con datos verificados
                User newUser = new User();
                newUser.setUsername(email);
                newUser.setEmail(email);
                newUser.setFirstName(firstName != null ? firstName.trim() : "");
                newUser.setLastName(lastName != null ? lastName.trim() : "");
                
                // Asignar contraseña temporal que indica que necesita configuración
                newUser.setPassword(GOOGLE_TEMP_PASSWORD);
                newUser.setDateJoined(LocalDateTime.now());
                
                userRepository.save(newUser);
                
                String jwt = jwtUtils.generateTokenFromUsername(newUser.getUsername());
                
                Map<String, Object> response = new HashMap<>();
                response.put("token", jwt);
                response.put("type", "Bearer");
                response.put("requirePassword", true);
                response.put("user", Map.of(
                    "id", newUser.getId(),
                    "email", newUser.getEmail(),
                    "firstName", newUser.getFirstName(),
                    "lastName", newUser.getLastName()
                ));
                
                return ResponseEntity.ok(response);
            }
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error interno del servidor");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    // DTOs internos
    public static class LoginRequest {
        private String email;
        private String password;
        
        // Getters y setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

     public static class SignupRequest {
        private String username;
        private String email;
        private String password;
        private String firstName;
        private String lastName;

        // getters y setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }

        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
    }

    public static class GoogleAuthRequest {
        private String token;
        private String email;
        private String firstName;
        private String lastName;
        private String tempPassword;

        // Getters y setters
        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        
        public String getTempPassword() { return tempPassword; }
        public void setTempPassword(String tempPassword) { this.tempPassword = tempPassword; }
    }

    public static class MessageResponse {
        private String message;

        public MessageResponse(String message) {
            this.message = message;
        }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}