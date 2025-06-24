package com.tecsup.back_springboot_srvt.service;

import com.tecsup.back_springboot_srvt.dto.NotificacionReservaDTO;
import com.tecsup.back_springboot_srvt.dto.ReservaRequestDTO;
import com.tecsup.back_springboot_srvt.dto.ReservaResponseDTO;
import com.tecsup.back_springboot_srvt.enums.EstadoReserva;
import com.tecsup.back_springboot_srvt.model.*;
import com.tecsup.back_springboot_srvt.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReservaService {
    
    @Autowired
    private ReservaRepository reservaRepository;
    
    @Autowired
    private ProfesorRepository profesorRepository;
    
    @Autowired
    private AulaVirtualRepository aulaVirtualRepository;
      @Autowired
    private CursoRepository cursoRepository;
      @Autowired
    private BloqueHorarioService bloqueHorarioService;    @Autowired
    private CalendarioInstitucionalRepository calendarioRepository;
    
    @Autowired
    private NotificacionService notificacionService;
    
    
      /**
     * Crea una nueva reserva con todas las validaciones necesarias
     */
    @Transactional
    public ReservaResponseDTO crearReserva(ReservaRequestDTO requestDTO) throws Exception {
        
        // 1. Validar que el horario esté dentro del rango permitido (08:00 - 22:00)
        if (!bloqueHorarioService.estaEnRangoPermitido(requestDTO.getHoraInicio()) || 
            !bloqueHorarioService.estaEnRangoPermitido(requestDTO.getHoraFin())) {
            throw new IllegalArgumentException(
                bloqueHorarioService.generarMensajeErrorHorario(requestDTO.getHoraInicio(), requestDTO.getHoraFin())
            );
        }
        
        // 2. Validar que el horario cumpla con las nuevas reglas (45min - 4h, múltiplos de 60)
        if (!bloqueHorarioService.esHorarioValido(requestDTO.getHoraInicio(), requestDTO.getHoraFin())) {
            throw new IllegalArgumentException(
                bloqueHorarioService.generarMensajeErrorHorario(requestDTO.getHoraInicio(), requestDTO.getHoraFin())
            );
        }
          // 3. Validar que la fecha y hora de reserva no sean en el pasado (con timezone de Perú)
        if (!bloqueHorarioService.esFechaHoraValida(requestDTO.getFechaReserva(), requestDTO.getHoraInicio())) {
            throw new IllegalArgumentException("No se pueden crear reservas en fechas pasadas o en horas pasadas del día actual");
        }
        
        // 4. Validar que el día de la semana permita reservas (Lunes a Sábado)
        java.time.DayOfWeek diaSemana = bloqueHorarioService.obtenerDiaSemanaLima(requestDTO.getFechaReserva());
        if (!bloqueHorarioService.esDiaValidoParaReservas(diaSemana)) {
            throw new IllegalArgumentException("No se permiten reservas los domingos");
        }
        
        // 5. Verificar existencia del profesor
        Optional<Profesor> profesorOpt = profesorRepository.findById(requestDTO.getProfesorId());
        if (profesorOpt.isEmpty()) {
            throw new IllegalArgumentException("El profesor con ID " + requestDTO.getProfesorId() + " no existe");
        }
        Profesor profesor = profesorOpt.get();
        
        // 6. Verificar existencia del aula virtual
        Optional<AulaVirtual> aulaVirtualOpt = aulaVirtualRepository.findById(requestDTO.getAulaVirtualId());
        if (aulaVirtualOpt.isEmpty()) {
            throw new IllegalArgumentException("El aula virtual con ID " + requestDTO.getAulaVirtualId() + " no existe");
        }
        AulaVirtual aulaVirtual = aulaVirtualOpt.get();
        
        // 7. Verificar existencia del curso
        Optional<Curso> cursoOpt = cursoRepository.findById(requestDTO.getCursoId());
        if (cursoOpt.isEmpty()) {
            throw new IllegalArgumentException("El curso con ID " + requestDTO.getCursoId() + " no existe");
        }
        Curso curso = cursoOpt.get();
        
        // 8. Validar disponibilidad institucional (feriados, mantenimiento, eventos)
        List<CalendarioInstitucional> bloqueosInstitucionales = calendarioRepository
            .findTodosLosBloqueosParaAulaYFecha(aulaVirtual, requestDTO.getFechaReserva());
        
        if (!bloqueosInstitucionales.isEmpty()) {
            CalendarioInstitucional bloqueo = bloqueosInstitucionales.get(0);
            String tipoAula = bloqueo.getAulaVirtual() == null ? "todas las aulas" : 
                             "el aula " + aulaVirtual.getCodigo();
            
            throw new IllegalArgumentException("No se puede reservar para la fecha " + 
                requestDTO.getFechaReserva() + ". Motivo: " + bloqueo.getDescripcion() + 
                " (" + bloqueo.getTipoBloqueo() + ") que afecta " + tipoAula);
        }
        
        // 9. VALIDAR CONFLICTOS DE HORARIO - BLOQUEAR HORAS YA RESERVADAS
        List<Reserva> reservasConflictivas = reservaRepository.findConflictingReservas(
            aulaVirtual, 
            requestDTO.getFechaReserva(), 
            requestDTO.getHoraInicio(), 
            requestDTO.getHoraFin()
        );
        
        if (!reservasConflictivas.isEmpty()) {
            Reserva reservaConflictiva = reservasConflictivas.get(0);
            String profesorConflicto = reservaConflictiva.getProfesor().getNombres() + " " + 
                                     reservaConflictiva.getProfesor().getApellidos();
            
            throw new IllegalArgumentException(String.format(
                "El aula '%s' ya está reservada en ese horario (%s - %s) por %s para el curso '%s'",
                aulaVirtual.getCodigo(),
                reservaConflictiva.getHoraInicio(),
                reservaConflictiva.getHoraFin(),
                profesorConflicto,
                reservaConflictiva.getCurso().getNombre()
            ));
        }
        
        // 10. Validar que el profesor tenga asignado el curso
        if (!profesorRepository.profesorTieneCursoAsignado(requestDTO.getProfesorId(), requestDTO.getCursoId())) {
            throw new IllegalArgumentException("El profesor no tiene asignado este curso. " +
                "Solo puede reservar aulas para cursos que tenga asignados.");
        }
        
        // 11. Validar que el estado sea válido
        if (!EstadoReserva.esValido(requestDTO.getEstado())) {
            throw new IllegalArgumentException("Estado de reserva no válido: " + requestDTO.getEstado() + 
                ". Estados válidos: PENDIENTE, CONFIRMADA, CANCELADA, COMPLETADA");
        }
        
        // 12. Crear la nueva reserva
        Reserva nuevaReserva = new Reserva(
            profesor,
            aulaVirtual,
            curso,
            requestDTO.getHoraInicio(),
            requestDTO.getHoraFin(),
            requestDTO.getFechaReserva(),
            requestDTO.getMotivo(),
            requestDTO.getEstado()
        );        // 13. Guardar la reserva
        Reserva reservaGuardada = reservaRepository.save(nuevaReserva);
        
        // 14. Enviar notificación por correo de forma ASÍNCRONA usando servicio de notificación
        System.out.println("🚀 [MAIN THREAD] Reserva guardada exitosamente, enviando notificación async...");
        notificacionService.enviarNotificacionReserva(crearNotificacionDTO(reservaGuardada));
        System.out.println("✅ [MAIN THREAD] Solicitud de notificación enviada, continuando con respuesta...");
        
        // 15. Convertir a DTO de respuesta y retornar inmediatamente
        return convertirAResponseDTO(reservaGuardada);
    }
    
    
    
    /**
     * Obtiene todas las reservas de un profesor
     */
    public List<ReservaResponseDTO> obtenerReservasPorProfesor(Long profesorId) {
        List<Reserva> reservas = reservaRepository.findByProfesorId(profesorId);
        return reservas.stream()
                .map(this::convertirAResponseDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtiene las reservas de un aula virtual en una fecha específica
     */
    public List<ReservaResponseDTO> obtenerReservasPorAulaYFecha(Long aulaVirtualId, String fecha) {
        List<Reserva> reservas = reservaRepository.findByAulaVirtualIdAndFechaReserva(
            aulaVirtualId, 
            java.time.LocalDate.parse(fecha)
        );
        return reservas.stream()
                .map(this::convertirAResponseDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtiene todas las reservas por estado
     */
    public List<ReservaResponseDTO> obtenerReservasPorEstado(String estado) {
        List<Reserva> reservas = reservaRepository.findByEstado(estado);
        return reservas.stream()
                .map(this::convertirAResponseDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Convierte una entidad Reserva a ReservaResponseDTO
     */
    private ReservaResponseDTO convertirAResponseDTO(Reserva reserva) {        return new ReservaResponseDTO(
            reserva.getId(),
            obtenerNombreCompleto(reserva.getProfesor()),
            reserva.getAulaVirtual().getCodigo(),
            reserva.getCurso().getNombre(),
            reserva.getFechaReserva(),
            reserva.getHoraInicio(),
            reserva.getHoraFin(),
            reserva.getMotivo(),
            reserva.getEstado(),
            reserva.getFechaCreacion()
        );
    }    /**
     * Obtiene el nombre completo del profesor
     */
    private String obtenerNombreCompleto(Profesor profesor) {
        String nombreCompleto = "";
        if (profesor.getNombres() != null && profesor.getApellidos() != null) {
            nombreCompleto = profesor.getNombres() + " " + profesor.getApellidos();
        } else {
            nombreCompleto = "Profesor ID: " + profesor.getId();
        }        return nombreCompleto.trim();
    }
    
    /**
     * Verifica si hay conflicto de horarios para una nueva reserva
     */
    public boolean verificarConflictoHorario(Long aulaVirtualId, java.time.LocalDate fecha, 
                                           java.time.LocalTime horaInicio, java.time.LocalTime horaFin) {
        Optional<AulaVirtual> aulaVirtualOpt = aulaVirtualRepository.findById(aulaVirtualId);
        if (aulaVirtualOpt.isEmpty()) {
            return true; // Si el aula no existe, hay "conflicto" 
        }
        
        AulaVirtual aulaVirtual = aulaVirtualOpt.get();
        
        List<Reserva> reservasConflictivas = reservaRepository.findConflictingReservas(
            aulaVirtual, fecha, horaInicio, horaFin
        );
        
        return !reservasConflictivas.isEmpty();
    }
      /**
     * Obtiene las reservas que entran en conflicto con el horario especificado
     */
    public List<ReservaResponseDTO> obtenerReservasConflicto(Long aulaVirtualId, java.time.LocalDate fecha,
                                                           java.time.LocalTime horaInicio, java.time.LocalTime horaFin) {
        Optional<AulaVirtual> aulaVirtualOpt = aulaVirtualRepository.findById(aulaVirtualId);
        if (aulaVirtualOpt.isEmpty()) {
            return List.of(); // Si el aula no existe, retornar lista vacía
        }
        
        AulaVirtual aulaVirtual = aulaVirtualOpt.get();
        
        List<Reserva> reservasConflictivas = reservaRepository.findConflictingReservas(
            aulaVirtual, fecha, horaInicio, horaFin
        );
        
        return reservasConflictivas.stream()            .map(this::convertirAResponseDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Crea un DTO de notificación a partir de una reserva guardada
     */
    private NotificacionReservaDTO crearNotificacionDTO(Reserva reserva) {
        return new NotificacionReservaDTO(
            obtenerNombreCompleto(reserva.getProfesor()),
            reserva.getProfesor().getCorreo(),
            reserva.getAulaVirtual().getCodigo(),
            reserva.getAulaVirtual().getDescripcion() != null ? reserva.getAulaVirtual().getDescripcion() : reserva.getAulaVirtual().getCodigo(),
            reserva.getCurso().getNombre(),
            reserva.getFechaReserva(),
            reserva.getHoraInicio(),
            reserva.getHoraFin(),
            reserva.getMotivo(),
            reserva.getEstado().toString(),
            reserva.getId()
        );
    }

    /**
     * Obtener motivos de reserva predefinidos
     */
    public List<String> obtenerMotivosReserva() {
        return List.of(
            "Clase regular",
            "Clase de recuperación", 
            "Examen parcial",
            "Examen final",
            "Presentación de trabajos",
            "Tutoría grupal",
            "Sesión de laboratorio",
            "Capacitación docente",
            "Reunión de coordinación",
            "Evento académico",
            "Otro"
        );
    }

    /**
     * Verificar disponibilidad de aula y fecha
     */
    public Map<String, Object> verificarDisponibilidad(Long aulaVirtualId, String fecha, 
                                                       String horaInicio, String horaFin) {
        try {
            java.time.LocalDate fechaParsed = java.time.LocalDate.parse(fecha);
            
            // Verificar bloqueos institucionales
            com.tecsup.back_springboot_srvt.model.AulaVirtual aula = aulaVirtualRepository.findById(aulaVirtualId).orElse(null);
            List<com.tecsup.back_springboot_srvt.model.CalendarioInstitucional> bloqueos = 
                calendarioRepository.findTodosLosBloqueosParaAulaYFecha(aula, fechaParsed);
            
            Map<String, Object> disponibilidad = new HashMap<>();
            disponibilidad.put("disponible", bloqueos.isEmpty());
            
            if (!bloqueos.isEmpty()) {
                com.tecsup.back_springboot_srvt.model.CalendarioInstitucional bloqueo = bloqueos.get(0);
                disponibilidad.put("motivo", bloqueo.getDescripcion());
                disponibilidad.put("tipoBloqueo", bloqueo.getTipoBloqueo());
                disponibilidad.put("esBloqueoGlobal", bloqueo.getAulaVirtual() == null);
            }
            
            // Si hay horario, verificar conflictos
            if (horaInicio != null && horaFin != null && bloqueos.isEmpty()) {
                boolean hayConflicto = verificarConflictoHorario(
                    aulaVirtualId, 
                    fechaParsed,
                    java.time.LocalTime.parse(horaInicio),
                    java.time.LocalTime.parse(horaFin)
                );
                
                if (hayConflicto) {
                    disponibilidad.put("disponible", false);
                    disponibilidad.put("motivo", "El aula ya está reservada en este horario");
                    disponibilidad.put("tipoBloqueo", "RESERVA");
                }
            }
            
            return disponibilidad;
        } catch (Exception e) {
            throw new RuntimeException("Error al verificar disponibilidad: " + e.getMessage(), e);
        }
    }

    /**
     * Verificar conflicto de horarios con respuesta estructurada
     */
    public Map<String, Object> verificarConflictoHorario(Long aulaVirtualId, String fecha, 
                                                         String horaInicio, String horaFin) {
        try {
            java.time.LocalDate fechaParsed = java.time.LocalDate.parse(fecha);
            java.time.LocalTime horaInicioParsed = java.time.LocalTime.parse(horaInicio);
            java.time.LocalTime horaFinParsed = java.time.LocalTime.parse(horaFin);
            
            boolean hayConflicto = verificarConflictoHorario(aulaVirtualId, fechaParsed, horaInicioParsed, horaFinParsed);
            
            Map<String, Object> resultado = new HashMap<>();
            resultado.put("hayConflicto", hayConflicto);
            
            if (hayConflicto) {
                List<ReservaResponseDTO> reservasConflicto = obtenerReservasConflicto(
                    aulaVirtualId, fechaParsed, horaInicioParsed, horaFinParsed);
                resultado.put("reservasConflicto", reservasConflicto);
                resultado.put("mensaje", "Ya existe una reserva en este horario");
            } else {
                resultado.put("mensaje", "Horario disponible");
            }
            
            return resultado;
        } catch (Exception e) {
            throw new RuntimeException("Error al verificar conflicto: " + e.getMessage(), e);
        }
    }

    /**
     * Obtener horas ocupadas para una fecha y aula
     */
    public List<Map<String, Object>> obtenerHorasOcupadas(Long aulaId, String fecha) {
        try {
            List<ReservaResponseDTO> reservasActivas = obtenerReservasPorAulaYFecha(aulaId, fecha);
            
            return reservasActivas.stream()
                .map(reserva -> {
                    Map<String, Object> rango = new HashMap<>();
                    rango.put("horaInicio", reserva.getHoraInicio().toString());
                    rango.put("horaFin", reserva.getHoraFin().toString());
                    rango.put("profesorNombre", reserva.getProfesorNombre());
                    rango.put("cursoNombre", reserva.getCursoNombre());
                    rango.put("reservaId", reserva.getId());
                    return rango;
                })
                .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener horas ocupadas: " + e.getMessage(), e);
        }
    }
}
