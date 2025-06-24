package com.tecsup.back_springboot_srvt.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "profesordb")
public class Profesor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Integer userId; // Para almacenar el ID del User asociado

    @Column(name = "perfil_id", nullable = true) // Asumiendo que un profesor podría existir teóricamente sin perfil directo, o se crea después
    private Long perfilId; // Para almacenar el ID del Perfil asociado

    @Column(name = "nombres", nullable = true)
    private String nombres;

    @Column(name = "apellidos", nullable = true)
    private String apellidos;

    @Column(name = "codigo", unique = true, nullable = true) // Se permite nulo inicialmente para generarlo después
    private String codigo;

    @Column(name = "correo", unique = true, nullable = false)
    private String correo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departamento_id")
    private Departamento departamento;    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "profesordb_carreras",
            joinColumns = @JoinColumn(name = "profesordb_id"),
            inverseJoinColumns = @JoinColumn(name = "carreradb_id")
    )
    private List<Carrera> carreras;

    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "profesordb_cursos",
            joinColumns = @JoinColumn(name = "profesordb_id"),
            inverseJoinColumns = @JoinColumn(name = "cursodb_id")
    )
    private List<Curso> cursos;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    public Profesor() {
        this.fechaCreacion = LocalDateTime.now();
    }

    // Constructor actualizado para incluir userId y perfilId (opcionalmente)
    public Profesor(Integer userId, Long perfilId, String nombres, String apellidos, String correo, Departamento departamento) {
        this.userId = userId;
        this.perfilId = perfilId;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.correo = correo;
        this.departamento = departamento;
        this.fechaCreacion = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Long getPerfilId() {
        return perfilId;
    }

    public void setPerfilId(Long perfilId) {
        this.perfilId = perfilId;
    }

    public String getNombres() {
        return nombres;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public Departamento getDepartamento() {
        return departamento;
    }

    public void setDepartamento(Departamento departamento) {
        this.departamento = departamento;
    }

    public List<Carrera> getCarreras() {
        return carreras;
    }

    public void setCarreras(List<Carrera> carreras) {
        this.carreras = carreras;
    }

    public List<Curso> getCursos() {
        return cursos;
    }

    public void setCursos(List<Curso> cursos) {
        this.cursos = cursos;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
}
