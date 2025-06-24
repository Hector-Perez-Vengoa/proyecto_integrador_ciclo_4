package com.tecsup.back_springboot_srvt.dto;

public class CarreraDTO {
    private Long id;
    private String nombre;
    private String codigo;
    private String descripcion;
    private Long departamentoId;
    private String departamentoNombre;

    // Constructors
    public CarreraDTO() {}

    public CarreraDTO(Long id, String nombre, String codigo, String descripcion, Long departamentoId, String departamentoNombre) {
        this.id = id;
        this.nombre = nombre;
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.departamentoId = departamentoId;
        this.departamentoNombre = departamentoNombre;
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

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Long getDepartamentoId() {
        return departamentoId;
    }

    public void setDepartamentoId(Long departamentoId) {
        this.departamentoId = departamentoId;
    }

    public String getDepartamentoNombre() {
        return departamentoNombre;
    }

    public void setDepartamentoNombre(String departamentoNombre) {
        this.departamentoNombre = departamentoNombre;
    }
}
