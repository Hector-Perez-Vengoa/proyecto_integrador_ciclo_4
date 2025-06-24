package com.tecsup.back_springboot_srvt.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class ReservaResponseDTO {
    
    private Long id;
    private String profesorNombre;
    private String aulaVirtualNombre;
    private String cursoNombre;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaReserva;
    
    @JsonFormat(pattern = "HH:mm")
    private LocalTime horaInicio;
    
    @JsonFormat(pattern = "HH:mm")
    private LocalTime horaFin;
    
    private String motivo;
    private String estado;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime fechaCreacion;
    
    // Constructors
    public ReservaResponseDTO() {}
    
    public ReservaResponseDTO(Long id, String profesorNombre, String aulaVirtualNombre, 
                            String cursoNombre, LocalDate fechaReserva, LocalTime horaInicio, 
                            LocalTime horaFin, String motivo, String estado, LocalDateTime fechaCreacion) {
        this.id = id;
        this.profesorNombre = profesorNombre;
        this.aulaVirtualNombre = aulaVirtualNombre;
        this.cursoNombre = cursoNombre;
        this.fechaReserva = fechaReserva;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.motivo = motivo;
        this.estado = estado;
        this.fechaCreacion = fechaCreacion;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getProfesorNombre() {
        return profesorNombre;
    }
    
    public void setProfesorNombre(String profesorNombre) {
        this.profesorNombre = profesorNombre;
    }
    
    public String getAulaVirtualNombre() {
        return aulaVirtualNombre;
    }
    
    public void setAulaVirtualNombre(String aulaVirtualNombre) {
        this.aulaVirtualNombre = aulaVirtualNombre;
    }
    
    public String getCursoNombre() {
        return cursoNombre;
    }
    
    public void setCursoNombre(String cursoNombre) {
        this.cursoNombre = cursoNombre;
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
    
    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }
    
    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
}
