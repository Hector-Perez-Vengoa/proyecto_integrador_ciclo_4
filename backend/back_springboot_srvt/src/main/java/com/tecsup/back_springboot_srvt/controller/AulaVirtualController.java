package com.tecsup.back_springboot_srvt.controller;

import com.tecsup.back_springboot_srvt.model.AulaVirtual;
import com.tecsup.back_springboot_srvt.service.AulaVirtualService;
import com.tecsup.back_springboot_srvt.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/aula-virtual")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8000"})
public class AulaVirtualController {

    private final AulaVirtualService aulaVirtualService;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    public AulaVirtualController(AulaVirtualService aulaVirtualService) {
        this.aulaVirtualService = aulaVirtualService;
    }

    /**
     * Validar y extraer username del token JWT
     */
    private String validarYExtraerUsername(String token) {
        try {
            String jwtToken = token.replace("Bearer ", "");
            String username = jwtUtils.getUserNameFromJwtToken(jwtToken);
            
            if (username == null || !jwtUtils.validateJwtToken(jwtToken)) {
                return null;
            }
            
            return username;
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Crear respuesta de error
     */
    private Map<String, Object> crearRespuestaError(String mensaje) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", mensaje);
        response.put("success", false);
        response.put("data", null);
        return response;
    }

    /**
     * Crear respuesta exitosa
     */
    private Map<String, Object> crearRespuestaExitosa(String mensaje, Object data) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", mensaje);
        response.put("success", true);
        response.put("data", data);
        return response;
    }

    // GET http://localhost:8080/api/aula-virtual
    @GetMapping
    public ResponseEntity<?> listar(@RequestHeader(value = "Authorization", required = false) String token) {
        try {
            // Verificar autenticación
            if (token == null || token.trim().isEmpty()) {
                return ResponseEntity.status(401)
                    .body(crearRespuestaError("Token de autenticación requerido"));
            }

            String username = validarYExtraerUsername(token);
            if (username == null) {
                return ResponseEntity.status(401)
                    .body(crearRespuestaError("Token inválido o expirado"));
            }

            List<AulaVirtual> aulas = aulaVirtualService.listar();
            return ResponseEntity.ok()
                .body(crearRespuestaExitosa("Aulas virtuales obtenidas correctamente", aulas));
                
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(crearRespuestaError("Error al obtener aulas virtuales: " + e.getMessage()));
        }
    }    // GET http://localhost:8080/api/aula-virtual/disponibles
    @GetMapping("/disponibles")
    public ResponseEntity<?> listarDisponibles(
            @RequestHeader("Authorization") String token,
            @RequestParam(value = "codigo", required = false) String codigo,
            @RequestParam(value = "descripcion", required = false) String descripcion,
            @RequestParam(value = "fecha", required = false) String fecha,
            @RequestParam(value = "horaInicio", required = false) String horaInicio,
            @RequestParam(value = "horaFin", required = false) String horaFin,
            @RequestParam(value = "cursoId", required = false) Long cursoId) {
        try {
            // Verificar autenticación
            String username = validarYExtraerUsername(token);
            if (username == null) {
                return ResponseEntity.status(401)
                    .body(crearRespuestaError("Token inválido o expirado"));
            }

            List<AulaVirtual> aulasDisponibles;
            
            // Determinar qué tipo de filtros usar
            if (fecha != null || horaInicio != null || horaFin != null || cursoId != null) {
                // Usar filtros avanzados por fecha, hora y curso
                aulasDisponibles = aulaVirtualService.listarDisponiblesConFiltrosAvanzados(
                    fecha, horaInicio, horaFin, cursoId);
            } else if (codigo != null || descripcion != null) {
                // Usar filtros básicos por código y descripción
                aulasDisponibles = aulaVirtualService.listarDisponiblesConFiltros(codigo, descripcion);
            } else {
                // Sin filtros, obtener todas las disponibles
                aulasDisponibles = aulaVirtualService.listarDisponibles();
            }
            
            Map<String, Object> respuestaData = new HashMap<>();
            respuestaData.put("aulas", aulasDisponibles);
            respuestaData.put("total", aulasDisponibles.size());
            respuestaData.put("profesor", username);
            
            // Agregar información de filtros aplicados
            Map<String, Object> filtrosAplicados = new HashMap<>();
            filtrosAplicados.put("codigo", codigo);
            filtrosAplicados.put("descripcion", descripcion);
            filtrosAplicados.put("fecha", fecha);
            filtrosAplicados.put("horaInicio", horaInicio);
            filtrosAplicados.put("horaFin", horaFin);
            filtrosAplicados.put("cursoId", cursoId);
            respuestaData.put("filtros", filtrosAplicados);

            return ResponseEntity.ok()
                .body(crearRespuestaExitosa("Aulas virtuales disponibles obtenidas correctamente", respuestaData));
                
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(crearRespuestaError("Error al obtener aulas virtuales disponibles: " + e.getMessage()));
        }
    }

