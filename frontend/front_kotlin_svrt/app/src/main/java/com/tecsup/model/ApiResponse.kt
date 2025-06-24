package com.tecsup.model

data class ApiResponse<T>(
    val message: String,
    val success: Boolean,
    val data: T
)
