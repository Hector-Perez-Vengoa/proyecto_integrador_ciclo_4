package com.tecsup.model

data class AulaVirtual(
    val id: Long,
    val codigo: String,
    val estado: String,
    val descripcion: String?,
    val fechaCreacion: String?
)
