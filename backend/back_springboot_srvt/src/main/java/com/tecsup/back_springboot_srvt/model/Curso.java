package com.tecsup.back_springboot_srvt.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "cursodb")
public class Curso {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "nombre", nullable = false)
    private String nombre;
    
    @Column(name = "descripcion")
    private String descripcion;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "carrera_id")
    @JsonBackReference
    private Carrera carrera;
    
    @Column(name = "duracion") // en horas
    private Integer duracion;
    
    @Column(name = "fecha")
    private LocalDate fecha;
    
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
    
    // Constructors
    public Curso() {}
    
    public Curso(String nombre, String descripcion, Carrera carrera, Integer duracion, LocalDate fecha) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.carrera = carrera;
        this.duracion = duracion;
        this.fecha = fecha;
        this.fechaCreacion = LocalDateTime.now();
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
    
    public Carrera getCarrera() {
        return carrera;
    }
    
    public void setCarrera(Carrera carrera) {
        this.carrera = carrera;
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
    
    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }
    
    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
}
