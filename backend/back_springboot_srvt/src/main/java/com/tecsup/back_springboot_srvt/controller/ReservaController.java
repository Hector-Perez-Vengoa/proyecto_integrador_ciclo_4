package com.tecsup.back_springboot_srvt.controller;

import com.tecsup.back_springboot_srvt.dto.*;
import com.tecsup.back_springboot_srvt.service.ReservaService;
import com.tecsup.back_springboot_srvt.service.BloqueHorarioService;
import com.tecsup.back_springboot_srvt.service.NotificacionService;
import com.tecsup.back_springboot_srvt.service.CancelacionService;
import com.tecsup.back_springboot_srvt.service.ProfesorService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "*")
public class ReservaController {
    
    @Autowired
    private ReservaService reservaService;
    
    @Autowired
    private BloqueHorarioService bloqueHorarioService;
    
    @Autowired
    private NotificacionService notificacionService;
    
    @Autowired
    private CancelacionService cancelacionService;
    
    @Autowired
    private ProfesorService profesorService;
    
    /**
     * Crear una nueva reserva
     */
    @PostMapping
    public ResponseEntity<StandardApiResponse<ReservaResponseDTO>> crearReserva(
            @Valid @RequestBody ReservaRequestDTO requestDTO) {
        try {
            ReservaResponseDTO reserva = reservaService.crearReserva(requestDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(StandardApiResponse.success("Reserva creada exitosamente", reserva));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(StandardApiResponse.error("Error de validación: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardApiResponse.error("Error interno: " + e.getMessage()));
        }
    }
    
    /**
     * Obtener reservas por profesor
     */
    @GetMapping("/profesor/{profesorId}")
    public ResponseEntity<StandardApiResponse<List<ReservaResponseDTO>>> obtenerReservasPorProfesor(
            @PathVariable Long profesorId) {
        try {
            List<ReservaResponseDTO> reservas = reservaService.obtenerReservasPorProfesor(profesorId);
            return ResponseEntity.ok(StandardApiResponse.success("Reservas obtenidas exitosamente", reservas));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardApiResponse.error("Error al obtener reservas: " + e.getMessage()));
        }
    }
    
    /**
     * Obtener reservas por aula y fecha
     */
    @GetMapping("/aula/{aulaVirtualId}/fecha/{fecha}")
    public ResponseEntity<StandardApiResponse<List<ReservaResponseDTO>>> obtenerReservasPorAulaYFecha(
            @PathVariable Long aulaVirtualId,
            @PathVariable String fecha) {
        try {
            List<ReservaResponseDTO> reservas = reservaService.obtenerReservasPorAulaYFecha(aulaVirtualId, fecha);
            return ResponseEntity.ok(StandardApiResponse.success("Reservas obtenidas exitosamente", reservas));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardApiResponse.error("Error al obtener reservas: " + e.getMessage()));
        }
    }
    
    /**
     * Obtener reservas por estado
     */
    @GetMapping("/estado/{estado}")
    public ResponseEntity<StandardApiResponse<List<ReservaResponseDTO>>> obtenerReservasPorEstado(
            @PathVariable String estado) {
        try {
            List<ReservaResponseDTO> reservas = reservaService.obtenerReservasPorEstado(estado);
            return ResponseEntity.ok(StandardApiResponse.success("Reservas obtenidas exitosamente", reservas));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardApiResponse.error("Error al obtener reservas: " + e.getMessage()));
        }
    }
    
