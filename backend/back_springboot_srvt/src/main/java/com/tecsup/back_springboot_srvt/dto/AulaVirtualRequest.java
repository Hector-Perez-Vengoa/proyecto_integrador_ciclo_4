package com.tecsup.back_springboot_srvt.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AulaVirtualRequest {
    
    @NotBlank(message = "El código es obligatorio")
    @Size(max = 20, message = "El código no puede exceder 20 caracteres")
    private String codigo;
    
    @NotBlank(message = "El estado es obligatorio")
    private String estado;
    
    @Size(max = 255, message = "La descripción no puede exceder 255 caracteres")
    private String descripcion;

    // Constructors
    public AulaVirtualRequest() {}

    public AulaVirtualRequest(String codigo, String estado, String descripcion) {
        this.codigo = codigo;
        this.estado = estado;
        this.descripcion = descripcion;
    }

    // Getters and Setters
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
}
