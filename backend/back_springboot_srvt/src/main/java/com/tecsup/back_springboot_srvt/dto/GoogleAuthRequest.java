package com.tecsup.back_springboot_srvt.dto;

import jakarta.validation.constraints.NotBlank;

public class GoogleAuthRequest {
    
    @NotBlank(message = "El token de Google es obligatorio")
    private String token;
    
    private String email;
    private String firstName;
    private String lastName;
    private String tempPassword;

    // Constructors
    public GoogleAuthRequest() {}

    public GoogleAuthRequest(String token) {
        this.token = token;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
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

    public String getTempPassword() {
        return tempPassword;
    }

    public void setTempPassword(String tempPassword) {
        this.tempPassword = tempPassword;
    }
}
