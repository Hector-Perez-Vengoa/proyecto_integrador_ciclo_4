package com.tecsup

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import android.widget.LinearLayout
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import com.google.android.gms.tasks.Task

class LoginActivity : AppCompatActivity() {

    private lateinit var etUsuario: EditText
    private lateinit var etContrasena: EditText
    private lateinit var btnIngresar: Button
    private lateinit var btnGoogleSignIn: LinearLayout
    private lateinit var tvOlvidasteContrasena: TextView

    private lateinit var googleSignInClient: GoogleSignInClient
    private val RC_SIGN_IN = 9001

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        initViews()
        setupGoogleSignIn()
        setupClickListeners()
    }

    private fun initViews() {
        etUsuario = findViewById(R.id.etUsuario)
        etContrasena = findViewById(R.id.etContrasena)
        btnIngresar = findViewById(R.id.btnIngresar)
        btnGoogleSignIn = findViewById(R.id.btnGoogleSignIn)
        tvOlvidasteContrasena = findViewById(R.id.tvOlvidasteContrasena)
    }

    private fun setupGoogleSignIn() {
        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestEmail()
            .requestProfile()
            .build()

        googleSignInClient = GoogleSignIn.getClient(this, gso)
    }

    private fun setupClickListeners() {
        btnIngresar.setOnClickListener {
            loginConCredenciales()
        }

        btnGoogleSignIn.setOnClickListener {
            signInWithGoogle()
        }

        tvOlvidasteContrasena.setOnClickListener {
            Toast.makeText(this, "Funcionalidad en desarrollo", Toast.LENGTH_SHORT).show()
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

        // Aquí implementa tu lógica de autenticación tradicional
        Toast.makeText(this, "Iniciando sesión con: $usuario", Toast.LENGTH_SHORT).show()

        // Simular login exitoso
        if (usuario == "admin" && contrasena == "123") {
            irAPantallaPrincipal("Usuario Local", usuario)
        } else {
            Toast.makeText(this, "Credenciales incorrectas", Toast.LENGTH_SHORT).show()
        }
    }

    private fun signInWithGoogle() {
        val signInIntent = googleSignInClient.signInIntent
        startActivityForResult(signInIntent, RC_SIGN_IN)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == RC_SIGN_IN) {
            val task = GoogleSignIn.getSignedInAccountFromIntent(data)
            handleSignInResult(task)
        }
    }

    private fun handleSignInResult(completedTask: Task<GoogleSignInAccount>) {
        try {
            val account = completedTask.getResult(ApiException::class.java)

            // Verificar si es una cuenta de TECSUP (opcional)
            val email = account?.email
            Log.d("LoginActivity", "signInResult:success - email: $email")

            if (email != null) {
                if (email.endsWith("@tecsup.edu.pe")) {
                    // Login exitoso con cuenta TECSUP
                    Toast.makeText(this, "Bienvenido: ${account.displayName}", Toast.LENGTH_LONG).show()
                    irAPantallaPrincipal(account.displayName ?: "Usuario Google", email)
                } else {
                    // Permitir otras cuentas de Google también
                    Toast.makeText(this, "Bienvenido: ${account.displayName}", Toast.LENGTH_LONG).show()
                    irAPantallaPrincipal(account.displayName ?: "Usuario Google", email)
                }
            }

        } catch (e: ApiException) {
            Log.w("LoginActivity", "signInResult:failed code=" + e.statusCode)
            when (e.statusCode) {
                12501 -> Toast.makeText(this, "Login cancelado", Toast.LENGTH_SHORT).show()
                7 -> Toast.makeText(this, "Sin conexión a internet", Toast.LENGTH_SHORT).show()
                else -> Toast.makeText(this, "Error al iniciar sesión: ${e.statusCode}", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun irAPantallaPrincipal(nombre: String, email: String) {
        // Crear intent para ir a la pantalla principal
        // Reemplaza MainActivity con el nombre de tu activity principal

        Toast.makeText(this, "¡Login exitoso! Bienvenido $nombre", Toast.LENGTH_LONG).show()

        /* Descomenta cuando tengas tu MainActivity
        val intent = Intent(this, MainActivity::class.java)
        intent.putExtra("user_name", nombre)
        intent.putExtra("user_email", email)
        startActivity(intent)
        finish()
        */
    }

    override fun onStart() {
        super.onStart()

        // Verificar si ya hay una cuenta logueada
        val account = GoogleSignIn.getLastSignedInAccount(this)
        if (account != null) {
            Log.d("LoginActivity", "Usuario ya logueado: ${account.email}")
            // Opcional: ir directo a la pantalla principal
            // irAPantallaPrincipal(account.displayName ?: "Usuario", account.email ?: "")
        }
    }
}