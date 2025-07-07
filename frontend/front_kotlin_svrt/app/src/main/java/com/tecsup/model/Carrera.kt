package com.tecsup.model

data class Carrera(
    val id: Long,
    val nombre: String?,
    val codigo: String?,
    val descripcion: String?,
    val departamentoId: Long?,
    val departamentoNombre: String?
) 