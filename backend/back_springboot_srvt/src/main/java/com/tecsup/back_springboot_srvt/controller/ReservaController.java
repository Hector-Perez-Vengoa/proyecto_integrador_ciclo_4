package com.tecsup.back_springboot_srvt.controller;

import com.tecsup.back_springboot_srvt.dto.*;
import com.tecsup.back_springboot_srvt.service.ReservaService;
import com.tecsup.back_springboot_srvt.service.BloqueHorarioService;
import com.tecsup.back_springboot_srvt.service.NotificacionService;
import com.tecsup.back_springboot_srvt.service.CancelacionService;
import com.tecsup.back_springboot_srvt.repository.UserRepository;
import com.tecsup.back_springboot_srvt.model.User;
import com.tecsup.back_springboot_srvt.security.JwtUtils;

import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.tecsup.back_springboot_srvt.dto.StandardApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

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
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    /**
     * Crear una nueva reserva
     */
    @PostMapping
    public ResponseEntity<StandardApiResponse<ReservaResponseDTO>> crearReserva(
            @Valid @RequestBody ReservaRequestDTO requestDTO,
            HttpServletRequest request) {
        try {
            // Extraer información del usuario desde el token JWT
            String token = request.getHeader("Authorization");
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7); // Remover "Bearer "
                
                try {
                    // Extraer el username del token
                    String username = jwtUtils.getUserNameFromJwtToken(token);
                    System.out.println("Username extraído del token: " + username);
                    
                    // Buscar el usuario por username/email
                    Optional<User> userOpt = userRepository.findByUsername(username);
                    
                    if (userOpt.isPresent()) {
                        User user = userOpt.get();
                        System.out.println("Usuario encontrado: ID=" + user.getId() + ", Username=" + user.getUsername());
                        // SIEMPRE asignar el userId del token, no importa si viene en el DTO
                        requestDTO.setUserId(user.getId());
                        System.out.println("UserId asignado al DTO: " + requestDTO.getUserId());
                    } else {
                        System.err.println("Usuario no encontrado para username: " + username);
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(StandardApiResponse.error("Usuario no encontrado"));
                    }
                } catch (Exception e) {
                    System.err.println("Error al extraer información del token: " + e.getMessage());
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(StandardApiResponse.error("Token inválido"));
                }
            } else {
                System.err.println("Token no proporcionado en el header Authorization");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(StandardApiResponse.error("Token requerido"));
            }
            
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
     * Obtener reservas por usuario
     */
    @GetMapping("/usuario/{userId}")
    public ResponseEntity<StandardApiResponse<List<ReservaResponseDTO>>> obtenerReservasPorUsuario(
            @PathVariable Integer userId) {
        try {
            List<ReservaResponseDTO> reservas = reservaService.obtenerReservasPorUsuario(userId);
            return ResponseEntity.ok(StandardApiResponse.success("Reservas obtenidas exitosamente", reservas));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardApiResponse.error("Error al obtener reservas: " + e.getMessage()));
        }
    }
    
    /**
     * Obtener todas las reservas
     */
    @GetMapping
    public ResponseEntity<StandardApiResponse<List<ReservaResponseDTO>>> obtenerTodasLasReservas() {
        try {
            List<ReservaResponseDTO> reservas = reservaService.obtenerTodasLasReservas();
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
                .body(StandardApiResponse.error("Error al obtener reservas por estado: " + e.getMessage()));
        }
    }
    
    /**
     * Cancelar una reserva
     */
    @PutMapping("/{reservaId}/cancelar")
    public ResponseEntity<StandardApiResponse<String>> cancelarReserva(
            @PathVariable Long reservaId,
            @RequestBody CancelacionReservaDTO cancelacionDTO) {
        try {
            cancelacionService.cancelarReserva(reservaId, cancelacionDTO);
            return ResponseEntity.ok(StandardApiResponse.success("Reserva cancelada exitosamente", "Reserva cancelada"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(StandardApiResponse.error("Error de validación: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardApiResponse.error("Error al cancelar reserva: " + e.getMessage()));
        }
    }
    
    /**
     * Obtener horas ocupadas para una fecha y aula específica
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
     * Verificar disponibilidad de aula
     */
    @GetMapping("/verificar-disponibilidad")
    public ResponseEntity<StandardApiResponse<Map<String, Object>>> verificarDisponibilidad(
            @RequestParam Long aulaVirtualId,
            @RequestParam String fecha,
            @RequestParam String horaInicio,
            @RequestParam String horaFin) {
        try {
            Map<String, Object> disponibilidad = reservaService.verificarDisponibilidad(aulaVirtualId, fecha, horaInicio, horaFin);
            return ResponseEntity.ok(StandardApiResponse.success("Disponibilidad verificada", disponibilidad));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardApiResponse.error("Error al verificar disponibilidad: " + e.getMessage()));
        }
    }
    
    /**
     * Obtener reservas del usuario autenticado
     */
    @GetMapping("/mis-reservas")
    public ResponseEntity<StandardApiResponse<List<ReservaResponseDTO>>> obtenerMisReservas(
            HttpServletRequest request) {
        try {
            // Extraer información del usuario desde el token JWT
            String token = request.getHeader("Authorization");
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7); // Remover "Bearer "
                
                try {
                    // Extraer el username del token
                    String username = jwtUtils.getUserNameFromJwtToken(token);
                    System.out.println("Username extraído del token: " + username);
                    
                    // Buscar el usuario por username/email
                    Optional<User> userOpt = userRepository.findByUsername(username);
                    
                    if (userOpt.isPresent()) {
                        User user = userOpt.get();
                        System.out.println("Obteniendo reservas para usuario ID: " + user.getId());
                        
                        List<ReservaResponseDTO> reservas = reservaService.obtenerReservasPorUsuario(user.getId());
                        return ResponseEntity.ok(StandardApiResponse.success("Reservas obtenidas exitosamente", reservas));
                    } else {
                        System.err.println("Usuario no encontrado con username: " + username);
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(StandardApiResponse.error("Usuario no encontrado"));
                    }
                } catch (Exception e) {
                    System.err.println("Error al extraer información del token: " + e.getMessage());
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(StandardApiResponse.error("Token inválido"));
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(StandardApiResponse.error("Token de autorización requerido"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardApiResponse.error("Error al obtener reservas: " + e.getMessage()));
        }
    }
    

}
