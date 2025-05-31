package com.tecsup.back_springboot_srvt.model;
import java.util.List;
import java.sql.Date;

public class Carrera {
    private Long id;
    private String nombre;
    private String codigo;
    private String descripcion;
    private Departamento departamento;
    private List<Curso> cursos;
    private List<Profesor> profesores;
    private Date fecha_creacion;
}
