# 💻 Ejemplos Prácticos de Código Kotlin

## 🚀 Configuración Inicial Completa

### 1. 📦 Dependencias (build.gradle.kts - Module level)

```kotlin
dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
    implementation("androidx.activity:activity-compose:1.8.2")
    
    // Retrofit para API calls
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")
    
    // Corrutinas para operaciones asíncronas
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
    
    // ViewModel y LiveData
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.7.0")
    implementation("androidx.lifecycle:lifecycle-livedata-ktx:2.7.0")
    
    // Navigation Component
    implementation("androidx.navigation:navigation-fragment-ktx:2.7.6")
    implementation("androidx.navigation:navigation-ui-ktx:2.7.6")
    
    // RecyclerView para listas
    implementation("androidx.recyclerview:recyclerview:1.3.2")
    
    // Material Design
    implementation("com.google.android.material:material:1.11.0")
    
    // Glide para carga de imágenes
    implementation("com.github.bumptech.glide:glide:4.16.0")
    
    // Google Auth (opcional)
    implementation("com.google.android.gms:play-services-auth:20.7.0")
}
```

### 2. 🌐 Configuración de Red - ApiClient.kt

```kotlin
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object ApiClient {
    
    // Cambia esta URL según tu entorno
    private const val BASE_URL_EMULATOR = "http://10.0.2.2:8080/api/"
    private const val BASE_URL_DEVICE = "http://192.168.1.100:8080/api/" // Tu IP local
    private const val BASE_URL_PRODUCTION = "https://api.tecsup.edu.pe/api/"
    
    private const val BASE_URL = BASE_URL_EMULATOR // Cambiar según necesidad
    
    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = if (BuildConfig.DEBUG) {
            HttpLoggingInterceptor.Level.BODY
        } else {
            HttpLoggingInterceptor.Level.NONE
        }
    }
    
    private val authInterceptor = Interceptor { chain ->
        val token = TokenManager.getToken()
        val request = if (token != null && chain.request().url.encodedPath != "/api/auth/signin" 
                      && chain.request().url.encodedPath != "/api/auth/signup") {
            chain.request().newBuilder()
                .addHeader("Authorization", "Bearer $token")
                .addHeader("Content-Type", "application/json")
                .build()
        } else {
            chain.request().newBuilder()
                .addHeader("Content-Type", "application/json")
                .build()
        }
        chain.proceed(request)
    }
    
    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(authInterceptor)
        .addInterceptor(loggingInterceptor)
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build()
    
    val retrofit: Retrofit = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .client(okHttpClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
}
```

### 3. 🔐 Gestor de Tokens - TokenManager.kt

```kotlin
import android.content.Context
import android.content.SharedPreferences
import com.google.gson.Gson

object TokenManager {
    private const val PREFS_NAME = "tecsup_auth_prefs"
    private const val TOKEN_KEY = "jwt_token"
    private const val USER_KEY = "user_info"
    private const val REFRESH_TOKEN_KEY = "refresh_token"
    
    private lateinit var prefs: SharedPreferences
    private val gson = Gson()
    
    fun init(context: Context) {
        prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    }
    
    fun saveToken(token: String) {
        prefs.edit().putString(TOKEN_KEY, token).apply()
    }
    
    fun getToken(): String? = prefs.getString(TOKEN_KEY, null)
    
    fun saveUser(user: User) {
        val userJson = gson.toJson(user)
        prefs.edit().putString(USER_KEY, userJson).apply()
    }
    
    fun getUser(): User? {
        val userJson = prefs.getString(USER_KEY, null)
        return if (userJson != null) {
            try {
                gson.fromJson(userJson, User::class.java)
            } catch (e: Exception) {
                null
            }
        } else null
    }
    
    fun saveRefreshToken(refreshToken: String) {
        prefs.edit().putString(REFRESH_TOKEN_KEY, refreshToken).apply()
    }
    
    fun getRefreshToken(): String? = prefs.getString(REFRESH_TOKEN_KEY, null)
    
    fun clearAuth() {
        prefs.edit().clear().apply()
    }
    
    fun isLoggedIn(): Boolean = getToken() != null && getUser() != null
    
    fun getUserId(): Long? = getUser()?.id
    
    fun getProfesorId(): Long? = getUser()?.profesorId
}
```

## 📱 Modelos de Datos Completos

### 1. 👤 User.kt

```kotlin
import com.google.gson.annotations.SerializedName

data class User(
    @SerializedName("id")
    val id: Long,
    
    @SerializedName("profesorId")
    val profesorId: Long,
    
    @SerializedName("username")
    val username: String,
    
    @SerializedName("email")
    val email: String,
    
    @SerializedName("firstName")
    val firstName: String,
    
    @SerializedName("lastName")
    val lastName: String
) {
    fun getFullName(): String = "$firstName $lastName"
    
    fun getInitials(): String {
        val firstInitial = firstName.firstOrNull()?.uppercaseChar() ?: ""
        val lastInitial = lastName.firstOrNull()?.uppercaseChar() ?: ""
        return "$firstInitial$lastInitial"
    }
}
```

