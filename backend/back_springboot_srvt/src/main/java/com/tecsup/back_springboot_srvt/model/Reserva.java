package com.tecsup.back_springboot_srvt.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservadb")
public class Reserva {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profesor_id", nullable = false)
    private Profesor profesor;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aula_virtual_id", nullable = false)
    private AulaVirtual aulaVirtual;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curso_id", nullable = false)
    private Curso curso;
    
    @Column(name = "hora_inicio", nullable = false)
    private LocalTime horaInicio;
    
    @Column(name = "hora_fin", nullable = false)
    private LocalTime horaFin;
    
    @Column(name = "fecha_reserva", nullable = false)
    private LocalDate fechaReserva;
    
    @Column(name = "motivo")
    private String motivo;
      @Column(name = "estado", nullable = false)
    private String estado;
    
    // === CAMPOS DE AUDITORÍA ===
    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;
    
    @Column(name = "creado_por", nullable = false)
    private String creadoPor; // ID o email del usuario que creó la reserva
    
    @Column(name = "ip_creacion")
    private String ipCreacion; // IP desde donde se creó la reserva
    
    @Column(name = "user_agent_creacion")
    private String userAgentCreacion; // Browser/dispositivo usado para crear
    
    @Column(name = "sesion_id_creacion")
    private String sesionIdCreacion; // ID de sesión para trazabilidad adicional
    
    @Column(name = "fecha_modificacion")
    private LocalDateTime fechaModificacion;
    
    @Column(name = "modificado_por")
    private String modificadoPor;
    
    @Column(name = "ip_modificacion")
    private String ipModificacion; // IP desde donde se modificó
    
    @Column(name = "motivo_modificacion")
    private String motivoModificacion; // Razón del cambio
    
    @Column(name = "historial_cambios", columnDefinition = "TEXT")
    private String historialCambios; // JSON con historial detallado de cambios
    
    // === CAMPOS DE CANCELACIÓN ===
    @Column(name = "fecha_cancelacion")
    private LocalDateTime fechaCancelacion;
    
    @Column(name = "motivo_cancelacion")
    private String motivoCancelacion;
    
    @Column(name = "cancelado_por")
    private String canceladoPor; 
    
    @Column(name = "observaciones_cancelacion")
    private String observacionesCancelacion;
    
    // Constructors
    public Reserva() {}
      public Reserva(Profesor profesor, AulaVirtual aulaVirtual, Curso curso, 
                   LocalTime horaInicio, LocalTime horaFin, LocalDate fechaReserva, 
                   String motivo, String estado, String creadoPor, String ipCreacion) {
        this.profesor = profesor;
        this.aulaVirtual = aulaVirtual;
        this.curso = curso;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.fechaReserva = fechaReserva;
        this.motivo = motivo;
        this.estado = estado;
        this.fechaCreacion = LocalDateTime.now();
        this.creadoPor = creadoPor;
        this.ipCreacion = ipCreacion;
    }
    
    // Constructor de compatibilidad (para no romper código existente)
    public Reserva(Profesor profesor, AulaVirtual aulaVirtual, Curso curso, 
                   LocalTime horaInicio, LocalTime horaFin, LocalDate fechaReserva, 
                   String motivo, String estado) {
        this(profesor, aulaVirtual, curso, horaInicio, horaFin, fechaReserva, 
             motivo, estado, "SISTEMA", null);
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Profesor getProfesor() {
        return profesor;
    }
    
    public void setProfesor(Profesor profesor) {
        this.profesor = profesor;
    }
    
    public AulaVirtual getAulaVirtual() {
        return aulaVirtual;
    }
    
    public void setAulaVirtual(AulaVirtual aulaVirtual) {
        this.aulaVirtual = aulaVirtual;
    }
    
    public Curso getCurso() {
        return curso;
    }
    
    public void setCurso(Curso curso) {
        this.curso = curso;
    }
    
    public LocalTime getHoraInicio() {
        return horaInicio;
    }
    
    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }
    
    public LocalTime getHoraFin() {
        return horaFin;
    }
    
    public void setHoraFin(LocalTime horaFin) {
        this.horaFin = horaFin;
    }
    
    public LocalDate getFechaReserva() {
        return fechaReserva;
    }
    
    public void setFechaReserva(LocalDate fechaReserva) {
        this.fechaReserva = fechaReserva;
    }
    
