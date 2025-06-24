package com.tecsup.back_springboot_srvt.service;

import com.tecsup.back_springboot_srvt.dto.CancelacionReservaDTO;
import com.tecsup.back_springboot_srvt.enums.EstadoReserva;
import com.tecsup.back_springboot_srvt.model.Reserva;
import com.tecsup.back_springboot_srvt.repository.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

/**
 * Servicio para gestión de cancelaciones y control de inasistencias
 */
@Service
public class CancelacionService {

    @Autowired
    private ReservaRepository reservaRepository;
    
    
    @Value("${reservas.politicas.horas-minimas-cancelacion:2}")
    private int horasMinimasCancelacion;

    /**
     * Cancela una reserva por parte del profesor
     */
    @Transactional
    public void cancelarReservaPorProfesor(Long reservaId, Long profesorId, CancelacionReservaDTO cancelacionDTO) 
            throws Exception {
        
        // 1. Verificar que la reserva existe y pertenece al profesor
        Optional<Reserva> reservaOpt = reservaRepository.findById(reservaId);
        if (reservaOpt.isEmpty()) {
            throw new IllegalArgumentException("Reserva no encontrada");
        }
        
        Reserva reserva = reservaOpt.get();
        if (!reserva.getProfesor().getId().equals(profesorId)) {
            throw new IllegalArgumentException("No tiene permisos para cancelar esta reserva");
        }
        
        // 2. Verificar que el estado permite cancelación
        EstadoReserva estadoActual = EstadoReserva.fromString(reserva.getEstado());
        if (!estadoActual.permiteCancelacion()) {
            throw new IllegalArgumentException("La reserva no puede ser cancelada en su estado actual: " + estadoActual);
        }
        
        // 3. Verificar tiempo mínimo de anticipación
        if (!puedeSerCanceladaConAnticipacion(reserva)) {
            throw new IllegalArgumentException(
                "La reserva debe cancelarse con al menos " + horasMinimasCancelacion + " horas de anticipación"
            );
        }
        
        // 4. Procesar cancelación
        reserva.setEstado(EstadoReserva.CANCELADA.getValor());
        reserva.setFechaCancelacion(LocalDateTime.now());
        reserva.setMotivoCancelacion(cancelacionDTO.getMotivoCancelacion());
        reserva.setCanceladoPor("PROFESOR");
        reserva.setObservacionesCancelacion(cancelacionDTO.getObservaciones());
        
        reservaRepository.save(reserva);
    }
      /**
     * Cancela una reserva (para cualquier usuario autenticado)
     */
    @Transactional
    public void cancelarReserva(Long reservaId, CancelacionReservaDTO cancelacionDTO) throws Exception {
        // 1. Verificar que la reserva existe
        Optional<Reserva> reservaOpt = reservaRepository.findById(reservaId);
        if (reservaOpt.isEmpty()) {
            throw new IllegalArgumentException("Reserva no encontrada");
        }
        
        Reserva reserva = reservaOpt.get();
        
        // 2. Verificar que el estado permite cancelación
        EstadoReserva estadoActual = EstadoReserva.fromString(reserva.getEstado());
        if (!estadoActual.permiteCancelacion()) {
            throw new IllegalArgumentException("La reserva no puede ser cancelada en su estado actual: " + estadoActual);
        }
        
        // 3. Verificar tiempo mínimo de anticipación
        if (!puedeSerCanceladaConAnticipacion(reserva)) {
            throw new IllegalArgumentException(
                "La reserva debe cancelarse con al menos " + horasMinimasCancelacion + " horas de anticipación"
            );
        }
        
        // 4. Procesar cancelación
        reserva.setEstado(EstadoReserva.CANCELADA.getValor());
        reserva.setFechaCancelacion(LocalDateTime.now());
        reserva.setMotivoCancelacion(cancelacionDTO.getMotivoCancelacion());
        reserva.setCanceladoPor("USUARIO");
        reserva.setObservacionesCancelacion(cancelacionDTO.getObservaciones());
        
        reservaRepository.save(reserva);
    }
    
    /**
     * Obtiene reservas que pueden ser canceladas por un profesor
     */
    public List<Reserva> obtenerReservasCancelables(Long profesorId) {
        LocalDate fechaActual = LocalDate.now();
        LocalTime horaActual = LocalTime.now();
        
        return reservaRepository.findReservasCancelablesPorProfesor(profesorId, fechaActual, horaActual);
    }
    
    /**
     * Verifica si una reserva puede ser cancelada con la anticipación requerida
     */
    private boolean puedeSerCanceladaConAnticipacion(Reserva reserva) {
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime fechaHoraReserva = LocalDateTime.of(reserva.getFechaReserva(), reserva.getHoraInicio());
        
        long horasHastaReserva = ChronoUnit.HOURS.between(ahora, fechaHoraReserva);
        return horasHastaReserva >= horasMinimasCancelacion;
    }
    
    
    /**
     * Obtiene las políticas de cancelación configuradas
     */
    public String obtenerPoliticasCancelacion() {
        return String.format(
            "Políticas de Cancelación:\n" +
            "- Tiempo mínimo para cancelar: %d horas\n",
            horasMinimasCancelacion
        );
    }
}
