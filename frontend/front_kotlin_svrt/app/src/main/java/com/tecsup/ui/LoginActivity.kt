package com.tecsup.ui

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import com.tecsup.R
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.io.IOException

class LoginActivity : AppCompatActivity() {

    private lateinit var etUsuario: EditText
    private lateinit var etContrasena: EditText
    private lateinit var btnIngresar: Button
    private lateinit var btnGoogleSignIn: LinearLayout
    private lateinit var tvOlvidasteContrasena: TextView

    private val RC_SIGN_IN = 9001
    private lateinit var googleSignInClient: GoogleSignInClient

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        etUsuario = findViewById(R.id.etUsuario)
        etContrasena = findViewById(R.id.etContrasena)
        btnIngresar = findViewById(R.id.btnIngresar)
        btnGoogleSignIn = findViewById(R.id.btnGoogleSignIn)
        tvOlvidasteContrasena = findViewById(R.id.tvOlvidasteContrasena)

        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken(getString(R.string.default_web_client_id))
            .requestEmail()
            .build()

        googleSignInClient = GoogleSignIn.getClient(this, gso)

        btnGoogleSignIn.setOnClickListener { signIn() }
        btnIngresar.setOnClickListener { loginConCredenciales() }

        tvOlvidasteContrasena.setOnClickListener {
            Toast.makeText(this, "Funcionalidad en desarrollo", Toast.LENGTH_SHORT).show()
        }
    }

    private fun signIn() {
        val signInIntent = googleSignInClient.signInIntent
        startActivityForResult(signInIntent, RC_SIGN_IN)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == RC_SIGN_IN) {
            handleGoogleSignInResult(data)
        }
    }

    private fun handleGoogleSignInResult(data: Intent?) {
        try {
            val task = GoogleSignIn.getSignedInAccountFromIntent(data)
            val account = task.getResult(ApiException::class.java)
            val idToken = account?.idToken ?: ""

            Log.i("GoogleSignIn", "ID Token: $idToken")

            if (idToken.isNotEmpty()) {
                val json = JSONObject().apply {
                    put("token", idToken)
                }

                val requestBody = json.toString().toRequestBody("application/json".toMediaType())

                val request = Request.Builder()
                    .url("http://10.0.2.2:8080/api/auth/google")
                    .post(requestBody)
                    .build()

                val client = OkHttpClient()

                client.newCall(request).enqueue(object : Callback {
                    override fun onFailure(call: Call, e: IOException) {
                        runOnUiThread {
                            Toast.makeText(this@LoginActivity, "Error de red", Toast.LENGTH_SHORT).show()
                        }
                    }

                    override fun onResponse(call: Call, response: Response) {
                        val body = response.body?.string()
                        val jsonResp = JSONObject(body ?: "{}")

                        if (response.isSuccessful) {
                            val token = jsonResp.getString("token")
                            val user = jsonResp.getJSONObject("user")
                            val nombre = user.optString("first_name")
                            val email = user.optString("email")

                            val prefs = getSharedPreferences("MisPreferencias", MODE_PRIVATE)
                            prefs.edit().putString("token", token).apply()

                            irAPantallaPrincipal(nombre, email)
                        } else {
                            runOnUiThread {
                                Toast.makeText(this@LoginActivity, "Token inválido de Google", Toast.LENGTH_LONG).show()
                            }
                        }
                    }
                })
            } else {
                Toast.makeText(this, "Error: ID Token vacío", Toast.LENGTH_LONG).show()
            }

        } catch (e: ApiException) {
            Log.e("GoogleSignIn", "Google Sign-In falló: Código ${e.statusCode}", e)
            Toast.makeText(this, "Error al iniciar sesión: código ${e.statusCode}", Toast.LENGTH_LONG).show()
        }
    }

    private fun irAPantallaPrincipal(nombre: String, email: String) {
        runOnUiThread {
            Toast.makeText(this, "¡Login exitoso! Bienvenido $nombre", Toast.LENGTH_LONG).show()
            val intent = Intent(this, MainActivity::class.java)
            intent.putExtra("user_name", nombre)
            intent.putExtra("user_email", email)
            startActivity(intent)
            finish()
        }
    }


    private fun loginConCredenciales() {
        val usuario = etUsuario.text.toString().trim()
        val contrasena = etContrasena.text.toString().trim()

        if (usuario.isEmpty()) {
            etUsuario.error = "Ingrese su usuario"
            etUsuario.requestFocus()
            return
        }

        if (contrasena.isEmpty()) {
            etContrasena.error = "Ingrese su contraseña"
            etContrasena.requestFocus()
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

        val client = OkHttpClient()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                runOnUiThread {
                    Toast.makeText(this@LoginActivity, "Error de red", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                val body = response.body?.string()
                val jsonResp = JSONObject(body ?: "{}")

                if (response.isSuccessful) {
                    val token = jsonResp.getString("token")
                    val user = jsonResp.getJSONObject("user")
                    val nombre = user.optString("firstName") // ✔️ revisa que coincida con backend
                    val email = user.optString("email")

                    val sharedPref = getSharedPreferences("MisPreferencias", Context.MODE_PRIVATE)
                    sharedPref.edit().putString("token", token).apply()

                    Log.d("TOKEN_DEBUG", "Token guardado: $token")

                    irAPantallaPrincipal(nombre, email)
                } else {
                    runOnUiThread {
                        Toast.makeText(this@LoginActivity, "Credenciales inválidas", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        })
    }
}