package com.tecsup.back_springboot_srvt.controller;

import com.tecsup.back_springboot_srvt.model.User;
import com.tecsup.back_springboot_srvt.repository.UserRepository;
import com.tecsup.back_springboot_srvt.security.JwtUtils;
import com.tecsup.back_springboot_srvt.security.UserDetailsImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8000"})
public class UserController {

    private static final String GOOGLE_TEMP_PASSWORD = "GOOGLE_OAUTH_NEEDS_PASSWORD_SETUP";

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    // Obtener información del usuario
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            
            User user = userRepository.findByUsername(userDetails.getUsername()).orElse(null);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("firstName", user.getFirstName());
            response.put("lastName", user.getLastName());
            response.put("isActive", user.isActive());
            response.put("dateJoined", user.getDateJoined());
            response.put("lastLogin", user.getLastLogin());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error al obtener el perfil");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }


    // Cambiar contraseña
    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest passwordRequest) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            
            User user = userRepository.findByUsername(userDetails.getUsername()).orElse(null);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            // Validar contraseña actual
            if (!encoder.matches(passwordRequest.getCurrentPassword(), user.getPassword())) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Contraseña actual incorrecta");
                error.put("field", "currentPassword");
                return ResponseEntity.badRequest().body(error);
            }

            // Validar nueva contraseña
            if (passwordRequest.getNewPassword() == null || passwordRequest.getNewPassword().length() < 6) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "La nueva contraseña debe tener al menos 6 caracteres");
                error.put("field", "newPassword");
                return ResponseEntity.badRequest().body(error);
            }

            // Actualizar contraseña
            user.setPassword(encoder.encode(passwordRequest.getNewPassword()));
            userRepository.save(user);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Contraseña cambiada exitosamente");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error al cambiar la contraseña");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }    
    // Configurar contraseña para usuarios de Google
    @PostMapping("/setup-password")
    public ResponseEntity<?> setupPassword(@Valid @RequestBody SetupPasswordRequest passwordRequest) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            
            User user = userRepository.findByUsername(userDetails.getUsername()).orElse(null);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            // Verificar que el usuario necesite configurar contraseña
            if (!GOOGLE_TEMP_PASSWORD.equals(user.getPassword())) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Este usuario ya tiene una contraseña configurada");
                error.put("message", "Use el endpoint de cambio de contraseña en su lugar");
                return ResponseEntity.badRequest().body(error);
            }

            // Validar nueva contraseña
            if (passwordRequest.getPassword() == null || passwordRequest.getPassword().length() < 6) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "La contraseña debe tener al menos 6 caracteres");
                error.put("field", "password");
                return ResponseEntity.badRequest().body(error);
            }

            // Actualizar contraseña
            user.setPassword(encoder.encode(passwordRequest.getPassword()));
            userRepository.save(user);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Contraseña configurada exitosamente");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error al configurar la contraseña");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }    
    // DTOs
    public static class ChangePasswordRequest {
        private String currentPassword;
        private String newPassword;

        // Getters y setters
        public String getCurrentPassword() { return currentPassword; }
        public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }

        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }

    public static class SetupPasswordRequest {
        private String password;
        private String googleToken;

        // Getters y setters
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getGoogleToken() { return googleToken; }
        public void setGoogleToken(String googleToken) { this.googleToken = googleToken; }
    }
}
