package com.tecsup.model

data class UserInfo(
    val id: Long,
    val username: String?,
    val email: String,
    val firstName: String?,
    val lastName: String?
)