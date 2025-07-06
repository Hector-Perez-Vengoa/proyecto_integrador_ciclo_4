package com.tecsup.ui

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.*
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import com.tecsup.R
import com.tecsup.utils.NetworkUtils
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.io.IOException
import java.net.SocketTimeoutException
import java.net.UnknownHostException

class LoginActivity : AppCompatActivity() {

    private lateinit var etUsuario: EditText
    private lateinit var etContrasena: EditText
    private lateinit var btnIngresar: Button
    private lateinit var btnGoogleSignIn: LinearLayout
    private lateinit var tvOlvidasteContrasena: TextView
    private lateinit var progressBar: ProgressBar

    private lateinit var googleSignInClient: GoogleSignInClient

    // Activity Result API para Google Sign-In
    private val googleSignInLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        Log.d("GoogleSignIn", "Result code: ${result.resultCode}")
        Log.d("GoogleSignIn", "Data: ${result.data}")
        
        if (result.resultCode == RESULT_OK) {
            val data = result.data
            handleGoogleSignInResult(data)
        } else {
            Log.w("GoogleSignIn", "Google Sign-In cancelado o fallido con código: ${result.resultCode}")
            showLoading(false)
            
            val errorMessage = when (result.resultCode) {
                RESULT_CANCELED -> "Inicio de sesión cancelado por el usuario"
                else -> "Error en el inicio de sesión (código: ${result.resultCode})"
            }
            Toast.makeText(this, errorMessage, Toast.LENGTH_SHORT).show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        initViews()
        setupGoogleSignIn()
        setupClickListeners()
        
        // Verificar si ya hay una sesión activa
        checkExistingSignIn()
    }

    private fun initViews() {
        etUsuario = findViewById(R.id.etUsuario)
        etContrasena = findViewById(R.id.etContrasena)
        btnIngresar = findViewById(R.id.btnIngresar)
        btnGoogleSignIn = findViewById(R.id.btnGoogleSignIn)
        tvOlvidasteContrasena = findViewById(R.id.tvOlvidasteContrasena)
        progressBar = findViewById(R.id.progressBar)
    }

    private fun setupGoogleSignIn() {
        try {
            // Configuración correcta con idToken para Firebase y backend
            val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .requestProfile()
                .requestIdToken(getString(R.string.default_web_client_id))
                .build()

            googleSignInClient = GoogleSignIn.getClient(this, gso)
            Log.d("GoogleSignIn", "Google Sign-In configurado correctamente")
        } catch (e: Exception) {
            Log.e("GoogleSignIn", "Error configurando Google Sign-In", e)
            Toast.makeText(this, "Error configurando Google Sign-In", Toast.LENGTH_LONG).show()
        }
    }

    private fun checkExistingSignIn() {
        val account = GoogleSignIn.getLastSignedInAccount(this)
        if (account != null) {
            Log.d("GoogleSignIn", "Usuario ya autenticado: ${account.email}")
            // Opcional: auto-login si ya hay sesión
            // handleGoogleSignInResult(null)
        }
    }

    private fun setupClickListeners() {
        btnGoogleSignIn.setOnClickListener { 
            if (NetworkUtils.isNetworkAvailable(this)) {
                showLoading(true)
                signIn() 
            } else {
                Toast.makeText(this, "Sin conexión a internet", Toast.LENGTH_SHORT).show()
            }
        }
        btnIngresar.setOnClickListener { 
            if (NetworkUtils.isNetworkAvailable(this)) {
                showLoading(true)
                loginConCredenciales() 
            } else {
                Toast.makeText(this, "Sin conexión a internet", Toast.LENGTH_SHORT).show()
            }
        }

        tvOlvidasteContrasena.setOnClickListener {
            Toast.makeText(this, "Funcionalidad en desarrollo", Toast.LENGTH_SHORT).show()
        }
    }

    private fun showLoading(show: Boolean) {
        progressBar.visibility = if (show) View.VISIBLE else View.GONE
        btnIngresar.isEnabled = !show
        btnGoogleSignIn.isEnabled = !show
    }

    private fun signIn() {
        try {
            Log.d("GoogleSignIn", "Iniciando Google Sign-In...")
            val signInIntent = googleSignInClient.signInIntent
            googleSignInLauncher.launch(signInIntent)
        } catch (e: Exception) {
            Log.e("GoogleSignIn", "Error al iniciar Google Sign-In", e)
            showLoading(false)
            Toast.makeText(this, "Error al iniciar Google Sign-In", Toast.LENGTH_LONG).show()
        }
    }

    private fun handleGoogleSignInResult(data: Intent?) {
        try {
            Log.d("GoogleSignIn", "Procesando resultado de Google Sign-In")
            val task = GoogleSignIn.getSignedInAccountFromIntent(data)
            val account = task.getResult(ApiException::class.java)
            
            Log.d("GoogleSignIn", "Cuenta obtenida: "+account.email)
            
            val email = account.email ?: ""
            val displayName = account.displayName ?: "Usuario"
            val id = account.id ?: ""
            val idToken = account.idToken

            val parts = displayName.trim().split(" ")
            val firstName = parts.firstOrNull() ?: "Usuario"
            val lastName = if (parts.size > 1) parts.subList(1, parts.size).joinToString(" ") else "SinApellido"

            if (email.isNotEmpty() && idToken != null) {
                Log.d("GoogleSignIn", "Información de cuenta obtenida correctamente")
                loginGoogleBackend(idToken, firstName, lastName, email)
            } else {
                showLoading(false)
                Log.e("GoogleSignIn", "Email o idToken vacío")
                Toast.makeText(this, "Error: No se pudo obtener la información de la cuenta", Toast.LENGTH_LONG).show()
            }

        } catch (e: ApiException) {
            showLoading(false)
            Log.e("GoogleSignIn", "Google Sign-In falló: Código "+e.statusCode, e)
            val errorMessage = when (e.statusCode) {
                12501 -> "Inicio de sesión cancelado"
                12500 -> "Error de configuración del desarrollador"
                12502 -> "Error de red"
                12503 -> "Error interno"
                12504 -> "Tiempo de espera agotado"
                else -> "Error al iniciar sesión: código "+e.statusCode
            }
            Toast.makeText(this, errorMessage, Toast.LENGTH_LONG).show()
        } catch (e: Exception) {
            showLoading(false)
            Log.e("GoogleSignIn", "Error inesperado en Google Sign-In", e)
            Toast.makeText(this, "Error inesperado: "+e.message, Toast.LENGTH_LONG).show()
        }
    }

