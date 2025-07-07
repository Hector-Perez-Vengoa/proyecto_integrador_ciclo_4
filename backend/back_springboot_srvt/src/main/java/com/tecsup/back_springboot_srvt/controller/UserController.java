package com.tecsup.back_springboot_srvt.controller;

import com.tecsup.back_springboot_srvt.dto.StandardApiResponse;
import com.tecsup.back_springboot_srvt.service.UserPasswordService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

/**
 * Controller para gestión de contraseñas de usuario
 * Maneja cambio y configuración de contraseñas
 */
@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8000", "http://18.224.7.201", "http://ec2-18-224-7-201.us-east-2.compute.amazonaws.com"})
public class UserController {
    
    @Autowired
    private UserPasswordService userPasswordService;
    
    /**
     * Cambiar contraseña de usuario existente
     */
    @PutMapping("/password")
    public ResponseEntity<StandardApiResponse<String>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request) {
        try {
            userPasswordService.cambiarContrasena(request);
            return ResponseEntity.ok(StandardApiResponse.success("Contraseña cambiada exitosamente", null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(StandardApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(StandardApiResponse.error("Error interno: " + e.getMessage()));
        }
    }

    /**
     * Configurar contraseña para usuarios de Google OAuth
     */
    @PostMapping("/setup-password")
    public ResponseEntity<StandardApiResponse<String>> setupPassword(
            @Valid @RequestBody SetupPasswordRequest request) {
        try {
            userPasswordService.configurarContrasena(request);
            return ResponseEntity.ok(StandardApiResponse.success("Contraseña configurada exitosamente", null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(StandardApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(StandardApiResponse.error("Error interno: " + e.getMessage()));
        }
    }

    // DTOs para requests de contraseña
    public static class ChangePasswordRequest {
        private String currentPassword;
        private String newPassword;

        public String getCurrentPassword() { return currentPassword; }
        public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }

        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }

    public static class SetupPasswordRequest {
        private String password;
        private String googleToken;

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getGoogleToken() { return googleToken; }
        public void setGoogleToken(String googleToken) { this.googleToken = googleToken; }
    }
}
