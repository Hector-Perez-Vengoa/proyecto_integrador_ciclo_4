package com.tecsup.back_springboot_srvt.dto;

public class ApiResponseDTO<T> {
    
    private boolean success;
    private String message;
    private T data;
    private String error;
    
    // Constructors
    public ApiResponseDTO() {}
    
    public ApiResponseDTO(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
    
    public ApiResponseDTO(boolean success, String message, T data, String error) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.error = error;
    }
    
    // Static factory methods
    public static <T> ApiResponseDTO<T> success(String message, T data) {
        return new ApiResponseDTO<>(true, message, data);
    }
    
    public static <T> ApiResponseDTO<T> success(String message) {
        return new ApiResponseDTO<>(true, message, null);
    }
    
    public static <T> ApiResponseDTO<T> error(String message, String error) {
        return new ApiResponseDTO<>(false, message, null, error);
    }
    
    public static <T> ApiResponseDTO<T> error(String message) {
        return new ApiResponseDTO<>(false, message, null);
    }
    
    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public T getData() {
        return data;
    }
    
    public void setData(T data) {
        this.data = data;
    }
    
    public String getError() {
        return error;
    }
    
    public void setError(String error) {
        this.error = error;
    }
}
