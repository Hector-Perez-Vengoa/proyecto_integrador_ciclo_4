package com.tecsup.model

import java.time.LocalDate

data class Curso(
    val id: Long,
    val nombre: String?,
    val descripcion: String?,
    val carreraId: Long?,
    val carreraNombre: String?,
    val duracion: Int?,
    val fecha: String? // Usar String para compatibilidad con JSON
) 