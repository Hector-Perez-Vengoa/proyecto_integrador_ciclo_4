package com.tecsup.back_springboot_srvt.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.time.LocalTime;

public class ReservaRequestDTO {
    
    @NotNull(message = "El ID del usuario es obligatorio")
    private Integer userId;
    
    @NotNull(message = "El ID del aula virtual es obligatorio")
    private Long aulaVirtualId;
    
    @NotNull(message = "El ID del curso es obligatorio")
    private Long cursoId;
    
    @NotNull(message = "La fecha de reserva es obligatoria")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaReserva;
    
    @NotNull(message = "La hora de inicio es obligatoria")
    @JsonFormat(pattern = "HH:mm")
    private LocalTime horaInicio;
    
    @NotNull(message = "La hora de fin es obligatoria")
    @JsonFormat(pattern = "HH:mm")
    private LocalTime horaFin;
    
    @Size(max = 500, message = "El motivo no puede exceder los 500 caracteres")
    private String motivo;
    
    @NotBlank(message = "El estado es obligatorio")
    private String estado;
    
    // Constructors
    public ReservaRequestDTO() {}
    
    public ReservaRequestDTO(Integer userId, Long aulaVirtualId, Long cursoId, 
                           LocalDate fechaReserva, LocalTime horaInicio, LocalTime horaFin, 
                           String motivo, String estado) {
        this.userId = userId;
        this.aulaVirtualId = aulaVirtualId;
        this.cursoId = cursoId;
        this.fechaReserva = fechaReserva;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.motivo = motivo;
        this.estado = estado;
    }
    
    // Getters and Setters
    public Integer getUserId() {
        return userId;
    }
    
    public void setUserId(Integer userId) {
        this.userId = userId;
    }
    
    public Long getAulaVirtualId() {
        return aulaVirtualId;
    }
    
    public void setAulaVirtualId(Long aulaVirtualId) {
        this.aulaVirtualId = aulaVirtualId;
    }
    
    public Long getCursoId() {
        return cursoId;
    }
    
    public void setCursoId(Long cursoId) {
        this.cursoId = cursoId;
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
    
    public String getEstado() {
        return estado;
    }
    
    public void setEstado(String estado) {
        this.estado = estado;
    }
}
