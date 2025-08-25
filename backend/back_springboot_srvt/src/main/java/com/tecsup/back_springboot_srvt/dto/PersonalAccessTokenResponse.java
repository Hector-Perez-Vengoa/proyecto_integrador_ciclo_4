package com.tecsup.back_springboot_srvt.dto;

import java.time.LocalDateTime;

public class PersonalAccessTokenResponse {
    
    private Long id;
    private String name;
    private String description;
    private String tokenPrefix; // Only first 8 characters + "..." for security
    private String fullToken; // Only returned when creating token
    private LocalDateTime lastUsedAt;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
    private boolean isActive;
    private boolean isExpired;
    
    // Constructors
    public PersonalAccessTokenResponse() {}
    
    public PersonalAccessTokenResponse(Long id, String name, String tokenPrefix, 
                                     LocalDateTime lastUsedAt, LocalDateTime expiresAt, 
                                     LocalDateTime createdAt, boolean isActive) {
        this.id = id;
        this.name = name;
        this.tokenPrefix = tokenPrefix;
        this.lastUsedAt = lastUsedAt;
        this.expiresAt = expiresAt;
        this.createdAt = createdAt;
        this.isActive = isActive;
        this.isExpired = expiresAt != null && LocalDateTime.now().isAfter(expiresAt);
    }
    
    // Getters and setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
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
    
    public String getTokenPrefix() {
        return tokenPrefix;
    }
    
    public void setTokenPrefix(String tokenPrefix) {
        this.tokenPrefix = tokenPrefix;
    }
    
    public String getFullToken() {
        return fullToken;
    }
    
    public void setFullToken(String fullToken) {
        this.fullToken = fullToken;
    }
    
    public LocalDateTime getLastUsedAt() {
        return lastUsedAt;
    }
    
    public void setLastUsedAt(LocalDateTime lastUsedAt) {
        this.lastUsedAt = lastUsedAt;
    }
    
    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }
    
    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
        this.isExpired = expiresAt != null && LocalDateTime.now().isAfter(expiresAt);
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public boolean isActive() {
        return isActive;
    }
    
    public void setActive(boolean active) {
        isActive = active;
    }
    
    public boolean isExpired() {
        return isExpired;
    }
    
    public void setExpired(boolean expired) {
        isExpired = expired;
    }
}