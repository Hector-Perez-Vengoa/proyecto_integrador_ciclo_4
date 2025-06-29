package com.tecsup.api

import com.tecsup.model.AulaVirtual
import com.tecsup.model.UsuarioGoogle
import com.tecsup.model.LoginRequest
import com.tecsup.model.AuthResponse
import com.tecsup.model.ApiResponse
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST

interface ApiService {

    // LOGIN con usuario y contraseña
    @POST("auth/signin")
    fun login(@Body request: LoginRequest): Call<AuthResponse>

    // REGISTRO de usuario con cuenta de Google
    @POST("auth/google")
    fun registrarUsuario(@Body usuario: UsuarioGoogle): Call<Map<String, String>>

    @GET("api/aula-virtual")
    fun listarAulas(@Header("Authorization") token: String): Call<ApiResponse<List<AulaVirtual>>>


}