### 2. 🏢 AulaVirtual.kt

```kotlin
import com.google.gson.annotations.SerializedName

data class AulaVirtual(
    @SerializedName("id")
    val id: Long,
    
    @SerializedName("codigo")
    val codigo: String,
    
    @SerializedName("nombre")
    val nombre: String,
    
    @SerializedName("descripcion")
    val descripcion: String,
    
    @SerializedName("capacidad")
    val capacidad: Int,
    
    @SerializedName("ubicacion")
    val ubicacion: String,
    
    @SerializedName("disponible")
    val disponible: Boolean,
    
    @SerializedName("equipamiento")
    val equipamiento: List<String>
) {
    fun getCapacidadText(): String = "$capacidad personas"
    
    fun getEquipamientoText(): String = equipamiento.joinToString(", ")
    
    fun isDisponible(): Boolean = disponible
}
```

### 3. 📅 Reserva.kt

```kotlin
import com.google.gson.annotations.SerializedName
import java.text.SimpleDateFormat
import java.util.*

data class Reserva(
    @SerializedName("id")
    val id: Long,
    
    @SerializedName("aulaVirtual")
    val aulaVirtual: AulaVirtual,
    
    @SerializedName("profesor")
    val profesor: Map<String, Any>,
    
    @SerializedName("fecha")
    val fecha: String,
    
    @SerializedName("horaInicio")
    val horaInicio: String,
    
    @SerializedName("horaFin")
    val horaFin: String,
    
    @SerializedName("motivo")
    val motivo: String,
    
    @SerializedName("estado")
    val estado: String,
    
    @SerializedName("fechaCreacion")
    val fechaCreacion: String,
    
    @SerializedName("observaciones")
    val observaciones: String? = null
) {
    companion object {
        const val ESTADO_PENDIENTE = "PENDIENTE"
        const val ESTADO_CONFIRMADA = "CONFIRMADA"
        const val ESTADO_CANCELADA = "CANCELADA"
        const val ESTADO_EN_CURSO = "EN_CURSO"
        const val ESTADO_COMPLETADA = "COMPLETADA"
    }
    
    fun getFechaFormatted(): String {
        return try {
            val inputFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
            val outputFormat = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault())
            val date = inputFormat.parse(fecha)
            outputFormat.format(date ?: Date())
        } catch (e: Exception) {
            fecha
        }
    }
    
    fun getHorarioFormatted(): String = "$horaInicio - $horaFin"
    
    fun getEstadoColor(): Int {
        return when (estado) {
            ESTADO_CONFIRMADA -> android.R.color.holo_green_dark
            ESTADO_PENDIENTE -> android.R.color.holo_orange_dark
            ESTADO_CANCELADA -> android.R.color.holo_red_dark
            ESTADO_EN_CURSO -> android.R.color.holo_blue_dark
            else -> android.R.color.darker_gray
        }
    }
    
    fun canBeCancelled(): Boolean {
        return estado in listOf(ESTADO_PENDIENTE, ESTADO_CONFIRMADA)
    }
    
    fun isUpcoming(): Boolean {
        return try {
            val reservaDate = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).parse(fecha)
            val today = Date()
            reservaDate?.after(today) == true
        } catch (e: Exception) {
            false
        }
    }
}
```

### 4. 📝 Request DTOs

```kotlin
// LoginRequest.kt
data class LoginRequest(
    val email: String,
    val password: String
)

// SignupRequest.kt
data class SignupRequest(
    val email: String,
    val password: String,
    val firstName: String,
    val lastName: String
)

// ReservaRequest.kt
data class ReservaRequest(
    val aulaVirtualId: Long,
    val fecha: String, // yyyy-MM-dd
    val horaInicio: String, // HH:mm
    val horaFin: String, // HH:mm
    val motivo: String,
    val cursoId: Long? = null,
    val observaciones: String? = null
)

// CancelacionRequest.kt
data class CancelacionRequest(
    val motivo: String
)

// ActualizarPerfilRequest.kt
data class ActualizarPerfilRequest(
    val telefono: String? = null,
    val ubicacion: String? = null,
    val biografia: String? = null,
    val departamentoId: Long? = null,
    val carreraId: Long? = null
)
```

## 🌐 Interfaces de API Completas

### 1. 🔐 AuthApiService.kt