    /**
     * Obtener bloques horarios disponibles
     */
    @GetMapping("/bloques")
    public ResponseEntity<StandardApiResponse<List<BloqueHorarioDTO>>> obtenerBloquesHorarios() {
        try {
            List<BloqueHorarioDTO> bloques = bloqueHorarioService.obtenerTodosLosBloquesDTO();
            return ResponseEntity.ok(StandardApiResponse.success("Bloques horarios obtenidos exitosamente", bloques));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardApiResponse.error("Error al obtener bloques horarios: " + e.getMessage()));
        }
    }
    
    /**
     * Verificar disponibilidad de aula
     */
    @GetMapping("/verificar-disponibilidad")
    public ResponseEntity<StandardApiResponse<Map<String, Object>>> verificarDisponibilidad(
            @RequestParam Long aulaVirtualId,
            @RequestParam String fecha,
            @RequestParam(required = false) String horaInicio,
            @RequestParam(required = false) String horaFin) {
        try {
            Map<String, Object> disponibilidad = reservaService.verificarDisponibilidad(
                aulaVirtualId, fecha, horaInicio, horaFin);
            return ResponseEntity.ok(StandardApiResponse.success("Disponibilidad verificada", disponibilidad));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardApiResponse.error("Error al verificar disponibilidad: " + e.getMessage()));
        }
    }
    
    /**
     * Verificar conflictos de horario
     */
    @GetMapping("/verificar-conflicto")
    public ResponseEntity<StandardApiResponse<Map<String, Object>>> verificarConflictoHorario(
            @RequestParam Long aulaVirtualId,
            @RequestParam String fecha,
            @RequestParam String horaInicio,
            @RequestParam String horaFin) {
        try {
            Map<String, Object> resultado = reservaService.verificarConflictoHorario(
                aulaVirtualId, fecha, horaInicio, horaFin);
            return ResponseEntity.ok(StandardApiResponse.success("Verificación completada", resultado));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardApiResponse.error("Error al verificar conflicto: " + e.getMessage()));
        }
    }
    
    /**
     * Cancelar una reserva
     */
    @PostMapping("/{reservaId}/cancelar")
    public ResponseEntity<StandardApiResponse<String>> cancelarReserva(
            @PathVariable Long reservaId,
            @RequestBody Map<String, String> body) {
        try {
            String motivoCancelacion = body.getOrDefault("motivoCancelacion", 
                body.getOrDefault("motivo", "Sin motivo especificado"));
            String observaciones = body.getOrDefault("observaciones", "");
            
            CancelacionReservaDTO cancelacionDTO = new CancelacionReservaDTO();
            cancelacionDTO.setMotivoCancelacion(motivoCancelacion);
            cancelacionDTO.setObservaciones(observaciones);
            
            cancelacionService.cancelarReserva(reservaId, cancelacionDTO);
            return ResponseEntity.ok(StandardApiResponse.success("Reserva cancelada exitosamente", null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(StandardApiResponse.error("Error al cancelar: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardApiResponse.error("Error interno: " + e.getMessage()));
        }
    }
    
    /**
     * Obtener horas ocupadas para una fecha y aula
     */
    @GetMapping("/horas-ocupadas/{aulaId}/{fecha}")
    public ResponseEntity<StandardApiResponse<List<Map<String, Object>>>> obtenerHorasOcupadas(
            @PathVariable Long aulaId, 
            @PathVariable String fecha) {
        try {
            List<Map<String, Object>> horasOcupadas = reservaService.obtenerHorasOcupadas(aulaId, fecha);
            return ResponseEntity.ok(StandardApiResponse.success("Horas ocupadas obtenidas exitosamente", horasOcupadas));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardApiResponse.error("Error al obtener horas ocupadas: " + e.getMessage()));
        }
    }
    
    /**
     * Obtener perfil del profesor por userId
     */
    @GetMapping("/mi-perfil-profesor")
    public ResponseEntity<StandardApiResponse<Map<String, Object>>> obtenerMiPerfilProfesor(
            @RequestParam Integer userId) {
        try {
            Map<String, Object> perfilProfesor = profesorService.obtenerPerfilProfesorPorUserId(userId);
            if (perfilProfesor == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(StandardApiResponse.error("No se encontró profesor para el usuario: " + userId));
            }
            return ResponseEntity.ok(StandardApiResponse.success("Perfil obtenido exitosamente", perfilProfesor));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardApiResponse.error("Error al obtener perfil: " + e.getMessage()));
        }
    }
    
    /**
     * Obtener cursos asignados a un profesor
     */
    @GetMapping("/cursos-profesor/{profesorId}")
    public ResponseEntity<StandardApiResponse<List<CursoDTO>>> obtenerCursosDelProfesor(
            @PathVariable Long profesorId) {
        try {
            List<CursoDTO> cursos = profesorService.obtenerCursosDelProfesor(profesorId);
            return ResponseEntity.ok(StandardApiResponse.success("Cursos obtenidos exitosamente", cursos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardApiResponse.error("Error al obtener cursos: " + e.getMessage()));
        }
    }
    
    /**
     * Obtener motivos de reserva predefinidos
     */
    @GetMapping("/motivos-reserva")
    public ResponseEntity<StandardApiResponse<List<String>>> obtenerMotivosReserva() {
        try {
            List<String> motivos = reservaService.obtenerMotivosReserva();
            return ResponseEntity.ok(StandardApiResponse.success("Motivos obtenidos exitosamente", motivos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardApiResponse.error("Error al obtener motivos: " + e.getMessage()));
        }
    }
    
    /**
     * Obtener políticas de cancelación
     */
    @GetMapping("/politicas-cancelacion")
    public ResponseEntity<StandardApiResponse<String>> obtenerPoliticasCancelacion() {
        try {
            String politicas = cancelacionService.obtenerPoliticasCancelacion();
            return ResponseEntity.ok(StandardApiResponse.success("Políticas obtenidas exitosamente", politicas));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardApiResponse.error("Error al obtener políticas: " + e.getMessage()));
        }
    }
    
    /**
     * Obtener estado de notificaciones
     */
    @GetMapping("/notificaciones/estado")
    public ResponseEntity<StandardApiResponse<Map<String, Object>>> obtenerEstadoNotificaciones() {
        try {
            Map<String, Object> estado = notificacionService.obtenerEstadoNotificaciones();
            return ResponseEntity.ok(StandardApiResponse.success("Estado obtenido exitosamente", estado));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardApiResponse.error("Error al obtener estado: " + e.getMessage()));
        }
    }
}
