package com.tecsup.back_springboot_srvt.controller;

import com.tecsup.back_springboot_srvt.dto.*;
import com.tecsup.back_springboot_srvt.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8000"})
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * Login endpoint
     */
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // Validaciones básicas
            if (loginRequest.getEmail() == null || loginRequest.getEmail().trim().isEmpty()) {
                return createErrorResponse("Email requerido", "El email es obligatorio", "email", 400);
            }

            if (loginRequest.getPassword() == null || loginRequest.getPassword().trim().isEmpty()) {
                return createErrorResponse("Password requerido", "La contraseña es obligatoria", "password", 400);
            }

            AuthResponse response = authService.authenticateUser(loginRequest);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return createErrorResponse("Dominio no permitido", e.getMessage(), "email", 403);
        } catch (IllegalStateException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Configuración pendiente");
            error.put("message", e.getMessage());
            error.put("requirePassword", true);
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            return createErrorResponse("Error interno del servidor", e.getMessage(), null, 500);
        }
    }

    /**
     * Registration endpoint
     */
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        try {
            // Validaciones básicas
            if (signUpRequest.getFirstName() == null || signUpRequest.getFirstName().trim().isEmpty()) {
                return createErrorResponse("Nombre requerido", "El nombre es obligatorio", "firstName", 400);
            }

            if (signUpRequest.getEmail() == null || signUpRequest.getEmail().trim().isEmpty()) {
                return createErrorResponse("Email requerido", "El email es obligatorio", "email", 400);
            }

            if (signUpRequest.getPassword() == null || signUpRequest.getPassword().length() < 6) {
                return createErrorResponse("Password inválido", "La contraseña debe tener al menos 6 caracteres", "password", 400);
            }

            AuthResponse response = authService.registerUser(signUpRequest);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            String message = e.getMessage();
            if (message.contains("dominio") || message.contains("TECSUP")) {
                return createErrorResponse("Dominio no permitido", message, "email", 403);
            } else if (message.contains("registrado")) {
                return createErrorResponse("Email en uso", message, "email", 400);
            } else {
                return createErrorResponse("Error de validación", message, null, 400);
            }
        } catch (Exception e) {
            return createErrorResponse("Error interno del servidor durante el registro", e.getMessage(), null, 500);
        }
    }

    /**
     * Google OAuth endpoint
     */
    @PostMapping("/google")
    public ResponseEntity<?> googleAuth(@Valid @RequestBody GoogleAuthRequest googleRequest) {
        try {
            if (googleRequest.getToken() == null || googleRequest.getToken().trim().isEmpty()) {
                return createErrorResponse("Token requerido", "Token de Google es requerido para autenticación", null, 400);
            }

            AuthResponse response = authService.authenticateWithGoogle(googleRequest);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            String message = e.getMessage();
            if (message.contains("válido") || message.contains("expirado")) {
                return createErrorResponse("Token inválido", message, null, 401);
            } else if (message.contains("dominio") || message.contains("@tecsup.edu.pe")) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Dominio no permitido");
                error.put("message", message);
                error.put("receivedEmail", googleRequest.getEmail());
                return ResponseEntity.status(403).body(error);
            } else if (message.contains("email")) {
                return createErrorResponse("Email no encontrado", message, null, 400);
            } else {
                return createErrorResponse("Error de validación", message, null, 400);
            }
        } catch (Exception e) {
            return createErrorResponse("Error interno del servidor", e.getMessage(), null, 500);
        }
    }

    /**
     * Helper method to create error responses
     */
    private ResponseEntity<?> createErrorResponse(String error, String message, String field, int status) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", error);
        errorResponse.put("message", message);
        if (field != null) {
            errorResponse.put("field", field);
        }
        return ResponseEntity.status(status).body(errorResponse);
    }
}