```kotlin
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthApiService {
    
    @POST("auth/signin")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>
    
    @POST("auth/signup")
    suspend fun register(@Body request: SignupRequest): Response<AuthResponse>
    
    @POST("auth/google")
    suspend fun googleAuth(@Body request: GoogleAuthRequest): Response<AuthResponse>
}
```

### 2. 👤 PerfilApiService.kt

```kotlin
import retrofit2.Response
import retrofit2.http.*

interface PerfilApiService {
    
    @GET("perfil")
    suspend fun obtenerPerfil(): Response<StandardApiResponse<PerfilResponse>>
    
    @PUT("perfil")
    suspend fun actualizarPerfil(@Body request: ActualizarPerfilRequest): Response<StandardApiResponse<PerfilResponse>>
    
    @GET("perfil/departamentos")
    suspend fun obtenerDepartamentos(): Response<StandardApiResponse<List<DepartamentoDTO>>>
    
    @GET("perfil/carreras")
    suspend fun obtenerCarreras(): Response<StandardApiResponse<List<CarreraDTO>>>
    
    @GET("perfil/mis-cursos")
    suspend fun obtenerMisCursos(): Response<StandardApiResponse<List<CursoDTO>>>
    
    @Multipart
    @POST("perfil/imagen")
    suspend fun subirImagenPerfil(@Part imagen: MultipartBody.Part): Response<StandardApiResponse<ImagenPerfilResponse>>
}
```

### 3. 📅 ReservasApiService.kt

```kotlin
import retrofit2.Response
import retrofit2.http.*

interface ReservasApiService {
    
    @POST("reservas")
    suspend fun crearReserva(@Body request: ReservaRequest): Response<StandardApiResponse<Reserva>>
    
    @GET("reservas/mis-reservas")
    suspend fun obtenerMisReservas(
        @Query("page") page: Int = 0,
        @Query("size") size: Int = 10,
        @Query("estado") estado: String? = null
    ): Response<StandardApiResponse<List<Reserva>>>
    
    @DELETE("reservas/{id}/cancelar")
    suspend fun cancelarReserva(
        @Path("id") reservaId: Long,
        @Body request: CancelacionRequest
    ): Response<StandardApiResponse<String>>
    
    @GET("reservas/disponibilidad")
    suspend fun verificarDisponibilidad(
        @Query("aulaId") aulaId: Long,
        @Query("fecha") fecha: String,
        @Query("horaInicio") horaInicio: String,
        @Query("horaFin") horaFin: String
    ): Response<StandardApiResponse<Boolean>>
    
    @GET("reservas/motivos")
    suspend fun obtenerMotivos(): Response<StandardApiResponse<List<String>>>
    
    @GET("reservas/notificaciones/estado")
    suspend fun obtenerEstadoNotificaciones(): Response<StandardApiResponse<NotificationStatus>>
}
```

## 📊 Repositories

### 1. 🔐 AuthRepository.kt

```kotlin
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class AuthRepository {
    private val authApi = ApiClient.retrofit.create(AuthApiService::class.java)
    
    suspend fun login(email: String, password: String): Result<AuthResponse> {
        return withContext(Dispatchers.IO) {
            try {
                val request = LoginRequest(email.trim().lowercase(), password)
                val response = authApi.login(request)
                
                if (response.isSuccessful && response.body() != null) {
                    val authResponse = response.body()!!
                    TokenManager.saveToken(authResponse.token)
                    TokenManager.saveUser(authResponse.userInfo)
                    Result.success(authResponse)
                } else {
                    val errorMsg = when (response.code()) {
                        401 -> "Credenciales incorrectas"
                        403 -> "Cuenta inactiva o sin permisos"
                        400 -> "Datos de login inválidos"
                        else -> "Error de conexión"
                    }
                    Result.failure(Exception(errorMsg))
                }
            } catch (e: Exception) {
                Result.failure(Exception("Error de red: ${e.message}"))
            }
        }
    }
    
    suspend fun register(
        email: String,
        password: String,
        firstName: String,
        lastName: String
    ): Result<AuthResponse> {
        return withContext(Dispatchers.IO) {
            try {
                val request = SignupRequest(
                    email.trim().lowercase(),
                    password,
                    firstName.trim(),
                    lastName.trim()
                )
                val response = authApi.register(request)
                
                if (response.isSuccessful && response.body() != null) {
                    val authResponse = response.body()!!
                    TokenManager.saveToken(authResponse.token)
                    TokenManager.saveUser(authResponse.userInfo)
                    Result.success(authResponse)
                } else {
                    val errorMsg = when (response.code()) {
                        400 -> "El email ya está registrado o datos inválidos"
                        422 -> "Solo se permiten emails de TECSUP (@tecsup.edu.pe)"
                        else -> "Error en el registro"
                    }
                    Result.failure(Exception(errorMsg))
                }
            } catch (e: Exception) {
                Result.failure(Exception("Error de red: ${e.message}"))
            }
        }
    }
    
    fun logout() {
        TokenManager.clearAuth()
    }
    
    fun isLoggedIn(): Boolean = TokenManager.isLoggedIn()
    
    fun getCurrentUser(): User? = TokenManager.getUser()
}
```

