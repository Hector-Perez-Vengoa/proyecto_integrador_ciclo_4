package com.tecsup.back_springboot_srvt.dto;

import java.time.LocalDateTime;

public class AulaVirtualResponse {
    
    private Long id;
    private String codigo;
    private String estado;
    private String descripcion;
    private LocalDateTime fechaCreacion;

    // Constructors
    public AulaVirtualResponse() {}

    public AulaVirtualResponse(Long id, String codigo, String estado, String descripcion, LocalDateTime fechaCreacion) {
        this.id = id;
        this.codigo = codigo;
        this.estado = estado;
        this.descripcion = descripcion;
        this.fechaCreacion = fechaCreacion;
    }

    // Getters and Setters
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
