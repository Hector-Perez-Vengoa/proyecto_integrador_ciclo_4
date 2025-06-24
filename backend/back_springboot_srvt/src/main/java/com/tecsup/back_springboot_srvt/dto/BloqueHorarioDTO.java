package com.tecsup.back_springboot_srvt.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalTime;

public class BloqueHorarioDTO {
    
    private int numero;
    
    @JsonFormat(pattern = "HH:mm")
    private LocalTime inicio;
    
    @JsonFormat(pattern = "HH:mm")
    private LocalTime fin;
    
    private String descripcion;
      // Constructors
    public BloqueHorarioDTO() {}
    
    public BloqueHorarioDTO(int numero, LocalTime inicio, LocalTime fin) {
        this.numero = numero;
        this.inicio = inicio;
        this.fin = fin;
        this.descripcion = String.format("Bloque %d: %s - %s", numero, inicio, fin);
    }
    
    public BloqueHorarioDTO(int numero, LocalTime inicio, LocalTime fin, String descripcion) {
        this.numero = numero;
        this.inicio = inicio;
        this.fin = fin;
        this.descripcion = descripcion;
    }
    
    // Getters and Setters
    public int getNumero() {
        return numero;
    }
    
    public void setNumero(int numero) {
        this.numero = numero;
    }
    
    public LocalTime getInicio() {
        return inicio;
    }
    
    public void setInicio(LocalTime inicio) {
        this.inicio = inicio;
    }
    
    public LocalTime getFin() {
        return fin;
    }
    
    public void setFin(LocalTime fin) {
        this.fin = fin;
    }
    
    public String getDescripcion() {
        return descripcion;
    }
    
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}