### 2. 📅 ReservasRepository.kt

```kotlin
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class ReservasRepository {
    private val reservasApi = ApiClient.retrofit.create(ReservasApiService::class.java)
    
    suspend fun crearReserva(request: ReservaRequest): Result<Reserva> {
        return withContext(Dispatchers.IO) {
            try {
                val response = reservasApi.crearReserva(request)
                
                if (response.isSuccessful && response.body()?.success == true) {
                    Result.success(response.body()!!.data)
                } else {
                    val errorMsg = when (response.code()) {
                        400 -> "Datos de reserva inválidos"
                        409 -> "El aula no está disponible en ese horario"
                        401 -> "Sesión expirada"
                        else -> "Error al crear la reserva"
                    }
                    Result.failure(Exception(errorMsg))
                }
            } catch (e: Exception) {
                Result.failure(Exception("Error de red: ${e.message}"))
            }
        }
    }
    
    suspend fun obtenerMisReservas(
        page: Int = 0,
        size: Int = 10,
        estado: String? = null
    ): Result<List<Reserva>> {
        return withContext(Dispatchers.IO) {
            try {
                val response = reservasApi.obtenerMisReservas(page, size, estado)
                
                if (response.isSuccessful && response.body()?.success == true) {
                    Result.success(response.body()!!.data)
                } else {
                    Result.failure(Exception("Error al cargar reservas"))
                }
            } catch (e: Exception) {
                Result.failure(Exception("Error de red: ${e.message}"))
            }
        }
    }
    
    suspend fun cancelarReserva(reservaId: Long, motivo: String): Result<String> {
        return withContext(Dispatchers.IO) {
            try {
                val request = CancelacionRequest(motivo)
                val response = reservasApi.cancelarReserva(reservaId, request)
                
                if (response.isSuccessful && response.body()?.success == true) {
                    Result.success(response.body()!!.data)
                } else {
                    val errorMsg = when (response.code()) {
                        404 -> "Reserva no encontrada"
                        400 -> "No se puede cancelar esta reserva"
                        401 -> "Sesión expirada"
                        else -> "Error al cancelar la reserva"
                    }
                    Result.failure(Exception(errorMsg))
                }
            } catch (e: Exception) {
                Result.failure(Exception("Error de red: ${e.message}"))
            }
        }
    }
    
    suspend fun verificarDisponibilidad(
        aulaId: Long,
        fecha: String,
        horaInicio: String,
        horaFin: String
    ): Result<Boolean> {
        return withContext(Dispatchers.IO) {
            try {
                val response = reservasApi.verificarDisponibilidad(aulaId, fecha, horaInicio, horaFin)
                
                if (response.isSuccessful && response.body()?.success == true) {
                    Result.success(response.body()!!.data)
                } else {
                    Result.failure(Exception("Error al verificar disponibilidad"))
                }
            } catch (e: Exception) {
                Result.failure(Exception("Error de red: ${e.message}"))
            }
        }
    }
}
```

## 🎯 ViewModels Completos

### 1. 🔐 AuthViewModel.kt

