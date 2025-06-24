package com.tecsup.model

data class AuthResponse(
    val token: String,
    val type: String,
    val requirePassword: Boolean? = null,
    val user: UserInfo
)