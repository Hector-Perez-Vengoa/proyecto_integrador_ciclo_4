package com.tecsup.back_springboot_srvt.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "PerfilDB")
public class Perfil {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;
    
    @Column(name = "imagen_perfil")
    private String imagenPerfil;
    
    @Column(name = "telefono", length = 15)
    private String telefono;
    
    @Column(name = "biografia", length = 500)
    private String biografia;
    
    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;
    
    @Column(name = "ubicacion", length = 100)
    private String ubicacion;
    
    @Column(name = "sitio_web")
    private String sitioWeb;
    
    @Column(name = "linkedin")
    private String linkedin;
    
    @Column(name = "twitter")
    private String twitter;
    
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;
    
    // Constructor vacío
    public Perfil() {}
    
    // Constructor con usuario
    public Perfil(User user) {
        this.user = user;
        this.fechaActualizacion = LocalDateTime.now();
    }
    
    // Método para verificar si el perfil está completo
    public boolean isPerfilCompleto() {
        return user != null && 
               user.getFirstName() != null && !user.getFirstName().isEmpty() &&
               user.getLastName() != null && !user.getLastName().isEmpty() &&
               user.getEmail() != null && !user.getEmail().isEmpty();
    }
    
    // Método para obtener nombre completo
    public String getNombreCompleto() {
        if (user == null) return "";
        String nombre = (user.getFirstName() != null ? user.getFirstName() : "") + " " +
                       (user.getLastName() != null ? user.getLastName() : "");
        return nombre.trim().isEmpty() ? user.getUsername() : nombre.trim();
    }
    
    // Método para obtener URL de imagen
    public String getImagenUrl() {
        if (imagenPerfil != null && !imagenPerfil.isEmpty()) {
            return "/media/" + imagenPerfil;
        }
        return "/media/perfiles/default_profile.png";
    }
    
    // Getters y Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public String getImagenPerfil() {
        return imagenPerfil;
    }
    
    public void setImagenPerfil(String imagenPerfil) {
        this.imagenPerfil = imagenPerfil;
    }
    
    public String getTelefono() {
        return telefono;
    }
    
    public void setTelefono(String telefono) {
        this.telefono = telefono;
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
    
    public String getUbicacion() {
        return ubicacion;
    }
    
    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }
    
    public String getSitioWeb() {
        return sitioWeb;
    }
    
    public void setSitioWeb(String sitioWeb) {
        this.sitioWeb = sitioWeb;
    }
    
    public String getLinkedin() {
        return linkedin;
    }
    
    public void setLinkedin(String linkedin) {
        this.linkedin = linkedin;
    }
    
    public String getTwitter() {
        return twitter;
    }
    
    public void setTwitter(String twitter) {
        this.twitter = twitter;
    }
    
    public LocalDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }
    
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.fechaActualizacion = LocalDateTime.now();
    }
    
    @PrePersist
    public void prePersist() {
        if (this.fechaActualizacion == null) {
            this.fechaActualizacion = LocalDateTime.now();
        }
    }
}