```kotlin
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class AuthViewModel(private val authRepository: AuthRepository) : ViewModel() {
    
    // Estados UI
    private val _uiState = MutableStateFlow(AuthUiState())
    val uiState: StateFlow<AuthUiState> = _uiState.asStateFlow()
    
    // Resultados de operaciones
    private val _loginResult = MutableStateFlow<Result<AuthResponse>?>(null)
    val loginResult: StateFlow<Result<AuthResponse>?> = _loginResult.asStateFlow()
    
    private val _registerResult = MutableStateFlow<Result<AuthResponse>?>(null)
    val registerResult: StateFlow<Result<AuthResponse>?> = _registerResult.asStateFlow()
    
    fun login(email: String, password: String) {
        if (!validateLoginInput(email, password)) return
        
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            
            val result = authRepository.login(email, password)
            _loginResult.value = result
            
            _uiState.value = _uiState.value.copy(
                isLoading = false,
                error = if (result.isFailure) result.exceptionOrNull()?.message else null
            )
        }
    }
    
    fun register(email: String, password: String, firstName: String, lastName: String) {
        if (!validateRegisterInput(email, password, firstName, lastName)) return
        
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            
            val result = authRepository.register(email, password, firstName, lastName)
            _registerResult.value = result
            
            _uiState.value = _uiState.value.copy(
                isLoading = false,
                error = if (result.isFailure) result.exceptionOrNull()?.message else null
            )
        }
    }
    
    fun logout() {
        authRepository.logout()
    }
    
    fun isLoggedIn(): Boolean = authRepository.isLoggedIn()
    
    fun getCurrentUser(): User? = authRepository.getCurrentUser()
    
    fun clearResults() {
        _loginResult.value = null
        _registerResult.value = null
        _uiState.value = _uiState.value.copy(error = null)
    }
    
    private fun validateLoginInput(email: String, password: String): Boolean {
        when {
            email.isEmpty() -> {
                _uiState.value = _uiState.value.copy(error = "Email requerido")
                return false
            }
            !email.endsWith("@tecsup.edu.pe") -> {
                _uiState.value = _uiState.value.copy(error = "Debe usar un email de TECSUP")
                return false
            }
            password.isEmpty() -> {
                _uiState.value = _uiState.value.copy(error = "Contraseña requerida")
                return false
            }
        }
        return true
    }
    
    private fun validateRegisterInput(
        email: String,
        password: String,
        firstName: String,
        lastName: String
    ): Boolean {
        when {
            email.isEmpty() -> {
                _uiState.value = _uiState.value.copy(error = "Email requerido")
                return false
            }
            !email.endsWith("@tecsup.edu.pe") -> {
                _uiState.value = _uiState.value.copy(error = "Debe usar un email de TECSUP")
                return false
            }
            password.length < 6 -> {
                _uiState.value = _uiState.value.copy(error = "La contraseña debe tener al menos 6 caracteres")
                return false
            }
            firstName.isEmpty() -> {
                _uiState.value = _uiState.value.copy(error = "Nombre requerido")
                return false
            }
            lastName.isEmpty() -> {
                _uiState.value = _uiState.value.copy(error = "Apellido requerido")
                return false
            }
        }
        return true
    }
}

// Estado de la UI
data class AuthUiState(
    val isLoading: Boolean = false,
    val error: String? = null
)

// Factory para el ViewModel
class AuthViewModelFactory(private val authRepository: AuthRepository) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(AuthViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return AuthViewModel(authRepository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
```

### 2. 📅 ReservasViewModel.kt

```kotlin
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class ReservasViewModel(
    private val reservasRepository: ReservasRepository,
    private val aulasRepository: AulasRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(ReservasUiState())
    val uiState: StateFlow<ReservasUiState> = _uiState.asStateFlow()
    
    private val _misReservas = MutableStateFlow<List<Reserva>>(emptyList())
    val misReservas: StateFlow<List<Reserva>> = _misReservas.asStateFlow()
    
    private val _aulasDisponibles = MutableStateFlow<List<AulaVirtual>>(emptyList())
    val aulasDisponibles: StateFlow<List<AulaVirtual>> = _aulasDisponibles.asStateFlow()
    
    fun cargarMisReservas(filtroEstado: String? = null) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoadingReservas = true)
            
            val result = reservasRepository.obtenerMisReservas(estado = filtroEstado)
            result.fold(
                onSuccess = { reservas ->
                    _misReservas.value = reservas
                    _uiState.value = _uiState.value.copy(
                        isLoadingReservas = false,
                        error = null
                    )
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(
                        isLoadingReservas = false,
                        error = error.message
                    )
                }
            )
        }
    }
    
    fun cargarAulasDisponibles() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoadingAulas = true)
            
            val result = aulasRepository.obtenerAulasDisponibles()
            result.fold(
                onSuccess = { aulas ->
                    _aulasDisponibles.value = aulas
                    _uiState.value = _uiState.value.copy(
                        isLoadingAulas = false,
                        error = null
                    )
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(
                        isLoadingAulas = false,
                        error = error.message
                    )
                }
            )
        }
    }
    
    fun crearReserva(request: ReservaRequest) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isCreatingReserva = true)
            
            val result = reservasRepository.crearReserva(request)
            result.fold(
                onSuccess = { reserva ->
                    _uiState.value = _uiState.value.copy(
                        isCreatingReserva = false,
                        reservaCreada = reserva,
                        error = null
                    )
                    // Recargar la lista de reservas
                    cargarMisReservas()
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(
                        isCreatingReserva = false,
                        error = error.message
                    )
                }
            )
        }
    }
    
    fun cancelarReserva(reservaId: Long, motivo: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isCancellingReserva = true)
            
            val result = reservasRepository.cancelarReserva(reservaId, motivo)
            result.fold(
                onSuccess = {
                    _uiState.value = _uiState.value.copy(
                        isCancellingReserva = false,
                        reservaCancelada = true,
                        error = null
                    )
                    // Recargar la lista de reservas
                    cargarMisReservas()
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(
                        isCancellingReserva = false,
                        error = error.message
                    )
                }
            )
        }
    }
    
    fun verificarDisponibilidad(aulaId: Long, fecha: String, horaInicio: String, horaFin: String) {
        viewModelScope.launch {
            val result = reservasRepository.verificarDisponibilidad(aulaId, fecha, horaInicio, horaFin)
            result.fold(
                onSuccess = { disponible ->
                    _uiState.value = _uiState.value.copy(
                        disponibilidadVerificada = disponible,
                        error = if (!disponible) "El aula no está disponible en ese horario" else null
                    )
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(error = error.message)
                }
            )
        }
    }
    
    fun clearError() {
        _uiState.value = _uiState.value.copy(error = null)
    }
    
    fun clearReservaCreada() {
        _uiState.value = _uiState.value.copy(reservaCreada = null)
    }
    
    fun clearReservaCancelada() {
        _uiState.value = _uiState.value.copy(reservaCancelada = false)
    }
}

data class ReservasUiState(
    val isLoadingReservas: Boolean = false,
    val isLoadingAulas: Boolean = false,
    val isCreatingReserva: Boolean = false,
    val isCancellingReserva: Boolean = false,
    val error: String? = null,
    val reservaCreada: Reserva? = null,
    val reservaCancelada: Boolean = false,
    val disponibilidadVerificada: Boolean? = null
)
```

