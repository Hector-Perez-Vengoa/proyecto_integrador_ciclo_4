package com.tecsup.back_springboot_srvt.dto;

public class ImagenPerfilResponse {
    
    private String imagenUrl;
    private String email;
    private String mensaje;
    private String googleImageUrl;

    // Constructors
    public ImagenPerfilResponse() {}

    public ImagenPerfilResponse(String imagenUrl, String email, String mensaje) {
        this.imagenUrl = imagenUrl;
        this.email = email;
        this.mensaje = mensaje;
    }

    public ImagenPerfilResponse(String imagenUrl, String email, String mensaje, String googleImageUrl) {
        this.imagenUrl = imagenUrl;
        this.email = email;
        this.mensaje = mensaje;
        this.googleImageUrl = googleImageUrl;
    }

    // Getters and Setters
    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public String getGoogleImageUrl() {
        return googleImageUrl;
    }

    public void setGoogleImageUrl(String googleImageUrl) {
        this.googleImageUrl = googleImageUrl;
    }
}
