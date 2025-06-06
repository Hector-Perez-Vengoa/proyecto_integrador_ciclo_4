package com.tecsup.back_springboot_srvt.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "aula_virtualdb")
public class AulaVirtual {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "codigo", unique = true, nullable = false)
    private String codigo;
    
    @Column(name = "estado", nullable = false)
    private String estado;
    
    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    // Constructores
    public AulaVirtual() {}

    public AulaVirtual(String codigo, String estado, String descripcion) {
        this.codigo = codigo;
        this.estado = estado;
        this.descripcion = descripcion;
        this.fechaCreacion = LocalDateTime.now();
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
}

