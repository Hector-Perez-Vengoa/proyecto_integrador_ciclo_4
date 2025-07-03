package com.tecsup.back_springboot_srvt.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "aula_virtual_componente")
public class AulaVirtualComponente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "descripcion")
    private String descripcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aula_virtual_id", nullable = false)
    @JsonIgnore
    private AulaVirtual aulaVirtual;

    // Constructores
    public AulaVirtualComponente() {}

    public AulaVirtualComponente(String nombre, String descripcion, AulaVirtual aulaVirtual) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.aulaVirtual = aulaVirtual;
    }

    // Getters y Setters
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

    public AulaVirtual getAulaVirtual() {
        return aulaVirtual;
    }

    public void setAulaVirtual(AulaVirtual aulaVirtual) {
        this.aulaVirtual = aulaVirtual;
    }
}
