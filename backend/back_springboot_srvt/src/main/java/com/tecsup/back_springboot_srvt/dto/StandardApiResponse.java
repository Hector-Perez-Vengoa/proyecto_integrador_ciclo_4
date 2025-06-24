package com.tecsup.back_springboot_srvt.dto;

public class StandardApiResponse<T> {
    
    private String message;
    private boolean success;
    private T data;

    // Constructors
    public StandardApiResponse() {}

    public StandardApiResponse(String message, boolean success, T data) {
        this.message = message;
        this.success = success;
        this.data = data;
    }

    // Static factory methods
    public static <T> StandardApiResponse<T> success(String message, T data) {
        return new StandardApiResponse<>(message, true, data);
    }

    public static <T> StandardApiResponse<T> success(String message) {
        return new StandardApiResponse<>(message, true, null);
    }

    public static <T> StandardApiResponse<T> error(String message) {
        return new StandardApiResponse<>(message, false, null);
    }

    // Getters and Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}
