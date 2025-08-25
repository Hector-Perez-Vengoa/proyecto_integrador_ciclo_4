package com.tecsup.back_springboot_srvt.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

public class CreatePersonalAccessTokenRequest {
    
    @NotBlank(message = "El nombre del token es requerido")
    @Size(min = 1, max = 100, message = "El nombre debe tener entre 1 y 100 caracteres")
    @Pattern(regexp = "^[a-zA-Z0-9\\s\\-_]+$", message = "El nombre solo puede contener letras, números, espacios, guiones y guiones bajos")
    private String name;
    
    @Size(max = 255, message = "La descripción no puede exceder 255 caracteres")
    private String description;
    
    private Integer expirationDays; // null = no expiration
    
    // Constructors
    public CreatePersonalAccessTokenRequest() {}
    
    public CreatePersonalAccessTokenRequest(String name) {
        this.name = name;
    }
    
    public CreatePersonalAccessTokenRequest(String name, String description, Integer expirationDays) {
        this.name = name;
        this.description = description;
        this.expirationDays = expirationDays;
    }
    
    // Getters and setters
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Integer getExpirationDays() {
        return expirationDays;
    }
    
    public void setExpirationDays(Integer expirationDays) {
        this.expirationDays = expirationDays;
    }
}