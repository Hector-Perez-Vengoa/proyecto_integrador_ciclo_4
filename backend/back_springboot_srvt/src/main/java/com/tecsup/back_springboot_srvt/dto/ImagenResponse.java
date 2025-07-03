package com.tecsup.back_springboot_srvt.dto;

public class ImagenResponse {
    
    private Long id;
    private String url;
    private String nombre;
    
    // Constructors
    public ImagenResponse() {}
    
    public ImagenResponse(Long id, String url, String nombre) {
        this.id = id;
        this.url = url;
        this.nombre = nombre;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getUrl() {
        return url;
    }
    
    public void setUrl(String url) {
        this.url = url;
    }
    
    public String getNombre() {
        return nombre;
    }
    
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
