package com.tecsup.back_springboot_srvt.dto;

import java.time.LocalDate;
import java.util.List;

public class ActualizarPerfilRequest {
    private String firstName;
    private String lastName;
    private String biografia;
    private LocalDate fechaNacimiento;
    private Long departamentoId;
    private List<Long> carreraIds;
    private List<Long> cursoIds;

    // Constructor vacío
    public ActualizarPerfilRequest() {}

    // Getters y Setters
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

    public Long getDepartamentoId() {
        return departamentoId;
    }

    public void setDepartamentoId(Long departamentoId) {
        this.departamentoId = departamentoId;
    }

    public List<Long> getCarreraIds() {
        return carreraIds;
    }

    public void setCarreraIds(List<Long> carreraIds) {
        this.carreraIds = carreraIds;
    }

    public List<Long> getCursoIds() {
        return cursoIds;
    }    public void setCursoIds(List<Long> cursoIds) {
        this.cursoIds = cursoIds;
    }

    @Override
    public String toString() {
        return "ActualizarPerfilRequest{" +
                "firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", biografia='" + biografia + '\'' +
                ", fechaNacimiento=" + fechaNacimiento +
                ", departamentoId=" + departamentoId +
                ", carreraIds=" + carreraIds +
                ", cursoIds=" + cursoIds +
                '}';
    }
}