    // Nuevo método: login real con Google y backend
    private fun loginGoogleBackend(idToken: String, firstName: String, lastName: String, email: String) {
        Log.d("GoogleSignIn", "Enviando idToken real al backend para: $email")
        val json = org.json.JSONObject().apply {
            put("token", idToken)
        }
        val requestBody = json.toString().toRequestBody("application/json".toMediaType())
        val request = okhttp3.Request.Builder()
            .url("http://10.0.2.2:8080/api/auth/google")
            .post(requestBody)
            .build()
        val client = com.tecsup.utils.NetworkUtils.createOkHttpClient()
        client.newCall(request).enqueue(object : okhttp3.Callback {
            override fun onFailure(call: okhttp3.Call, e: java.io.IOException) {
                runOnUiThread {
                    showLoading(false)
                    val errorMessage = com.tecsup.utils.NetworkUtils.getErrorMessage(e)
                    Toast.makeText(this@LoginActivity, errorMessage, Toast.LENGTH_SHORT).show()
                }
            }
            override fun onResponse(call: okhttp3.Call, response: okhttp3.Response) {
                val body = response.body?.string()
                runOnUiThread {
                    showLoading(false)
                    try {
                        val jsonResp = org.json.JSONObject(body ?: "{}")
                        if (response.isSuccessful) {
                            val token = jsonResp.getString("token")
                            val user = jsonResp.getJSONObject("user")
                            val nombre = user.optString("firstName", firstName)
                            val emailResp = user.optString("email", email)
                            guardarTokenYIrAPrincipal(token, nombre, emailResp)
                        } else {
                            val errorMessage = jsonResp.optString("message", "Error de autenticación con Google")
                            Toast.makeText(this@LoginActivity, errorMessage, Toast.LENGTH_SHORT).show()
                        }
                    } catch (e: Exception) {
                        Toast.makeText(this@LoginActivity, "Error procesando respuesta del servidor", Toast.LENGTH_LONG).show()
                    }
                }
            }
        })
    }

    private fun irAPantallaPrincipal(nombre: String, email: String) {
        Toast.makeText(this, "¡Login exitoso! Bienvenido $nombre", Toast.LENGTH_LONG).show()
        val intent = Intent(this, MainActivity::class.java)
        intent.putExtra("user_name", nombre)
        intent.putExtra("user_email", email)
        startActivity(intent)
        finish()
    }

    private fun loginConCredenciales() {
        val usuario = etUsuario.text.toString().trim()
        val contrasena = etContrasena.text.toString().trim()

        if (!validarCampos(usuario, contrasena)) {
            showLoading(false)
            return
        }

        val json = JSONObject().apply {
            put("email", usuario)
            put("password", contrasena)
        }

        val requestBody = json.toString().toRequestBody("application/json".toMediaType())

        val request = Request.Builder()
            .url("http://10.0.2.2:8080/api/auth/signin")
            .post(requestBody)
            .build()

        val client = NetworkUtils.createOkHttpClient()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                runOnUiThread {
                    showLoading(false)
                    val errorMessage = NetworkUtils.getErrorMessage(e)
                    Toast.makeText(this@LoginActivity, errorMessage, Toast.LENGTH_SHORT).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                val body = response.body?.string()
                
                runOnUiThread {
                    showLoading(false)
                    
                    try {
                        val jsonResp = JSONObject(body ?: "{}")

                        if (response.isSuccessful) {
                            val token = jsonResp.getString("token")
                            val user = jsonResp.getJSONObject("user")
                            val nombre = user.optString("firstName")
                            val email = user.optString("email")

                            guardarTokenYIrAPrincipal(token, nombre, email)
                        } else {
                            val errorMessage = jsonResp.optString("message", "Credenciales inválidas")
                            Toast.makeText(this@LoginActivity, errorMessage, Toast.LENGTH_SHORT).show()
                        }
                    } catch (e: Exception) {
                        Toast.makeText(this@LoginActivity, "Error procesando respuesta del servidor", Toast.LENGTH_LONG).show()
                    }
                }
            }
        })
    }

    private fun guardarTokenYIrAPrincipal(token: String, nombre: String, email: String) {
        val prefs = getSharedPreferences("MisPreferencias", MODE_PRIVATE)
        prefs.edit().putString("token", token).apply()

        irAPantallaPrincipal(nombre, email)
    }

    private fun validarCampos(usuario: String, contrasena: String): Boolean {
        if (usuario.isEmpty()) {
            etUsuario.error = "Ingrese su usuario"
            etUsuario.requestFocus()
            return false
        }

        if (contrasena.isEmpty()) {
            etContrasena.error = "Ingrese su contraseña"
            etContrasena.requestFocus()
            return false
        }

        return true
    }
}