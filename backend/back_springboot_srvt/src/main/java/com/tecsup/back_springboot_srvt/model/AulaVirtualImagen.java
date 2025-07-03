package com.tecsup.back_springboot_srvt.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "aula_virtual_imagen")
public class AulaVirtualImagen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aula_virtual_id", nullable = false)
    private AulaVirtual aulaVirtual;

    @Column(name = "url_imagen", nullable = false, length = 500)
    private String urlImagen;

    @Column(name = "nombre_archivo", length = 255)
    private String nombreArchivo;

    @Column(name = "descripcion", length = 255)
    private String descripcion;

    @Column(name = "es_principal", nullable = false)
    private Boolean esPrincipal = false;

    @Column(name = "orden_visualizacion", nullable = false)
    private Integer ordenVisualizacion = 1;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    // Constructores
    public AulaVirtualImagen() {
        this.fechaCreacion = LocalDateTime.now();
    }

    public AulaVirtualImagen(AulaVirtual aulaVirtual, String urlImagen, String nombreArchivo) {
        this();
        this.aulaVirtual = aulaVirtual;
        this.urlImagen = urlImagen;
        this.nombreArchivo = nombreArchivo;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AulaVirtual getAulaVirtual() {
        return aulaVirtual;
    }

    public void setAulaVirtual(AulaVirtual aulaVirtual) {
        this.aulaVirtual = aulaVirtual;
    }

    public String getUrlImagen() {
        return urlImagen;
    }

    public void setUrlImagen(String urlImagen) {
        this.urlImagen = urlImagen;
    }

    public String getNombreArchivo() {
        return nombreArchivo;
    }

    public void setNombreArchivo(String nombreArchivo) {
        this.nombreArchivo = nombreArchivo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Boolean getEsPrincipal() {
        return esPrincipal;
    }

    public void setEsPrincipal(Boolean esPrincipal) {
        this.esPrincipal = esPrincipal;
    }

    public Integer getOrdenVisualizacion() {
        return ordenVisualizacion;
    }

    public void setOrdenVisualizacion(Integer ordenVisualizacion) {
        this.ordenVisualizacion = ordenVisualizacion;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
}
