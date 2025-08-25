package com.tecsup.back_springboot_srvt.controller;

import com.tecsup.back_springboot_srvt.dto.CreatePersonalAccessTokenRequest;
import com.tecsup.back_springboot_srvt.dto.PersonalAccessTokenResponse;
import com.tecsup.back_springboot_srvt.dto.StandardApiResponse;
import com.tecsup.back_springboot_srvt.model.User;
import com.tecsup.back_springboot_srvt.repository.UserRepository;
import com.tecsup.back_springboot_srvt.security.JwtUtils;
import com.tecsup.back_springboot_srvt.service.PersonalAccessTokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/personal-access-tokens")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8000", "http://18.224.7.201", "http://ec2-18-224-7-201.us-east-2.compute.amazonaws.com"})
public class PersonalAccessTokenController {
    
    @Autowired
    private PersonalAccessTokenService tokenService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    /**
     * Create a new personal access token
     */
    @PostMapping
    public ResponseEntity<?> createToken(@Valid @RequestBody CreatePersonalAccessTokenRequest request) {
        try {
            Integer userId = getCurrentUserId();
            if (userId == null) {
                return createErrorResponse("No autorizado", "Sesión no válida", null, 401);
            }
            
            PersonalAccessTokenResponse response = tokenService.createToken(userId, request);
            
            Map<String, Object> successResponse = new HashMap<>();
            successResponse.put("success", true);
            successResponse.put("message", "Token personal creado exitosamente");
            successResponse.put("data", response);
            successResponse.put("warning", "Guarda este token en un lugar seguro. No podrás verlo nuevamente.");
            
            return ResponseEntity.status(HttpStatus.CREATED).body(successResponse);
            
        } catch (IllegalArgumentException e) {
            return createErrorResponse("Error de validación", e.getMessage(), null, 400);
        } catch (IllegalStateException e) {
            return createErrorResponse("Límite alcanzado", e.getMessage(), null, 400);
        } catch (Exception e) {
            return createErrorResponse("Error interno del servidor", "No se pudo crear el token", null, 500);
        }
    }
    
    /**
     * List all personal access tokens for the current user
     */
    @GetMapping
    public ResponseEntity<?> listTokens() {
        try {
            Integer userId = getCurrentUserId();
            if (userId == null) {
                return createErrorResponse("No autorizado", "Sesión no válida", null, 401);
            }
            
            List<PersonalAccessTokenResponse> tokens = tokenService.getUserTokens(userId);
            
            Map<String, Object> successResponse = new HashMap<>();
            successResponse.put("success", true);
            successResponse.put("message", "Tokens obtenidos exitosamente");
            successResponse.put("data", tokens);
            successResponse.put("count", tokens.size());
            
            return ResponseEntity.ok(successResponse);
            
        } catch (Exception e) {
            return createErrorResponse("Error interno del servidor", "No se pudieron obtener los tokens", null, 500);
        }
    }
    
    /**
     * Revoke a specific personal access token
     */
    @DeleteMapping("/{tokenId}")
    public ResponseEntity<?> revokeToken(@PathVariable Long tokenId) {
        try {
            Integer userId = getCurrentUserId();
            if (userId == null) {
                return createErrorResponse("No autorizado", "Sesión no válida", null, 401);
            }
            
            tokenService.revokeToken(userId, tokenId);
            
            Map<String, Object> successResponse = new HashMap<>();
            successResponse.put("success", true);
            successResponse.put("message", "Token revocado exitosamente");
            
            return ResponseEntity.ok(successResponse);
            
        } catch (IllegalArgumentException e) {
            return createErrorResponse("Error de validación", e.getMessage(), null, 400);
        } catch (Exception e) {
            return createErrorResponse("Error interno del servidor", "No se pudo revocar el token", null, 500);
        }
    }
    
    /**
     * Revoke all personal access tokens for the current user
     */
    @DeleteMapping
    public ResponseEntity<?> revokeAllTokens() {
        try {
            Integer userId = getCurrentUserId();
            if (userId == null) {
                return createErrorResponse("No autorizado", "Sesión no válida", null, 401);
            }
            
            int revokedCount = tokenService.revokeAllTokens(userId);
            
            Map<String, Object> successResponse = new HashMap<>();
            successResponse.put("success", true);
            successResponse.put("message", "Todos los tokens han sido revocados");
            successResponse.put("revokedCount", revokedCount);
            
            return ResponseEntity.ok(successResponse);
            
        } catch (Exception e) {
            return createErrorResponse("Error interno del servidor", "No se pudieron revocar los tokens", null, 500);
        }
    }
    
    /**
     * Get usage guide for personal access tokens
     */
    @GetMapping("/guide")
    public ResponseEntity<?> getUsageGuide() {
        Map<String, Object> guide = new HashMap<>();
        guide.put("title", "Guía de Uso - Tokens de Acceso Personal");
        guide.put("description", "Los tokens de acceso personal permiten acceder a la API sin usar tu contraseña");
        
        Map<String, Object> usage = new HashMap<>();
        usage.put("header", "Authorization");
        usage.put("format", "Bearer <token>");
        usage.put("example", "Authorization: Bearer tscp_1234567890abcdef...");
        
        Map<String, Object> security = new HashMap<>();
        security.put("tips", List.of(
                "Guarda el token en un lugar seguro inmediatamente después de crearlo",
                "No compartas tus tokens con nadie",
                "Revoca tokens que ya no uses",
                "Usa nombres descriptivos para identificar el propósito de cada token",
                "Configura fechas de expiración apropiadas"
        ));
        
        guide.put("usage", usage);
        guide.put("security", security);
        guide.put("success", true);
        
        return ResponseEntity.ok(guide);
    }
    
    /**
     * Get current user ID from authentication context
     */
    private Integer getCurrentUserId() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return null;
            }
            
            String email = authentication.getName();
            if (email == null) {
                return null;
            }
            
            // Look up user by email
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                return userOpt.get().getId();
            }
            
            return null;
            
        } catch (Exception e) {
            return null;
        }
    }
    
    /**
     * Helper method to get user ID from username/email
     * This method is no longer needed but kept for reference
     */
    private Integer getUserIdFromUsername(String username) {
        try {
            Optional<User> userOpt = userRepository.findByEmail(username);
            if (userOpt.isPresent()) {
                return userOpt.get().getId();
            }
            
            // Fallback: try by username if email lookup fails
            userOpt = userRepository.findByUsername(username);
            if (userOpt.isPresent()) {
                return userOpt.get().getId();
            }
            
            return null;
        } catch (Exception e) {
            return null;
        }
    }
    
    /**
     * Helper method to create error responses
     */
    private ResponseEntity<?> createErrorResponse(String error, String message, String field, int status) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("error", error);
        errorResponse.put("message", message);
        if (field != null) {
            errorResponse.put("field", field);
        }
        return ResponseEntity.status(status).body(errorResponse);
    }
}