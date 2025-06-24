package com.tecsup.back_springboot_srvt.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO para solicitud de cancelación de reserva
 */
public class CancelacionReservaDTO {
    
    @NotBlank(message = "El motivo de cancelación es obligatorio")
    @Size(min = 10, max = 500, message = "El motivo debe tener entre 10 y 500 caracteres")
    private String motivoCancelacion;
    
    private String observaciones;
    
    // Constructor vacío
    public CancelacionReservaDTO() {}
    
    // Constructor con parámetros
    public CancelacionReservaDTO(String motivoCancelacion, String observaciones) {
        this.motivoCancelacion = motivoCancelacion;
        this.observaciones = observaciones;
    }
    
    // Getters y Setters
    public String getMotivoCancelacion() {
        return motivoCancelacion;
    }
    
    public void setMotivoCancelacion(String motivoCancelacion) {
        this.motivoCancelacion = motivoCancelacion;
    }
    
    public String getObservaciones() {
        return observaciones;
    }
    
    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
}
