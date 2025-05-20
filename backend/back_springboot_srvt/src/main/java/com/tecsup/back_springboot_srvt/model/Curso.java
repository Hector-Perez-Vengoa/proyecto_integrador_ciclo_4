package com.tecsup.back_springboot_srvt.model;
import java.sql.Date;

public class Curso {
    private Long id;
    private String nombre;
    private String descripcion;
    private Carrera carrera;
    private int duracion; // en horas
    private Date fecha_creacion;

}
