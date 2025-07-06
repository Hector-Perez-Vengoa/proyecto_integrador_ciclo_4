package com.tecsup.back_springboot_srvt.dto;

import java.time.LocalDateTime;

public class ReglamentoResponseDTO {
    
    private Long id;
    private String titulo;
    private String descripcion;
    private String tipo;
    private String version;
    private String estado;
    private String rutaArchivo;
    private Long tamanoArchivo;
    private String tamanoLegible;
    private String nombreArchivo;
    private String autor;
    private Boolean esObligatorio;
    private Long contadorVisualizaciones;
    private Long contadorDescargas;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaModificacion;
    private String metadatos;
    
    // URLs para frontend
    private String urlVisualizacion;
    private String urlDescarga;
    
    // Constructors
    public ReglamentoResponseDTO() {}
    
    public ReglamentoResponseDTO(Long id, String titulo, String descripcion, String tipo,
                                String version, String estado, String rutaArchivo, Long tamanoArchivo,
                                String autor, Boolean esObligatorio, Long contadorVisualizaciones,
                                Long contadorDescargas, LocalDateTime fechaCreacion,
                                LocalDateTime fechaModificacion, String metadatos) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.tipo = tipo;
        this.version = version;
        this.estado = estado;
        this.rutaArchivo = rutaArchivo;
        this.tamanoArchivo = tamanoArchivo;
        this.autor = autor;
        this.esObligatorio = esObligatorio;
        this.contadorVisualizaciones = contadorVisualizaciones;
        this.contadorDescargas = contadorDescargas;
        this.fechaCreacion = fechaCreacion;
        this.fechaModificacion = fechaModificacion;
        this.metadatos = metadatos;
    }
    
    // Getters y Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
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
    
    public String getEstado() {
        return estado;
    }
    
    public void setEstado(String estado) {
        this.estado = estado;
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
    
    public String getTamanoLegible() {
        return tamanoLegible;
    }
    
    public void setTamanoLegible(String tamanoLegible) {
        this.tamanoLegible = tamanoLegible;
    }
    
    public String getNombreArchivo() {
        return nombreArchivo;
    }
    
    public void setNombreArchivo(String nombreArchivo) {
        this.nombreArchivo = nombreArchivo;
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
    
    public Long getContadorVisualizaciones() {
        return contadorVisualizaciones;
    }
    
    public void setContadorVisualizaciones(Long contadorVisualizaciones) {
        this.contadorVisualizaciones = contadorVisualizaciones;
    }
    
    public Long getContadorDescargas() {
        return contadorDescargas;
    }
    
    public void setContadorDescargas(Long contadorDescargas) {
        this.contadorDescargas = contadorDescargas;
    }
    
    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }
    
    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
    
    public LocalDateTime getFechaModificacion() {
        return fechaModificacion;
    }
    
    public void setFechaModificacion(LocalDateTime fechaModificacion) {
        this.fechaModificacion = fechaModificacion;
    }
    
    public String getMetadatos() {
        return metadatos;
    }
    
    public void setMetadatos(String metadatos) {
        this.metadatos = metadatos;
    }
    
    public String getUrlVisualizacion() {
        return urlVisualizacion;
    }
    
    public void setUrlVisualizacion(String urlVisualizacion) {
        this.urlVisualizacion = urlVisualizacion;
    }
    
    public String getUrlDescarga() {
        return urlDescarga;
    }
    
    public void setUrlDescarga(String urlDescarga) {
        this.urlDescarga = urlDescarga;
    }
}