## 🎨 Ejemplos de Activities/Fragments

### 1. 🔐 LoginActivity.kt

```kotlin
import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.isVisible
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.launch

class LoginActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityLoginBinding
    
    private val authViewModel: AuthViewModel by viewModels {
        AuthViewModelFactory(AuthRepository())
    }
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Inicializar TokenManager
        TokenManager.init(this)
        
        // Verificar si ya está logueado
        if (authViewModel.isLoggedIn()) {
            navigateToMain()
            return
        }
        
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupObservers()
        setupClickListeners()
    }
    
    private fun setupObservers() {
        lifecycleScope.launch {
            authViewModel.uiState.collect { state ->
                binding.progressBar.isVisible = state.isLoading
                binding.btnLogin.isEnabled = !state.isLoading
                binding.btnRegister.isEnabled = !state.isLoading
                
                state.error?.let { error ->
                    showError(error)
                    authViewModel.clearResults()
                }
            }
        }
        
        lifecycleScope.launch {
            authViewModel.loginResult.collect { result ->
                result?.let {
                    it.fold(
                        onSuccess = { authResponse ->
                            showSuccess("Bienvenido ${authResponse.userInfo.firstName}")
                            navigateToMain()
                        },
                        onFailure = { error ->
                            showError(error.message ?: "Error de login")
                        }
                    )
                    authViewModel.clearResults()
                }
            }
        }
        
        lifecycleScope.launch {
            authViewModel.registerResult.collect { result ->
                result?.let {
                    it.fold(
                        onSuccess = { authResponse ->
                            showSuccess("Registro exitoso. Bienvenido ${authResponse.userInfo.firstName}")
                            navigateToMain()
                        },
                        onFailure = { error ->
                            showError(error.message ?: "Error de registro")
                        }
                    )
                    authViewModel.clearResults()
                }
            }
        }
    }
    
    private fun setupClickListeners() {
        binding.btnLogin.setOnClickListener {
            val email = binding.etEmail.text.toString().trim()
            val password = binding.etPassword.text.toString()
            
            authViewModel.login(email, password)
        }
        
        binding.btnRegister.setOnClickListener {
            // Navegar a RegisterActivity o mostrar dialog
            startActivity(Intent(this, RegisterActivity::class.java))
        }
        
        binding.btnForgotPassword.setOnClickListener {
            // Implementar recuperación de contraseña
            showInfo("Contacta al administrador para recuperar tu contraseña")
        }
    }
    
    private fun navigateToMain() {
        startActivity(Intent(this, MainActivity::class.java))
        finish()
    }
    
    private fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
    }
    
    private fun showSuccess(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }
    
    private fun showInfo(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
    }
}
```

### 2. 📅 ReservasFragment.kt

