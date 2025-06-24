package com.tecsup.back_springboot_srvt.service;

import com.tecsup.back_springboot_srvt.config.BloquesConfig;
import com.tecsup.back_springboot_srvt.config.BloquesConfig.BloqueHorario;
import com.tecsup.back_springboot_srvt.dto.BloqueHorarioDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.Duration;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Arrays;

@Service
public class BloqueHorarioService {
    
    @Autowired
    private BloquesConfig bloquesConfig;
    
    // Configuración de horarios permitidos
    private static final LocalTime HORA_APERTURA = LocalTime.of(8, 0);  // 08:00 AM
    private static final LocalTime HORA_CIERRE = LocalTime.of(22, 0);   // 10:00 PM
    private static final int DURACION_MINIMA_MINUTOS = 45;              // 45 minutos
    private static final int DURACION_MAXIMA_MINUTOS = 240;             // 4 horas
    private static final ZoneId ZONA_LIMA = ZoneId.of("America/Lima");   // Zona horaria de Perú
      /**
     * Valida si un horario está dentro del rango permitido (08:00 - 22:00)
     */
    public boolean estaEnRangoPermitido(LocalTime hora) {
        return !hora.isBefore(HORA_APERTURA) && !hora.isAfter(HORA_CIERRE);
    }
    
    /**
     * Valida si un horario de reserva es válido según las nuevas reglas:
     * - Duración mínima: 45 minutos
     * - Duración máxima: 4 horas (240 minutos)
     * - Solo múltiplos de 60 minutos después de los 45 minutos iniciales
     * - Horario entre 08:00 y 22:00
     */
    public boolean esHorarioValido(LocalTime horaInicio, LocalTime horaFin) {
        // Validar que esté en el rango permitido
        if (!estaEnRangoPermitido(horaInicio) || !estaEnRangoPermitido(horaFin)) {
            return false;
        }
        
        // Validar que hora fin > hora inicio
        if (!horaFin.isAfter(horaInicio)) {
            return false;
        }
        
        // Calcular duración en minutos
        long duracionMinutos = Duration.between(horaInicio, horaFin).toMinutes();
        
        // Validar duración mínima y máxima
        if (duracionMinutos < DURACION_MINIMA_MINUTOS || duracionMinutos > DURACION_MAXIMA_MINUTOS) {
            return false;
        }
        
        // Permitir 45 minutos exactos o múltiplos de 60 minutos
        return duracionMinutos == 45 || duracionMinutos % 60 == 0;
    }
    
    /**
     * Genera un mensaje de error descriptivo para horarios no válidos
     */
    public String generarMensajeErrorHorario(LocalTime horaInicio, LocalTime horaFin) {
        // Validar rango de horarios
        if (!estaEnRangoPermitido(horaInicio) || !estaEnRangoPermitido(horaFin)) {
            return String.format("Las reservas solo están permitidas entre %s y %s. " +
                    "Horario solicitado: %s - %s", 
                    HORA_APERTURA, HORA_CIERRE, horaInicio, horaFin);
        }
        
        // Validar que hora fin > hora inicio
        if (!horaFin.isAfter(horaInicio)) {
            return "La hora de fin debe ser posterior a la hora de inicio.";
        }
        
        long duracionMinutos = Duration.between(horaInicio, horaFin).toMinutes();
        
        // Validar duración
        if (duracionMinutos < DURACION_MINIMA_MINUTOS) {
            return String.format("La duración mínima de una reserva es de %d minutos. " +
                    "Duración solicitada: %d minutos.", 
                    DURACION_MINIMA_MINUTOS, duracionMinutos);
        }
        
        if (duracionMinutos > DURACION_MAXIMA_MINUTOS) {
            return String.format("La duración máxima de una reserva es de %d minutos (%d horas). " +
                    "Duración solicitada: %d minutos.", 
                    DURACION_MAXIMA_MINUTOS, DURACION_MAXIMA_MINUTOS / 60, duracionMinutos);
        }
        
        // Validar múltiplos permitidos
        if (duracionMinutos != 45 && duracionMinutos % 60 != 0) {
            return String.format("La duración debe ser de 45 minutos exactos o múltiplos de 60 minutos. " +
                    "Duraciones válidas: 45min, 60min, 120min, 180min, 240min. " +
                    "Duración solicitada: %d minutos.", duracionMinutos);
        }
        
        return "Horario válido.";
    }
    
    /**
     * Obtiene la fecha y hora actual en la zona horaria de Lima, Perú
     */
    public ZonedDateTime obtenerFechaHoraLima() {
        return ZonedDateTime.now(ZONA_LIMA);
    }
      /**
     * Valida si la fecha de reserva es válida (no puede ser en el pasado)
     */
    public boolean esFechaValida(java.time.LocalDate fechaReserva) {
        java.time.LocalDate hoyLima = obtenerFechaHoraLima().toLocalDate();
        return !fechaReserva.isBefore(hoyLima);
    }
    
