package com.tecsup.back_springboot_srvt.model;
import java.util.List;
import java.sql.Date;

public class Profesor {
    private Long id;
    private String nombre;
    private String apellidos;
    private String codigo;
    private String correo;
    private Departamento departamento;
    private List<Carrera> carreras;
    private List<Curso> cursos;
    private Date fecha_creacion;
    private Date fecha_ingreso;
    private String observaciones;


}
