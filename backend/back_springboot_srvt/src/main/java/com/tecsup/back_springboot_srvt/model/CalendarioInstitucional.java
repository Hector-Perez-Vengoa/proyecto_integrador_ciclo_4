package com.tecsup.back_springboot_srvt.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "calendario_institucionaldb")
public class CalendarioInstitucional {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;
    
    @Column(name = "fecha_fin", nullable = false)
    private LocalDate fechaFin;
    
    @Column(name = "tipo_bloqueo", nullable = false)
    private String tipoBloqueo; 
    
    @Column(name = "descripcion", nullable = false)
    private String descripcion;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aula_virtual_id")
    private AulaVirtual aulaVirtual; 
    
    @Column(name = "activo", nullable = false)
    private Boolean activo = true;
    
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
    
   
    public CalendarioInstitucional() {
        this.fechaCreacion = LocalDateTime.now();
    }
    
    public CalendarioInstitucional(LocalDate fechaInicio, LocalDate fechaFin, String tipoBloqueo, 
                                 String descripcion, AulaVirtual aulaVirtual) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.tipoBloqueo = tipoBloqueo;
        this.descripcion = descripcion;
        this.aulaVirtual = aulaVirtual;
        this.activo = true;
        this.fechaCreacion = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public LocalDate getFechaInicio() {
        return fechaInicio;
    }
    
    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }
    
    public LocalDate getFechaFin() {
        return fechaFin;
    }
    
    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }
    
    public String getTipoBloqueo() {
        return tipoBloqueo;
    }
    
    public void setTipoBloqueo(String tipoBloqueo) {
        this.tipoBloqueo = tipoBloqueo;
    }
    
    public String getDescripcion() {
        return descripcion;
    }
    
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    
    public AulaVirtual getAulaVirtual() {
        return aulaVirtual;
    }
    
    public void setAulaVirtual(AulaVirtual aulaVirtual) {
        this.aulaVirtual = aulaVirtual;
    }
    
    public Boolean getActivo() {
        return activo;
    }
    
    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
    
    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }
    
    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
}
