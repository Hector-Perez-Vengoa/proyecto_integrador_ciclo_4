package com.tecsup.back_springboot_srvt.model;
import java.util.List;
import java.util.ArrayList;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "perfildb")
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
    private LocalDate fechaNacimiento;    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departamento_id")
    private Departamento departamento;    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "perfil_carreras", 
        joinColumns = @JoinColumn(name = "perfil_id"), 
        inverseJoinColumns = @JoinColumn(name = "carrera_id")
    )
    private List<Carrera> carreras;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "perfil_cursos", 
        joinColumns = @JoinColumn(name = "perfil_id"), 
        inverseJoinColumns = @JoinColumn(name = "curso_id")
    )
    private List<Curso> cursos;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;    // Constructor vacío
    public Perfil() {
        this.carreras = new ArrayList<>();
        this.cursos = new ArrayList<>();
    }

    // Constructor con usuario
    public Perfil(User user) {
        this.user = user;
        this.fechaActualizacion = LocalDateTime.now();
        this.carreras = new ArrayList<>();
        this.cursos = new ArrayList<>();
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
        if (user == null)
            return "";
        String nombre = (user.getFirstName() != null ? user.getFirstName() : "") + " " +
                (user.getLastName() != null ? user.getLastName() : "");
        return nombre.trim().isEmpty() ? user.getUsername() : nombre.trim();
    }    // Método para obtener URL de imagen
    public String getImagenUrl() {
        if (imagenPerfil != null && !imagenPerfil.isEmpty()) {
            // Si es una URL de Google o externa, la retornamos directamente
            if (imagenPerfil.startsWith("http")) {
                return imagenPerfil;
            }
            // Si es un archivo local (legacy), construir la URL
            return "/media/" + imagenPerfil;
        }
        
        // Imagen por defecto basada en el usuario
        if (user != null) {
            String nombre = "";
            if (user.getFirstName() != null && !user.getFirstName().isEmpty()) {
                nombre += user.getFirstName().charAt(0);
            }
            if (user.getLastName() != null && !user.getLastName().isEmpty()) {
                nombre += user.getLastName().charAt(0);
            }
            
            if (nombre.isEmpty()) {
                nombre = user.getEmail() != null ? user.getEmail().substring(0, 1).toUpperCase() : "U";
            }
            
            return String.format("https://ui-avatars.com/api/?name=%s&background=2c5282&color=ffffff&size=200&bold=true", 
                                nombre.toUpperCase());
        }
        
        return "https://ui-avatars.com/api/?name=User&background=2c5282&color=ffffff&size=200";
    }

    /**
     * Actualiza la imagen de perfil con la URL de Google
     * @param googlePictureUrl URL de la imagen de perfil de Google
     */
    public void actualizarImagenGoogle(String googlePictureUrl) {
        if (googlePictureUrl != null && !googlePictureUrl.isEmpty() && googlePictureUrl.startsWith("http")) {
            this.imagenPerfil = googlePictureUrl;
            this.fechaActualizacion = LocalDateTime.now();
        }
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
