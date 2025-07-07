package com.tecsup.back_springboot_srvt.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class PerfilResponse {
    
    private Long id;
    private String biografia;
    private LocalDate fechaNacimiento;
    private String imagenPerfil;
    private LocalDateTime fechaActualizacion;
    
    // Datos del usuario
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String nombreCompleto;
    
    // Departamento
    private DepartamentoDTO departamento;
    
    // Carreras
    private List<CarreraDTO> carreras;
    
    // Cursos
    private List<CursoDTO> cursos;

    // Constructors
    public PerfilResponse() {}

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBiografia() {
        return biografia;
    }

    public void setBiografia(String biografia) {
        this.biografia = biografia;
    }

    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getImagenPerfil() {
        return imagenPerfil;
    }

    public void setImagenPerfil(String imagenPerfil) {
        this.imagenPerfil = imagenPerfil;
    }

    public LocalDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }

    public void setFechaActualizacion(LocalDateTime fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public DepartamentoDTO getDepartamento() {
        return departamento;
    }

    public void setDepartamento(DepartamentoDTO departamento) {
        this.departamento = departamento;
    }

    public List<CarreraDTO> getCarreras() {
        return carreras;
    }

    public void setCarreras(List<CarreraDTO> carreras) {
        this.carreras = carreras;
    }

    public List<CursoDTO> getCursos() {
        return cursos;
    }

    public void setCursos(List<CursoDTO> cursos) {
        this.cursos = cursos;
    }
}
