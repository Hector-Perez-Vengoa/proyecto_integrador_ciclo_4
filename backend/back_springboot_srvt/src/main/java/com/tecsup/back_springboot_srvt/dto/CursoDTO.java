package com.tecsup.back_springboot_srvt.dto;

import java.time.LocalDate;

public class CursoDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private Long carreraId;
    private String carreraNombre;
    private Integer duracion;
    private LocalDate fecha;

    // Constructors
    public CursoDTO() {}

    public CursoDTO(Long id, String nombre, String descripcion, Long carreraId, String carreraNombre, Integer duracion, LocalDate fecha) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.carreraId = carreraId;
        this.carreraNombre = carreraNombre;
        this.duracion = duracion;
        this.fecha = fecha;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Long getCarreraId() {
        return carreraId;
    }

    public void setCarreraId(Long carreraId) {
        this.carreraId = carreraId;
    }

    public String getCarreraNombre() {
        return carreraNombre;
    }

    public void setCarreraNombre(String carreraNombre) {
        this.carreraNombre = carreraNombre;
    }

    public Integer getDuracion() {
        return duracion;
    }

    public void setDuracion(Integer duracion) {
        this.duracion = duracion;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }
}