    /**
     * Valida si la fecha y hora de reserva son válidas (no pueden ser en el pasado)
     * Para el día actual, también valida que la hora no sea pasada
     */
    public boolean esFechaHoraValida(java.time.LocalDate fechaReserva, java.time.LocalTime horaInicio) {
        ZonedDateTime ahoraLima = obtenerFechaHoraLima();
        java.time.LocalDate hoyLima = ahoraLima.toLocalDate();
        java.time.LocalTime horaActualLima = ahoraLima.toLocalTime();
        
        // Si es una fecha anterior a hoy, no válida
        if (fechaReserva.isBefore(hoyLima)) {
            return false;
        }
        
        // Si es el día actual, verificar que la hora no sea pasada
        if (fechaReserva.equals(hoyLima)) {
            return !horaInicio.isBefore(horaActualLima);
        }
        
        // Si es una fecha futura, es válida
        return true;
    }
    
    /**
     * Normaliza un horario al bloque más cercano - DEPRECATED
     * Ya no se usan bloques predefinidos, se permite duración libre
     */
    @Deprecated
    public BloqueHorario normalizarHorario(LocalTime horaInicio, LocalTime horaFin) {        // Ya no se usan bloques predefinidos, permitir duración libre
        // Crear un bloque ficticio con la duración solicitada si es válida
        if (esHorarioValido(horaInicio, horaFin)) {
            return new BloqueHorario(1, horaInicio, horaFin, 
                String.format("Reserva: %s - %s", horaInicio, horaFin));
        }
        return null;
    }
      /**
     * Obtiene todos los bloques horarios como DTOs para compatibilidad
     */
    public List<BloqueHorarioDTO> obtenerTodosLosBloquesDTO() {
        try {
            List<BloqueHorario> bloques = bloquesConfig.generarBloquesDisponibles();
            return bloques.stream()
                .map(bloque -> new BloqueHorarioDTO(
                    bloque.getNumero(),
                    bloque.getInicio(),
                    bloque.getFin(),
                    bloque.getDescripcion()
                ))
                .collect(Collectors.toList());
        } catch (Exception e) {
            // Si hay error con la configuración, devolver bloques básicos
            return Arrays.asList(
                new BloqueHorarioDTO(1, LocalTime.of(8, 0), LocalTime.of(9, 0), "Bloque 1: 08:00-09:00"),
                new BloqueHorarioDTO(2, LocalTime.of(9, 0), LocalTime.of(10, 0), "Bloque 2: 09:00-10:00"),
                new BloqueHorarioDTO(3, LocalTime.of(10, 0), LocalTime.of(11, 0), "Bloque 3: 10:00-11:00"),
                new BloqueHorarioDTO(4, LocalTime.of(11, 0), LocalTime.of(12, 0), "Bloque 4: 11:00-12:00"),
                new BloqueHorarioDTO(5, LocalTime.of(14, 0), LocalTime.of(15, 0), "Bloque 5: 14:00-15:00"),
                new BloqueHorarioDTO(6, LocalTime.of(15, 0), LocalTime.of(16, 0), "Bloque 6: 15:00-16:00"),
                new BloqueHorarioDTO(7, LocalTime.of(16, 0), LocalTime.of(17, 0), "Bloque 7: 16:00-17:00"),
                new BloqueHorarioDTO(8, LocalTime.of(17, 0), LocalTime.of(18, 0), "Bloque 8: 17:00-18:00"),
                new BloqueHorarioDTO(9, LocalTime.of(18, 0), LocalTime.of(19, 0), "Bloque 9: 18:00-19:00"),
                new BloqueHorarioDTO(10, LocalTime.of(19, 0), LocalTime.of(20, 0), "Bloque 10: 19:00-20:00"),
                new BloqueHorarioDTO(11, LocalTime.of(20, 0), LocalTime.of(21, 0), "Bloque 11: 20:00-21:00"),
                new BloqueHorarioDTO(12, LocalTime.of(21, 0), LocalTime.of(22, 0), "Bloque 12: 21:00-22:00")
            );
        }
    }
    
    /**
     * Obtiene información sobre las duraciones permitidas para el frontend
     */
    public List<String> obtenerDuracionesPermitidas() {
        return List.of(
            "45 minutos",
            "1 hora (60 minutos)",
            "2 horas (120 minutos)", 
            "3 horas (180 minutos)",
            "4 horas (240 minutos)"
        );
    }
    
    /**
     * Verifica si una hora específica está en un bloque válido
     */
    public boolean esHoraEnBloqueValido(LocalTime hora) {
        return estaEnRangoPermitido(hora);
    }
    
    /**
     * Calcula cuántos bloques de 45 minutos caben en una duración
     */
    public int calcularNumeroBloques(LocalTime horaInicio, LocalTime horaFin) {
        long duracionMinutos = Duration.between(horaInicio, horaFin).toMinutes();
        return (int) Math.ceil(duracionMinutos / 45.0);
    }
    
    /**
     * Valida si el día de la semana es válido para reservas (configurable)
     */
    public boolean esDiaValidoParaReservas(java.time.DayOfWeek diaSemana) {
        // En Perú, permitir reservas de Lunes a Sábado
        return diaSemana != java.time.DayOfWeek.SUNDAY;
    }
      /**
     * Obtiene el día de la semana en zona horaria de Lima
     */
    public java.time.DayOfWeek obtenerDiaSemanaLima(java.time.LocalDate fecha) {
        return fecha.atStartOfDay(ZONA_LIMA).getDayOfWeek();
    }

}