    // GET http://localhost:8080/api/aula-virtual/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        try {
            // Verificar autenticación
            String username = validarYExtraerUsername(token);
            if (username == null) {
                return ResponseEntity.status(401)
                    .body(crearRespuestaError("Token inválido o expirado"));
            }

            AulaVirtual aula = aulaVirtualService.obtener(id);
            if (aula == null) {
                return ResponseEntity.status(404)
                    .body(crearRespuestaError("Aula virtual no encontrada"));
            }

            return ResponseEntity.ok()
                .body(crearRespuestaExitosa("Aula virtual obtenida correctamente", aula));
                
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(crearRespuestaError("Error al obtener aula virtual: " + e.getMessage()));
        }
    }

    // POST http://localhost:8080/api/aula-virtual
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody AulaVirtual aulaVirtual, @RequestHeader("Authorization") String token) {
        try {
            // Verificar autenticación
            String username = validarYExtraerUsername(token);
            if (username == null) {
                return ResponseEntity.status(401)
                    .body(crearRespuestaError("Token inválido o expirado"));
            }

            aulaVirtualService.crear(aulaVirtual);
            return ResponseEntity.ok()
                .body(crearRespuestaExitosa("Aula virtual creada correctamente", aulaVirtual));
                
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(crearRespuestaError("Error al crear aula virtual: " + e.getMessage()));
        }
    }

    // PUT http://localhost:8080/api/aula-virtual/{codigo}
    @PutMapping("/{codigo}")
    public ResponseEntity<?> actualizar(@PathVariable String codigo, @RequestBody AulaVirtual aulaVirtual, @RequestHeader("Authorization") String token) {
        try {
            // Verificar autenticación
            String username = validarYExtraerUsername(token);
            if (username == null) {
                return ResponseEntity.status(401)
                    .body(crearRespuestaError("Token inválido o expirado"));
            }

            aulaVirtual.setCodigo(codigo);
            aulaVirtualService.actualizar(aulaVirtual);
            return ResponseEntity.ok()
                .body(crearRespuestaExitosa("Aula virtual actualizada correctamente", aulaVirtual));
                
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(crearRespuestaError("Error al actualizar aula virtual: " + e.getMessage()));
        }
    }

    // DELETE http://localhost:8080/api/aula-virtual/{codigo}
    @DeleteMapping("/{codigo}")
    public ResponseEntity<?> eliminar(@PathVariable String codigo, @RequestHeader("Authorization") String token) {
        try {
            // Verificar autenticación
            String username = validarYExtraerUsername(token);
            if (username == null) {
                return ResponseEntity.status(401)
                    .body(crearRespuestaError("Token inválido o expirado"));
            }

            aulaVirtualService.eliminar(codigo);
            return ResponseEntity.ok()
                .body(crearRespuestaExitosa("Aula virtual eliminada correctamente", null));
                
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(crearRespuestaError("Error al eliminar aula virtual: " + e.getMessage()));
        }
    }
}