```kotlin
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.core.view.isVisible
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import kotlinx.coroutines.launch

class ReservasFragment : Fragment() {
    
    private var _binding: FragmentReservasBinding? = null
    private val binding get() = _binding!!
    
    private val reservasViewModel: ReservasViewModel by viewModels {
        ReservasViewModelFactory(ReservasRepository(), AulasRepository())
    }
    
    private lateinit var reservasAdapter: ReservasAdapter
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentReservasBinding.inflate(inflater, container, false)
        return binding.root
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        setupRecyclerView()
        setupObservers()
        setupClickListeners()
        
        // Cargar datos iniciales
        reservasViewModel.cargarMisReservas()
    }
    
    private fun setupRecyclerView() {
        reservasAdapter = ReservasAdapter(
            onCancelClick = { reserva ->
                showCancelDialog(reserva)
            },
            onItemClick = { reserva ->
                // Navegar a detalle de reserva
                navigateToReservaDetail(reserva)
            }
        )
        
        binding.rvReservas.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = reservasAdapter
        }
    }
    
    private fun setupObservers() {
        lifecycleScope.launch {
            reservasViewModel.uiState.collect { state ->
                binding.progressBar.isVisible = state.isLoadingReservas
                binding.swipeRefresh.isRefreshing = state.isLoadingReservas
                
                state.error?.let { error ->
                    showError(error)
                    reservasViewModel.clearError()
                }
                
                if (state.reservaCancelada) {
                    showSuccess("Reserva cancelada exitosamente")
                    reservasViewModel.clearReservaCancelada()
                }
            }
        }
        
        lifecycleScope.launch {
            reservasViewModel.misReservas.collect { reservas ->
                reservasAdapter.submitList(reservas)
                binding.tvEmptyState.isVisible = reservas.isEmpty()
                binding.rvReservas.isVisible = reservas.isNotEmpty()
            }
        }
    }
    
    private fun setupClickListeners() {
        binding.fabNuevaReserva.setOnClickListener {
            // Navegar a crear nueva reserva
            navigateToCrearReserva()
        }
        
        binding.swipeRefresh.setOnRefreshListener {
            reservasViewModel.cargarMisReservas()
        }
        
        // Filtros
        binding.chipTodas.setOnClickListener {
            reservasViewModel.cargarMisReservas()
        }
        
        binding.chipPendientes.setOnClickListener {
            reservasViewModel.cargarMisReservas("PENDIENTE")
        }
        
        binding.chipConfirmadas.setOnClickListener {
            reservasViewModel.cargarMisReservas("CONFIRMADA")
        }
    }
    
    private fun showCancelDialog(reserva: Reserva) {
        if (!reserva.canBeCancelled()) {
            showError("Esta reserva no se puede cancelar")
            return
        }
        
        val dialog = CancelReservaDialog(
            reserva = reserva,
            onConfirm = { motivo ->
                reservasViewModel.cancelarReserva(reserva.id, motivo)
            }
        )
        dialog.show(parentFragmentManager, "cancel_reserva_dialog")
    }
    
    private fun navigateToReservaDetail(reserva: Reserva) {
        // Implementar navegación al detalle
        val action = ReservasFragmentDirections.actionToReservaDetail(reserva.id)
        findNavController().navigate(action)
    }
    
    private fun navigateToCrearReserva() {
        // Implementar navegación a crear reserva
        val action = ReservasFragmentDirections.actionToCrearReserva()
        findNavController().navigate(action)
    }
    
    private fun showError(message: String) {
        Toast.makeText(context, message, Toast.LENGTH_LONG).show()
    }
    
    private fun showSuccess(message: String) {
        Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
```

### 3. 📋 ReservasAdapter.kt

```kotlin
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.core.content.ContextCompat
import androidx.core.view.isVisible
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView

class ReservasAdapter(
    private val onCancelClick: (Reserva) -> Unit,
    private val onItemClick: (Reserva) -> Unit
) : ListAdapter<Reserva, ReservasAdapter.ReservaViewHolder>(ReservaDiffCallback()) {
    
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ReservaViewHolder {
        val binding = ItemReservaBinding.inflate(
            LayoutInflater.from(parent.context), parent, false
        )
        return ReservaViewHolder(binding)
    }
    
    override fun onBindViewHolder(holder: ReservaViewHolder, position: Int) {
        holder.bind(getItem(position))
    }
    
    inner class ReservaViewHolder(
        private val binding: ItemReservaBinding
    ) : RecyclerView.ViewHolder(binding.root) {
        
        fun bind(reserva: Reserva) {
            binding.apply {
                // Información básica
                tvAula.text = "${reserva.aulaVirtual.codigo} - ${reserva.aulaVirtual.nombre}"
                tvFecha.text = reserva.getFechaFormatted()
                tvHorario.text = reserva.getHorarioFormatted()
                tvMotivo.text = reserva.motivo
                
                // Estado
                tvEstado.text = reserva.estado
                tvEstado.setTextColor(
                    ContextCompat.getColor(root.context, reserva.getEstadoColor())
                )
                
                // Observaciones
                tvObservaciones.isVisible = !reserva.observaciones.isNullOrBlank()
                tvObservaciones.text = reserva.observaciones
                
                // Botón cancelar
                btnCancelar.isVisible = reserva.canBeCancelled()
                btnCancelar.setOnClickListener {
                    onCancelClick(reserva)
                }
                
                // Click en el item
                root.setOnClickListener {
                    onItemClick(reserva)
                }
                
                // Indicador visual para reservas próximas
                if (reserva.isUpcoming() && reserva.estado == Reserva.ESTADO_CONFIRMADA) {
                    indicadorProximo.isVisible = true
                } else {
                    indicadorProximo.isVisible = false
                }
            }
        }
    }
}

class ReservaDiffCallback : DiffUtil.ItemCallback<Reserva>() {
    override fun areItemsTheSame(oldItem: Reserva, newItem: Reserva): Boolean {
        return oldItem.id == newItem.id
    }
    
    override fun areContentsTheSame(oldItem: Reserva, newItem: Reserva): Boolean {
        return oldItem == newItem
    }
}
```

