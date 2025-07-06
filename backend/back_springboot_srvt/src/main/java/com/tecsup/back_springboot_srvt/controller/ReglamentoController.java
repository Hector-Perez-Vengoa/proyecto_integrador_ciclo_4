package com.tecsup.back_springboot_srvt.controller;

import com.tecsup.back_springboot_srvt.dto.ReglamentoRequestDTO;
import com.tecsup.back_springboot_srvt.dto.ReglamentoResponseDTO;
import com.tecsup.back_springboot_srvt.service.ReglamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reglamentos")
@CrossOrigin(origins = "http://localhost:3000")
public class ReglamentoController {

    @Autowired
    private ReglamentoService reglamentoService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> obtenerReglamentos(
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) String busqueda,
            @PageableDefault(size = 10) Pageable pageable) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            Page<ReglamentoResponseDTO> reglamentos = reglamentoService.obtenerReglamentos(
                estado, tipo, busqueda, pageable);
            
            response.put("success", true);
            response.put("message", "Reglamentos obtenidos exitosamente");
            response.put("data", reglamentos.getContent());
            response.put("totalElements", reglamentos.getTotalElements());
            response.put("totalPages", reglamentos.getTotalPages());
            response.put("currentPage", reglamentos.getNumber());
            response.put("size", reglamentos.getSize());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al obtener reglamentos: " + e.getMessage());
            response.put("data", List.of());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Obtener reglamento por ID
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> obtenerReglamentoPorId(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            ReglamentoResponseDTO reglamento = reglamentoService.obtenerReglamentoPorId(id);
            
            response.put("success", true);
            response.put("message", "Reglamento obtenido exitosamente");
            response.put("data", reglamento);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al obtener reglamento: " + e.getMessage());
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // Crear nuevo reglamento
    @PostMapping
    public ResponseEntity<Map<String, Object>> crearReglamento(@Valid @RequestBody ReglamentoRequestDTO request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            ReglamentoResponseDTO nuevoReglamento = reglamentoService.crearReglamento(request);
            
            response.put("success", true);
            response.put("message", "Reglamento creado exitosamente");
            response.put("data", nuevoReglamento);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al crear reglamento: " + e.getMessage());
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Actualizar reglamento
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> actualizarReglamento(
            @PathVariable Long id,
            @Valid @RequestBody ReglamentoRequestDTO request) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            ReglamentoResponseDTO reglamentoActualizado = reglamentoService.actualizarReglamento(id, request);
            
            response.put("success", true);
            response.put("message", "Reglamento actualizado exitosamente");
            response.put("data", reglamentoActualizado);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al actualizar reglamento: " + e.getMessage());
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Eliminar reglamento (eliminación lógica)
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> eliminarReglamento(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            reglamentoService.eliminarReglamento(id);
            
            response.put("success", true);
            response.put("message", "Reglamento eliminado exitosamente");
            response.put("data", null);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al eliminar reglamento: " + e.getMessage());
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Activar/Desactivar reglamento
    @PatchMapping("/{id}/estado")
    public ResponseEntity<Map<String, Object>> cambiarEstadoReglamento(
            @PathVariable Long id,
            @RequestParam String estado) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            ReglamentoResponseDTO reglamento = reglamentoService.cambiarEstadoReglamento(id, estado);
            
            response.put("success", true);
            response.put("message", "Estado del reglamento cambiado exitosamente");
            response.put("data", reglamento);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al cambiar estado del reglamento: " + e.getMessage());
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Obtener reglamento activo por tipo
    @GetMapping("/activo")
    public ResponseEntity<Map<String, Object>> obtenerReglamentoActivo(
            @RequestParam(required = false, defaultValue = "general") String tipo) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            ReglamentoResponseDTO reglamento = reglamentoService.obtenerReglamentoActivo(tipo);
            
            response.put("success", true);
            response.put("message", "Reglamento activo obtenido exitosamente");
            response.put("data", reglamento);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al obtener reglamento activo: " + e.getMessage());
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // Descargar PDF del reglamento
    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> descargarPdf(@PathVariable Long id) {
        try {
            Resource resource = reglamentoService.descargarPdf(id);
            ReglamentoResponseDTO reglamento = reglamentoService.obtenerReglamentoPorId(id);
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                            "attachment; filename=\"" + reglamento.getNombreArchivo() + "\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(resource);
                    
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Ver PDF del reglamento (para visor)
    @GetMapping("/{id}/view")
    public ResponseEntity<Resource> verPdf(@PathVariable Long id) {
        try {
            Resource resource = reglamentoService.descargarPdf(id);
            ReglamentoResponseDTO reglamento = reglamentoService.obtenerReglamentoPorId(id);
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                            "inline; filename=\"" + reglamento.getNombreArchivo() + "\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(resource);
                    
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Obtener estadísticas de reglamentos
    @GetMapping("/estadisticas")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticas() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Map<String, Object> estadisticas = reglamentoService.obtenerEstadisticas();
            
            response.put("success", true);
            response.put("message", "Estadísticas obtenidas exitosamente");
            response.put("data", estadisticas);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al obtener estadísticas: " + e.getMessage());
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Incrementar contador de visualizaciones
    @PostMapping("/{id}/incrementar-visualizaciones")
    public ResponseEntity<Map<String, Object>> incrementarVisualizaciones(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            reglamentoService.incrementarVisualizaciones(id);
            
            response.put("success", true);
            response.put("message", "Visualización registrada exitosamente");
            response.put("data", null);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al registrar visualización: " + e.getMessage());
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Incrementar contador de descargas
    @PostMapping("/{id}/incrementar-descargas")
    public ResponseEntity<Map<String, Object>> incrementarDescargas(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            reglamentoService.incrementarDescargas(id);
            
            response.put("success", true);
            response.put("message", "Descarga registrada exitosamente");
            response.put("data", null);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al registrar descarga: " + e.getMessage());
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
