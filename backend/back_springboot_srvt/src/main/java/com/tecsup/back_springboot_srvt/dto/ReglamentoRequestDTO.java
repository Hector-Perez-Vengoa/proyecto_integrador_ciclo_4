package com.tecsup.back_springboot_srvt.dto;

import jakarta.validation.constraints.*;

public class ReglamentoRequestDTO {
    
    @NotBlank(message = "El título es obligatorio")
    @Size(max = 200, message = "El título no puede exceder los 200 caracteres")
    private String titulo;
    
    @Size(max = 1000, message = "La descripción no puede exceder los 1000 caracteres")
    private String descripcion;
    
    @NotBlank(message = "El tipo es obligatorio")
    @Pattern(regexp = "general|uso_aulas|reservas|sanciones|procedimientos|otros", 
             message = "Tipo no válido")
    private String tipo;
    
    @NotBlank(message = "La versión es obligatoria")
    @Size(max = 20, message = "La versión no puede exceder los 20 caracteres")
    private String version;
    
    @NotBlank(message = "La ruta del archivo es obligatoria")
    private String rutaArchivo;
    
    @Min(value = 0, message = "El tamaño del archivo no puede ser negativo")
    private Long tamanoArchivo;
    
    @NotBlank(message = "El autor es obligatorio")
    @Size(max = 100, message = "El autor no puede exceder los 100 caracteres")
    private String autor;
    
    private Boolean esObligatorio = false;
    
    @Size(max = 2000, message = "Los metadatos no pueden exceder los 2000 caracteres")
    private String metadatos;
    
    // Constructors
    public ReglamentoRequestDTO() {}
    
    // Getters and Setters
    public String getTitulo() {
        return titulo;
    }
    
    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }
    
    public String getDescripcion() {
        return descripcion;
    }
    
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    
    public String getTipo() {
        return tipo;
    }
    
    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
    
    public String getVersion() {
        return version;
    }
    
    public void setVersion(String version) {
        this.version = version;
    }
    
    public String getRutaArchivo() {
        return rutaArchivo;
    }
    
    public void setRutaArchivo(String rutaArchivo) {
        this.rutaArchivo = rutaArchivo;
    }
    
    public Long getTamanoArchivo() {
        return tamanoArchivo;
    }
    
    public void setTamanoArchivo(Long tamanoArchivo) {
        this.tamanoArchivo = tamanoArchivo;
    }
    
    public String getAutor() {
        return autor;
    }
    
    public void setAutor(String autor) {
        this.autor = autor;
    }
    
    public Boolean getEsObligatorio() {
        return esObligatorio;
    }
    
    public void setEsObligatorio(Boolean esObligatorio) {
        this.esObligatorio = esObligatorio;
    }
    
    public String getMetadatos() {
        return metadatos;
    }
    
    public void setMetadatos(String metadatos) {
        this.metadatos = metadatos;
    }
}
