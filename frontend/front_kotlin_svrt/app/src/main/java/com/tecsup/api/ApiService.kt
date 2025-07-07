package com.tecsup.api

import com.tecsup.model.AulaVirtual
import com.tecsup.model.UsuarioGoogle
import com.tecsup.model.LoginRequest
import com.tecsup.model.AuthResponse
import com.tecsup.model.ApiResponse
import com.tecsup.model.Departamento
import com.tecsup.model.Carrera
import com.tecsup.model.Curso
import com.tecsup.model.UserProfile
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Url
import okhttp3.RequestBody
import okhttp3.ResponseBody

interface ApiService {

    // LOGIN con usuario y contraseña
    @POST("auth/signin")
    fun login(@Body request: LoginRequest): Call<AuthResponse>

    // REGISTRO de usuario con cuenta de Google
    @POST("auth/google")
    fun registrarUsuario(@Body usuario: UsuarioGoogle): Call<Map<String, String>>

    @GET("api/aula-virtual")
    fun listarAulas(@Header("Authorization") token: String): Call<ApiResponse<List<AulaVirtual>>>

    @GET("api/perfil/departamentos")
    fun listarDepartamentos(@Header("Authorization") token: String): Call<ApiResponse<List<Departamento>>>

    @GET("api/perfil/carreras")
    fun listarCarreras(@Header("Authorization") token: String): Call<ApiResponse<List<Carrera>>>

    @GET("api/perfil/cursos")
    fun listarCursos(@Header("Authorization") token: String): Call<ApiResponse<List<Curso>>>

    @PUT("api/perfil")
    fun actualizarPerfil(@Header("Authorization") token: String, @Body body: RequestBody): retrofit2.Call<ResponseBody>

    @GET("api/perfil")
    fun obtenerPerfil(@Header("Authorization") token: String): retrofit2.Call<UserProfile>

}