## 🔧 Utilidades y Helpers

### 1. 📅 DateTimeUtils.kt

```kotlin
import java.text.SimpleDateFormat
import java.util.*

object DateTimeUtils {
    
    private const val DATE_FORMAT_API = "yyyy-MM-dd"
    private const val TIME_FORMAT_API = "HH:mm"
    private const val DATE_FORMAT_DISPLAY = "dd/MM/yyyy"
    private const val TIME_FORMAT_DISPLAY = "HH:mm"
    private const val DATETIME_FORMAT_DISPLAY = "dd/MM/yyyy HH:mm"
    
    private val apiDateFormat = SimpleDateFormat(DATE_FORMAT_API, Locale.getDefault())
    private val apiTimeFormat = SimpleDateFormat(TIME_FORMAT_API, Locale.getDefault())
    private val displayDateFormat = SimpleDateFormat(DATE_FORMAT_DISPLAY, Locale.getDefault())
    private val displayTimeFormat = SimpleDateFormat(TIME_FORMAT_DISPLAY, Locale.getDefault())
    private val displayDateTimeFormat = SimpleDateFormat(DATETIME_FORMAT_DISPLAY, Locale.getDefault())
    
    fun formatDateForApi(date: Date): String {
        return apiDateFormat.format(date)
    }
    
    fun formatTimeForApi(date: Date): String {
        return apiTimeFormat.format(date)
    }
    
    fun formatDateForDisplay(dateString: String): String {
        return try {
            val date = apiDateFormat.parse(dateString)
            displayDateFormat.format(date ?: Date())
        } catch (e: Exception) {
            dateString
        }
    }
    
    fun formatTimeForDisplay(timeString: String): String {
        return try {
            val time = apiTimeFormat.parse(timeString)
            displayTimeFormat.format(time ?: Date())
        } catch (e: Exception) {
            timeString
        }
    }
    
    fun getCurrentDateForApi(): String {
        return apiDateFormat.format(Date())
    }
    
    fun getCurrentTimeForApi(): String {
        return apiTimeFormat.format(Date())
    }
    
    fun isDateInFuture(dateString: String): Boolean {
        return try {
            val date = apiDateFormat.parse(dateString)
            val today = Date()
            date?.after(today) == true
        } catch (e: Exception) {
            false
        }
    }
    
    fun isTimeValid(horaInicio: String, horaFin: String): Boolean {
        return try {
            val inicio = apiTimeFormat.parse(horaInicio)
            val fin = apiTimeFormat.parse(horaFin)
            fin?.after(inicio) == true
        } catch (e: Exception) {
            false
        }
    }
    
    fun getMinutesToReserva(fecha: String, horaInicio: String): Long? {
        return try {
            val reservaDateTime = "$fecha $horaInicio"
            val format = SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.getDefault())
            val reservaDate = format.parse(reservaDateTime)
            val now = Date()
            
            if (reservaDate != null) {
                (reservaDate.time - now.time) / (1000 * 60)
            } else null
        } catch (e: Exception) {
            null
        }
    }
}
```

### 2. 🔗 NetworkUtils.kt

```kotlin
import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities

object NetworkUtils {
    
    fun isNetworkAvailable(context: Context): Boolean {
        val connectivityManager = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        
        val network = connectivityManager.activeNetwork ?: return false
        val networkCapabilities = connectivityManager.getNetworkCapabilities(network) ?: return false
        
        return when {
            networkCapabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) -> true
            networkCapabilities.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) -> true
            networkCapabilities.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET) -> true
            else -> false
        }
    }
    
    fun isWifiConnected(context: Context): Boolean {
        val connectivityManager = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        
        val network = connectivityManager.activeNetwork ?: return false
        val networkCapabilities = connectivityManager.getNetworkCapabilities(network) ?: return false
        
        return networkCapabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI)
    }
}
```

Con estos ejemplos prácticos tienes todo lo necesario para integrar exitosamente tu aplicación Kotlin con el backend de Spring Boot. El código está optimizado para usar las mejores prácticas de Android y proporciona una base sólida para tu aplicación de reservas de aulas virtuales.
