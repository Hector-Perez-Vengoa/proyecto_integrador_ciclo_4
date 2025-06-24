package com.tecsup.back_springboot_srvt.dto;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * DTO para encapsular la información necesaria para enviar notificaciones de reserva
 */
public class NotificacionReservaDTO {
    
    private String nombreProfesor;
    private String emailProfesor;
    private String codigoAula;
    private String nombreAula;
    private String nombreCurso;
    private LocalDate fechaReserva;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private String motivo;
    private String estadoReserva;
    private Long reservaId;
    
    // Constructor vacío
    public NotificacionReservaDTO() {}
    
    // Constructor completo
    public NotificacionReservaDTO(String nombreProfesor, String emailProfesor, String codigoAula, 
                                  String nombreAula, String nombreCurso, LocalDate fechaReserva, 
                                  LocalTime horaInicio, LocalTime horaFin, String motivo, 
                                  String estadoReserva, Long reservaId) {
        this.nombreProfesor = nombreProfesor;
        this.emailProfesor = emailProfesor;
        this.codigoAula = codigoAula;
        this.nombreAula = nombreAula;
        this.nombreCurso = nombreCurso;
        this.fechaReserva = fechaReserva;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.motivo = motivo;
        this.estadoReserva = estadoReserva;
        this.reservaId = reservaId;
    }
    
    // Getters y Setters
    public String getNombreProfesor() {
        return nombreProfesor;
    }
    
    public void setNombreProfesor(String nombreProfesor) {
        this.nombreProfesor = nombreProfesor;
    }
    
    public String getEmailProfesor() {
        return emailProfesor;
    }
    
    public void setEmailProfesor(String emailProfesor) {
        this.emailProfesor = emailProfesor;
    }
    
    public String getCodigoAula() {
        return codigoAula;
    }
    
    public void setCodigoAula(String codigoAula) {
        this.codigoAula = codigoAula;
    }
    
    public String getNombreAula() {
        return nombreAula;
    }
    
    public void setNombreAula(String nombreAula) {
        this.nombreAula = nombreAula;
    }
    
    public String getNombreCurso() {
        return nombreCurso;
    }
    
    public void setNombreCurso(String nombreCurso) {
        this.nombreCurso = nombreCurso;
    }
    
    public LocalDate getFechaReserva() {
        return fechaReserva;
    }
    
    public void setFechaReserva(LocalDate fechaReserva) {
        this.fechaReserva = fechaReserva;
    }
    
    public LocalTime getHoraInicio() {
        return horaInicio;
    }
    
    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }
    
    public LocalTime getHoraFin() {
        return horaFin;
    }
    
    public void setHoraFin(LocalTime horaFin) {
        this.horaFin = horaFin;
    }
    
    public String getMotivo() {
        return motivo;
    }
    
    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }
    
    public String getEstadoReserva() {
        return estadoReserva;
    }
    
    public void setEstadoReserva(String estadoReserva) {
        this.estadoReserva = estadoReserva;
    }
    
    public Long getReservaId() {
        return reservaId;
    }
    
    public void setReservaId(Long reservaId) {
        this.reservaId = reservaId;
    }
}
