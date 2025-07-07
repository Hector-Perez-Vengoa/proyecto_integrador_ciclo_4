package com.tecsup.model

// Importar las clases Carrera y Curso

data class UserProfile(
    val id: Long?,
    val biografia: String?,
    val fechaNacimiento: String?,
    val imagenPerfil: String?,
    val fechaActualizacion: String?,
    val username: String?,
    val email: String?,
    val firstName: String?,
    val lastName: String?,
    val nombreCompleto: String?,
    val departamento: Departamento?,
    val carreras: List<Carrera>?,
    val cursos: List<Curso>?
)

// Departamento puede ser null o tener solo nombre

data class Departamento(
    val id: Long?,
    val nombre: String?,
    val descripcion: String?
) 