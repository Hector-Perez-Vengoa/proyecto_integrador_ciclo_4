package com.tecsup.back_springboot_srvt.model;
import java.sql.Date;

public class Departamento {
    private Long id;
    private String nombre;
    private String codigo;
    private String descripcion;
    private String jefe;
    private Date fecha_creacion;

    public Departamento() {}

    public Departamento(String jefe, Date fecha_creacion, String descripcion, String codigo, String nombre, Long id) {
        this.jefe = jefe;
        this.fecha_creacion = fecha_creacion;
        this.descripcion = descripcion;
        this.codigo = codigo;
        this.nombre = nombre;
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getFecha_creacion() {
        return fecha_creacion;
    }

    public void setFecha_creacion(Date fecha_creacion) {
        this.fecha_creacion = fecha_creacion;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getJefe() {
        return jefe;
    }

    public void setJefe(String jefe) {
        this.jefe = jefe;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
