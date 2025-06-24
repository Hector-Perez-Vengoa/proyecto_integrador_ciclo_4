package com.tecsup.back_springboot_srvt.dto;

import java.util.Map;

public class AuthResponse {
    
    private String token;
    private String type;
    private Map<String, Object> user;
    private Boolean requirePassword;
    private String message;

    // Constructors
    public AuthResponse() {}

    public AuthResponse(String token, String type, Map<String, Object> user) {
        this.token = token;
        this.type = type;
        this.user = user;
    }

    public AuthResponse(String token, String type, Map<String, Object> user, String message) {
        this.token = token;
        this.type = type;
        this.user = user;
        this.message = message;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Map<String, Object> getUser() {
        return user;
    }

    public void setUser(Map<String, Object> user) {
        this.user = user;
    }

    public Boolean getRequirePassword() {
        return requirePassword;
    }

    public void setRequirePassword(Boolean requirePassword) {
        this.requirePassword = requirePassword;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
