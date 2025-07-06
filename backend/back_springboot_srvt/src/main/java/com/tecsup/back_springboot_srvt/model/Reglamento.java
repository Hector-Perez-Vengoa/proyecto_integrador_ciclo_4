package com.tecsup.back_springboot_srvt.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reglamento")
public class Reglamento {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "titulo", nullable = false, length = 200)
    private String titulo;
    
    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;
    
    @Column(name = "tipo", length = 20)
    private String tipo;
    
    @Column(name = "version", length = 20)
    private String version;
    
    @Column(name = "estado", length = 20)
    private String estado;
    
    @Column(name = "ruta_archivo", length = 500)
    private String rutaArchivo;
    
    @Column(name = "tamaño_archivo")
    private Long tamanoArchivo;
    
    @Column(name = "autor", length = 100)
    private String autor;
    
    @Column(name = "es_obligatorio")
    private Boolean esObligatorio = false;
    
    @Column(name = "contador_visualizaciones")
    private Long contadorVisualizaciones = 0L;
    
    @Column(name = "contador_descargas")
    private Long contadorDescargas = 0L;
    
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
    
    @Column(name = "fecha_modificacion")
    private LocalDateTime fechaModificacion;
    
    @Column(name = "metadatos", columnDefinition = "TEXT")
    private String metadatos;
    
    // Constructores
    public Reglamento() {}
    
    public Reglamento(String titulo, String descripcion, String tipo, String version,
                     String rutaArchivo, String estado, String autor) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.tipo = tipo;
        this.version = version;
        this.rutaArchivo = rutaArchivo;
        this.estado = estado;
        this.autor = autor;
        this.fechaCreacion = LocalDateTime.now();
        this.fechaModificacion = LocalDateTime.now();
        this.contadorVisualizaciones = 0L;
        this.contadorDescargas = 0L;
        this.esObligatorio = false;
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
    
    // Métodos de utilidad
    public boolean estaActivo() {
        return "activo".equals(this.estado);
    }
    
    public String getTamanoLegible() {
        if (this.tamanoArchivo == null) {
            return "Desconocido";
        }
        
        double tamaño = this.tamanoArchivo.doubleValue();
        String[] unidades = {"B", "KB", "MB", "GB", "TB"};
        
        int unidadIndex = 0;
        while (tamaño >= 1024 && unidadIndex < unidades.length - 1) {
            tamaño /= 1024;
            unidadIndex++;
        }
        
        return String.format("%.1f %s", tamaño, unidades[unidadIndex]);
    }
    
    public String getNombreArchivo() {
        if (this.rutaArchivo == null) {
            return "reglamento.pdf";
        }
        String[] partes = this.rutaArchivo.split("/");
        return partes[partes.length - 1];
    }
    
    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
        this.fechaModificacion = LocalDateTime.now();
        if (this.contadorVisualizaciones == null) {
            this.contadorVisualizaciones = 0L;
        }
        if (this.contadorDescargas == null) {
            this.contadorDescargas = 0L;
        }
        if (this.esObligatorio == null) {
            this.esObligatorio = false;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.fechaModificacion = LocalDateTime.now();
    }
}
