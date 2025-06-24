package com.tecsup.back_springboot_srvt.controller;

import com.tecsup.back_springboot_srvt.dto.*;
import com.tecsup.back_springboot_srvt.service.AulaVirtualService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/aulas")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8000"})
public class AulaVirtualController {

    @Autowired
    private AulaVirtualService aulaVirtualService;

    /**
     * Listar todas las aulas
     */
    @GetMapping
    public ResponseEntity<?> listarAulas(@RequestHeader("Authorization") String authorization) {
        try {
            String token = extractToken(authorization);
            List<AulaVirtualResponse> aulas = aulaVirtualService.listarTodasConAuth(token);
            return ResponseEntity.ok(aulas);
        } catch (IllegalArgumentException e) {
            return createErrorResponse("Token inválido", e.getMessage(), null, 401);
        } catch (Exception e) {
            return createErrorResponse("Error interno del servidor", e.getMessage(), null, 500);
        }
    }

    /**
     * Listar aulas disponibles
     */
    @GetMapping("/disponibles")
    public ResponseEntity<?> listarAulasDisponibles(@RequestHeader("Authorization") String authorization) {
        try {
            String token = extractToken(authorization);
            List<AulaVirtualResponse> aulas = aulaVirtualService.listarDisponiblesConAuth(token);
            return ResponseEntity.ok(aulas);
        } catch (IllegalArgumentException e) {
            return createErrorResponse("Token inválido", e.getMessage(), null, 401);
        } catch (Exception e) {
            return createErrorResponse("Error interno del servidor", e.getMessage(), null, 500);
        }
    }

    /**
     * Listar aulas disponibles con filtros
     */
    @PostMapping("/disponibles/filtros")
    public ResponseEntity<?> listarAulasConFiltros(
            @RequestHeader("Authorization") String authorization,
            @Valid @RequestBody AulaVirtualFilterRequest filtros) {
        try {
            String token = extractToken(authorization);
            List<AulaVirtualResponse> aulas = aulaVirtualService.listarDisponiblesConFiltrosAuth(token, filtros);
            return ResponseEntity.ok(aulas);
        } catch (IllegalArgumentException e) {
            return createErrorResponse("Token inválido", e.getMessage(), null, 401);
        } catch (Exception e) {
            return createErrorResponse("Error interno del servidor", e.getMessage(), null, 500);
        }
    }

    /**
     * Obtener aula por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerAula(
            @RequestHeader("Authorization") String authorization,
            @PathVariable Long id) {
        try {
            String token = extractToken(authorization);
            AulaVirtualResponse aula = aulaVirtualService.obtenerConAuth(token, id);
            return ResponseEntity.ok(aula);
        } catch (IllegalArgumentException e) {
            String message = e.getMessage();
            if (message.contains("token") || message.contains("Token")) {
                return createErrorResponse("Token inválido", message, null, 401);
            } else if (message.contains("no existe") || message.contains("no encontrada")) {
                return createErrorResponse("Aula no encontrada", message, null, 404);
            } else {
                return createErrorResponse("Error de validación", message, null, 400);
            }
        } catch (Exception e) {
            return createErrorResponse("Error interno del servidor", e.getMessage(), null, 500);
        }
    }

    /**
     * Crear nueva aula
     */
    @PostMapping
    public ResponseEntity<?> crearAula(
            @RequestHeader("Authorization") String authorization,
            @Valid @RequestBody AulaVirtualRequest request) {
        try {
            // Validaciones básicas
            if (request.getCodigo() == null || request.getCodigo().trim().isEmpty()) {
                return createErrorResponse("Código requerido", "El código del aula es obligatorio", "codigo", 400);
            }

            if (request.getEstado() == null || request.getEstado().trim().isEmpty()) {
                return createErrorResponse("Estado requerido", "El estado del aula es obligatorio", "estado", 400);
            }

            String token = extractToken(authorization);
            AulaVirtualResponse aula = aulaVirtualService.crearConAuth(token, request);
            return ResponseEntity.ok(aula);

        } catch (IllegalArgumentException e) {
            String message = e.getMessage();
            if (message.contains("token") || message.contains("Token")) {
                return createErrorResponse("Token inválido", message, null, 401);
            } else if (message.contains("ya existe") || message.contains("duplicado")) {
                return createErrorResponse("Código en uso", message, "codigo", 409);
            } else {
                return createErrorResponse("Error de validación", message, null, 400);
            }
        } catch (Exception e) {
            return createErrorResponse("Error interno del servidor", e.getMessage(), null, 500);
        }
    }

    /**
     * Actualizar aula existente
     */
    @PutMapping("/{codigo}")
    public ResponseEntity<?> actualizarAula(
            @RequestHeader("Authorization") String authorization,
            @PathVariable String codigo,
            @Valid @RequestBody AulaVirtualRequest request) {
        try {
            // Validaciones básicas
            if (request.getEstado() == null || request.getEstado().trim().isEmpty()) {
                return createErrorResponse("Estado requerido", "El estado del aula es obligatorio", "estado", 400);
            }

            String token = extractToken(authorization);
            AulaVirtualResponse aula = aulaVirtualService.actualizarConAuth(token, codigo, request);
            return ResponseEntity.ok(aula);

        } catch (IllegalArgumentException e) {
            String message = e.getMessage();
            if (message.contains("token") || message.contains("Token")) {
                return createErrorResponse("Token inválido", message, null, 401);
            } else if (message.contains("no existe") || message.contains("no encontrada")) {
                return createErrorResponse("Aula no encontrada", message, null, 404);
            } else {
                return createErrorResponse("Error de validación", message, null, 400);
            }
        } catch (Exception e) {
            return createErrorResponse("Error interno del servidor", e.getMessage(), null, 500);
        }
    }

    /**
     * Eliminar aula
     */
    @DeleteMapping("/{codigo}")
    public ResponseEntity<?> eliminarAula(
            @RequestHeader("Authorization") String authorization,
            @PathVariable String codigo) {
        try {
            String token = extractToken(authorization);
            aulaVirtualService.eliminarConAuth(token, codigo);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Aula eliminada exitosamente");
            response.put("codigo", codigo);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            String message = e.getMessage();
            if (message.contains("token") || message.contains("Token")) {
                return createErrorResponse("Token inválido", message, null, 401);
            } else if (message.contains("no existe") || message.contains("no encontrada")) {
                return createErrorResponse("Aula no encontrada", message, null, 404);
            } else if (message.contains("reservas") || message.contains("utilizada")) {
                return createErrorResponse("No se puede eliminar", message, null, 409);
            } else {
                return createErrorResponse("Error de validación", message, null, 400);
            }
        } catch (Exception e) {
            return createErrorResponse("Error interno del servidor", e.getMessage(), null, 500);
        }
    }

    /**
     * Extraer token del header Authorization
     */
    private String extractToken(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Token de autorización requerido");
        }
        return authorization.substring(7);
    }

    /**
     * Helper method para crear respuestas de error
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