    public String getMotivo() {
        return motivo;
    }
    
    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }
    
    public String getEstado() {
        return estado;
    }
    
    public void setEstado(String estado) {
        this.estado = estado;
    }
      public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }
    
    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
    
    public LocalDateTime getFechaCancelacion() {
        return fechaCancelacion;
    }
    
    public void setFechaCancelacion(LocalDateTime fechaCancelacion) {
        this.fechaCancelacion = fechaCancelacion;
    }
    
    public String getMotivoCancelacion() {
        return motivoCancelacion;
    }
    
    public void setMotivoCancelacion(String motivoCancelacion) {
        this.motivoCancelacion = motivoCancelacion;
    }
    
    public String getCanceladoPor() {
        return canceladoPor;
    }
    
    public void setCanceladoPor(String canceladoPor) {
        this.canceladoPor = canceladoPor;
    }
      public String getObservacionesCancelacion() {
        return observacionesCancelacion;
    }
    
    public void setObservacionesCancelacion(String observacionesCancelacion) {
        this.observacionesCancelacion = observacionesCancelacion;
    }
    
    // === GETTERS Y SETTERS DE AUDITORÍA ===
    
    public String getCreadoPor() {
        return creadoPor;
    }
    
    public void setCreadoPor(String creadoPor) {
        this.creadoPor = creadoPor;
    }
    
    public String getIpCreacion() {
        return ipCreacion;
    }
    
    public void setIpCreacion(String ipCreacion) {
        this.ipCreacion = ipCreacion;
    }
    
    public String getUserAgentCreacion() {
        return userAgentCreacion;
    }
    
    public void setUserAgentCreacion(String userAgentCreacion) {
        this.userAgentCreacion = userAgentCreacion;
    }
    
    public String getSesionIdCreacion() {
        return sesionIdCreacion;
    }
    
    public void setSesionIdCreacion(String sesionIdCreacion) {
        this.sesionIdCreacion = sesionIdCreacion;
    }
    
    public LocalDateTime getFechaModificacion() {
        return fechaModificacion;
    }
    
    public void setFechaModificacion(LocalDateTime fechaModificacion) {
        this.fechaModificacion = fechaModificacion;
    }
    
    public String getModificadoPor() {
        return modificadoPor;
    }
    
    public void setModificadoPor(String modificadoPor) {
        this.modificadoPor = modificadoPor;
    }
    
    public String getIpModificacion() {
        return ipModificacion;
    }
    
    public void setIpModificacion(String ipModificacion) {
        this.ipModificacion = ipModificacion;
    }
    
    public String getMotivoModificacion() {
        return motivoModificacion;
    }
    
    public void setMotivoModificacion(String motivoModificacion) {
        this.motivoModificacion = motivoModificacion;
    }
    
    public String getHistorialCambios() {
        return historialCambios;
    }
    
    public void setHistorialCambios(String historialCambios) {
        this.historialCambios = historialCambios;
    }
    
    // === MÉTODOS DE UTILIDAD PARA AUDITORÍA ===
    
    /**
     * Registra una modificación en la reserva con información de auditoría
     */
    public void registrarModificacion(String modificadoPor, String ipModificacion, 
                                    String motivoModificacion, String userAgent) {
        this.fechaModificacion = LocalDateTime.now();
        this.modificadoPor = modificadoPor;
        this.ipModificacion = ipModificacion;
        this.motivoModificacion = motivoModificacion;
        
        // Registrar en historial de cambios
        String cambio = String.format("{\"fecha\":\"%s\",\"usuario\":\"%s\",\"ip\":\"%s\",\"motivo\":\"%s\",\"userAgent\":\"%s\"}", 
                                    LocalDateTime.now().toString(), modificadoPor, ipModificacion, motivoModificacion, userAgent);
        
        if (this.historialCambios == null || this.historialCambios.isEmpty()) {
            this.historialCambios = "[" + cambio + "]";
        } else {
            // Añadir al array existente
            this.historialCambios = this.historialCambios.substring(0, this.historialCambios.length() - 1) + "," + cambio + "]";
        }
    }
    
    /**
     * Obtiene información resumida de auditoría
     */
    public String getResumenAuditoria() {
        StringBuilder sb = new StringBuilder();
        sb.append("Creada por: ").append(creadoPor).append(" el ").append(fechaCreacion);
        if (ipCreacion != null) {
            sb.append(" desde IP: ").append(ipCreacion);
        }
        
        if (fechaModificacion != null) {
            sb.append(" | Modificada por: ").append(modificadoPor).append(" el ").append(fechaModificacion);
            if (ipModificacion != null) {
                sb.append(" desde IP: ").append(ipModificacion);
            }
        }
        
        if (fechaCancelacion != null) {
            sb.append(" | Cancelada por: ").append(canceladoPor).append(" el ").append(fechaCancelacion);
        }
        
        return sb.toString();
    }
    
    /**
     * Verifica si la reserva ha sido modificada por el mismo usuario que la creó
     */
    public boolean fueModificadaPorMismoCreador() {
        return modificadoPor != null && modificadoPor.equals(creadoPor);
    }
    
    /**
     * Obtiene las IPs únicas desde donde se gestionó esta reserva
     */
    public String[] getIpsInvolucradas() {
        java.util.Set<String> ips = new java.util.HashSet<>();
        if (ipCreacion != null && !ipCreacion.trim().isEmpty()) {
            ips.add(ipCreacion);
        }
        if (ipModificacion != null && !ipModificacion.trim().isEmpty()) {
            ips.add(ipModificacion);
        }
        return ips.toArray(new String[0]);
    }
}
