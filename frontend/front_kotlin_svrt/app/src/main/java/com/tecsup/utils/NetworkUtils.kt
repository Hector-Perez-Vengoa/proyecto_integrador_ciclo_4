package com.tecsup.utils

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import okhttp3.OkHttpClient
import java.net.SocketTimeoutException
import java.net.UnknownHostException
import java.util.concurrent.TimeUnit
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import com.tecsup.api.ApiService

object NetworkUtils {
    
    /**
     * Verifica si hay conexión a internet disponible
     */
    fun isNetworkAvailable(context: Context): Boolean {
        val connectivityManager = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val network = connectivityManager.activeNetwork ?: return false
        val activeNetwork = connectivityManager.getNetworkCapabilities(network) ?: return false
        
        return when {
            activeNetwork.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) -> true
            activeNetwork.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) -> true
            else -> false
        }
    }
    
    /**
     * Crea un cliente OkHttp con configuración optimizada
     */
    fun createOkHttpClient(): OkHttpClient {
        return OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .build()
    }
    
    /**
     * Obtiene un mensaje de error legible basado en la excepción
     */
    fun getErrorMessage(throwable: Throwable): String {
        return when (throwable) {
            is SocketTimeoutException -> "Tiempo de espera agotado. Verifica tu conexión."
            is UnknownHostException -> "No se puede conectar al servidor. Verifica tu conexión a internet."
            else -> "Error de red: ${throwable.message}"
        }
    }
    
    /**
     * Obtiene un mensaje de error basado en el código de respuesta HTTP
     */
    fun getHttpErrorMessage(code: Int): String {
        return when (code) {
            400 -> "Solicitud incorrecta"
            401 -> "Sesión expirada. Inicia sesión nuevamente."
            403 -> "No tienes permisos para acceder a esta información."
            404 -> "Recurso no encontrado."
            408 -> "Tiempo de espera agotado."
            500 -> "Error interno del servidor."
            502 -> "Servidor no disponible temporalmente."
            503 -> "Servicio no disponible."
            else -> "Error del servidor: $code"
        }
    }

    fun getApiService(): ApiService {
        val retrofit = Retrofit.Builder()
            .baseUrl("http://192.168.1.208:8080/")
            .addConverterFactory(GsonConverterFactory.create())
            .client(createOkHttpClient())
            .build()
        return retrofit.create(ApiService::class.java)
    }
} 