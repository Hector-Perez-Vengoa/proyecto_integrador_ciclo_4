package com.tecsup.back_springboot_srvt.model;

import java.sql.Date;
import java.sql.Time;

public class AulaVirtual {
    private String codigo;
    private int profesor;
    private int curso;
    private String estado;
    private Time hora_inicio;
    private Time hora_fin;
    private Date fecha_reserva;
    private String motivo_reserva;

    // Constructor vacío requerido por Spring y Jackson
    public AulaVirtual() {}

    // Constructor completo
    public AulaVirtual(String codigo, int profesor, int curso, String estado, Time hora_inicio, Time hora_fin, Date fecha_reserva, String motivo_reserva) {
        this.codigo = codigo;
        this.profesor = profesor;
        this.curso = curso;
        this.estado = estado;
        this.hora_inicio = hora_inicio;
        this.hora_fin = hora_fin;
        this.fecha_reserva = fecha_reserva;
        this.motivo_reserva = motivo_reserva;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public int getProfesor() {
        return profesor;
    }

    public void setProfesor(int profesor) {
        this.profesor = profesor;
    }

    public int getCurso() {
        return curso;
    }

    public void setCurso(int curso) {
        this.curso = curso;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Time getHora_inicio() {
        return hora_inicio;
    }

    public void setHora_inicio(Time hora_inicio) {
        this.hora_inicio = hora_inicio;
    }

    public Time getHora_fin() {
        return hora_fin;
    }

    public void setHora_fin(Time hora_fin) {
        this.hora_fin = hora_fin;
    }

    public Date getFecha_reserva() {
        return fecha_reserva;
    }

    public void setFecha_reserva(Date fecha_reserva) {
        this.fecha_reserva = fecha_reserva;
    }

    public String getMotivo_reserva() {
        return motivo_reserva;
    }

    public void setMotivo_reserva(String motivo_reserva) {
        this.motivo_reserva = motivo_reserva;
    }
}
