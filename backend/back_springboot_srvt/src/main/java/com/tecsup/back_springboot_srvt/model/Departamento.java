package com.tecsup.back_springboot_srvt.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "departamentodb")
public class Departamento {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "nombre", nullable = false)
    private String nombre;
    
    @Column(name = "descripcion")
    private String descripcion;
    
    @Column(name = "jefe")
    private String jefe;
    
    @Column(name = "fecha_creacion")
    private LocalDateTime fecha_creacion;
    
    @OneToMany(mappedBy = "departamento", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Carrera> carreras;// Constructors
    public Departamento() {}

    public Departamento(String nombre, String descripcion, String jefe) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.jefe = jefe;
        this.fecha_creacion = LocalDateTime.now();
    }    // Getters and Setters
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

    public String getJefe() {
        return jefe;
    }

    public void setJefe(String jefe) {
        this.jefe = jefe;
    }

    public LocalDateTime getFecha_creacion() {
        return fecha_creacion;
    }

    public void setFecha_creacion(LocalDateTime fecha_creacion) {
        this.fecha_creacion = fecha_creacion;
    }

    public List<Carrera> getCarreras() {
        return carreras;
    }

    public void setCarreras(List<Carrera> carreras) {
        this.carreras = carreras;
    }
}
