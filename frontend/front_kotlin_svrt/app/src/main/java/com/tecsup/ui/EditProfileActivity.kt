package com.tecsup.ui

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.bumptech.glide.Glide
import com.google.android.material.button.MaterialButton
import com.tecsup.R
import com.tecsup.utils.NetworkUtils
import okhttp3.*
import org.json.JSONArray
import org.json.JSONObject
import java.io.IOException
import okhttp3.MediaType.Companion.toMediaType
import com.tecsup.model.Departamento
import com.tecsup.model.Carrera
import com.tecsup.model.Curso
import com.tecsup.api.ApiService
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import android.view.LayoutInflater
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.TextView

class EditProfileActivity : AppCompatActivity() {
    private lateinit var ivAvatar: ImageView
    private lateinit var tvNombreCompleto: TextView
    private lateinit var tvNombre: TextView
    private lateinit var tvApellidos: TextView
    private lateinit var tvCorreo: TextView
    private lateinit var spinnerDepartamento: Spinner
    private lateinit var spinnerCarrera: Spinner
    private lateinit var spinnerCurso: Spinner
    private lateinit var btnGuardar: MaterialButton
    private lateinit var btnCancelar: MaterialButton
    private lateinit var departamentos: List<Departamento>
    private lateinit var carreras: List<Carrera>
    private lateinit var cursos: List<Curso>

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_edit_profile)
        ivAvatar = findViewById(R.id.ivAvatar)
        tvNombreCompleto = findViewById(R.id.tvNombreCompleto)
        tvNombre = findViewById(R.id.tvNombre)
        tvApellidos = findViewById(R.id.tvApellidos)
        tvCorreo = findViewById(R.id.tvCorreo)
        spinnerDepartamento = findViewById(R.id.spinnerDepartamento)
        spinnerCarrera = findViewById(R.id.spinnerCarrera)
        spinnerCurso = findViewById(R.id.spinnerCurso)
        btnGuardar = findViewById(R.id.btnGuardar)
        btnCancelar = findViewById(R.id.btnCancelar)
        cargarDatosPerfil()
        btnGuardar.setOnClickListener { guardarCambios() }
        btnCancelar.setOnClickListener { finish() }
        cargarOpcionesSpinners()
    }

    private fun cargarOpcionesSpinners() {
        val prefs = getSharedPreferences("MisPreferencias", 0)
        val token = prefs.getString("token", null) ?: return
        val api = NetworkUtils.getApiService()
        // Departamentos
        api.listarDepartamentos("Bearer $token").enqueue(object : Callback<com.tecsup.model.ApiResponse<List<Departamento>>> {
            override fun onResponse(call: Call<com.tecsup.model.ApiResponse<List<Departamento>>>, response: Response<com.tecsup.model.ApiResponse<List<Departamento>>>) {
                val lista = response.body()?.data ?: emptyList()
                departamentos = lista
                val adapter = object : ArrayAdapter<Departamento>(this@EditProfileActivity, R.layout.item_spinner, lista) {
                    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
                        val view = convertView ?: LayoutInflater.from(context).inflate(R.layout.item_spinner, parent, false)
                        val tv = view.findViewById<TextView>(R.id.tvSpinnerItem)
                        tv.text = lista[position].nombre
                        return view
                    }
                    override fun getDropDownView(position: Int, convertView: View?, parent: ViewGroup): View {
                        val view = convertView ?: LayoutInflater.from(context).inflate(R.layout.item_spinner, parent, false)
                        val tv = view.findViewById<TextView>(R.id.tvSpinnerItem)
                        tv.text = lista[position].nombre
                        return view
                    }
                }
                spinnerDepartamento.adapter = adapter
            }
            override fun onFailure(call: Call<com.tecsup.model.ApiResponse<List<Departamento>>>, t: Throwable) {}
        })
        // Carreras
        api.listarCarreras("Bearer $token").enqueue(object : Callback<com.tecsup.model.ApiResponse<List<Carrera>>> {
            override fun onResponse(call: Call<com.tecsup.model.ApiResponse<List<Carrera>>>, response: Response<com.tecsup.model.ApiResponse<List<Carrera>>>) {
                val lista = response.body()?.data ?: emptyList()
                carreras = lista
                val adapter = object : ArrayAdapter<Carrera>(this@EditProfileActivity, R.layout.item_spinner, lista) {
                    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
                        val view = convertView ?: LayoutInflater.from(context).inflate(R.layout.item_spinner, parent, false)
                        val tv = view.findViewById<TextView>(R.id.tvSpinnerItem)
                        tv.text = lista[position].nombre
                        return view
                    }
                    override fun getDropDownView(position: Int, convertView: View?, parent: ViewGroup): View {
                        val view = convertView ?: LayoutInflater.from(context).inflate(R.layout.item_spinner, parent, false)
                        val tv = view.findViewById<TextView>(R.id.tvSpinnerItem)
                        tv.text = lista[position].nombre
                        return view
                    }
                }
                spinnerCarrera.adapter = adapter
            }
            override fun onFailure(call: Call<com.tecsup.model.ApiResponse<List<Carrera>>>, t: Throwable) {}
        })
        // Cursos
        api.listarCursos("Bearer $token").enqueue(object : Callback<com.tecsup.model.ApiResponse<List<Curso>>> {
            override fun onResponse(call: Call<com.tecsup.model.ApiResponse<List<Curso>>>, response: Response<com.tecsup.model.ApiResponse<List<Curso>>>) {
                val lista = response.body()?.data ?: emptyList()
                cursos = lista
                val adapter = object : ArrayAdapter<Curso>(this@EditProfileActivity, R.layout.item_spinner, lista) {
                    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
                        val view = convertView ?: LayoutInflater.from(context).inflate(R.layout.item_spinner, parent, false)
                        val tv = view.findViewById<TextView>(R.id.tvSpinnerItem)
                        tv.text = lista[position].nombre
                        return view
                    }
                    override fun getDropDownView(position: Int, convertView: View?, parent: ViewGroup): View {
                        val view = convertView ?: LayoutInflater.from(context).inflate(R.layout.item_spinner, parent, false)
                        val tv = view.findViewById<TextView>(R.id.tvSpinnerItem)
                        tv.text = lista[position].nombre
                        return view
                    }
                }
                spinnerCurso.adapter = adapter
            }
            override fun onFailure(call: Call<com.tecsup.model.ApiResponse<List<Curso>>>, t: Throwable) {}
        })
    }

    private fun cargarDatosPerfil() {
        val prefs = getSharedPreferences("MisPreferencias", 0)
        val token = prefs.getString("token", null)
        if (token.isNullOrBlank()) {
            Toast.makeText(this, "Token no encontrado. Inicia sesión primero.", Toast.LENGTH_LONG).show()
            finish()
            return
        }
        val client = NetworkUtils.createOkHttpClient()
        val request = Request.Builder()
            .url("http://192.168.1.208:8080/api/perfil")
            .get()
            .addHeader("Authorization", "Bearer $token")
            .build()
        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                runOnUiThread {
                    Toast.makeText(this@EditProfileActivity, "Error de red: ${e.message}", Toast.LENGTH_LONG).show()
                    finish()
                }
            }
            override fun onResponse(call: Call, response: Response) {
                val body = response.body?.string()
                runOnUiThread {
                    if (body.isNullOrBlank()) {
                        Toast.makeText(this@EditProfileActivity, "Respuesta vacía del servidor", Toast.LENGTH_LONG).show()
                        finish()
                        return@runOnUiThread
                    }
                    if (response.isSuccessful) {
                        try {
                            val json = JSONObject(body)
                            val data = json.optJSONObject("data") ?: json
                            val firstName = data.optString("firstName", "")
                            val lastName = data.optString("lastName", "")
                            val email = data.optString("email", "")
                            val imagenPerfil = data.optString("imagenPerfil", null)
                            val departamentoObj = data.optJSONObject("departamento")
                            val departamentoNombre = departamentoObj?.optString("nombre", "") ?: ""
                            val carrerasArray = data.optJSONArray("carreras")
                            val cursosArray = data.optJSONArray("cursos")
                            tvNombreCompleto.text = "$firstName $lastName"
                            tvNombre.text = "Nombre: $firstName"
                            tvApellidos.text = "Apellidos: $lastName"
                            tvCorreo.text = "Correo: $email"
                            if (!imagenPerfil.isNullOrBlank()) {
                                Glide.with(this@EditProfileActivity)
                                    .load(imagenPerfil)
                                    .placeholder(R.drawable.default_avatar)
                                    .error(R.drawable.default_avatar)
                                    .circleCrop()
                                    .into(ivAvatar)
                            } else {
                                ivAvatar.setImageResource(R.drawable.default_avatar)
                            }
                            // Simular datos para spinners (deberían venir de la API en producción)
                            val departamentos = listOf("Ingeniería", "Administración", "Ciencias")
                            val carreras = listOf("Sistemas", "Industrial", "Mecatrónica")
                            val cursos = listOf("Matemática", "Programación", "Física")
                            spinnerDepartamento.adapter = ArrayAdapter(this@EditProfileActivity, android.R.layout.simple_spinner_dropdown_item, departamentos)
                            spinnerCarrera.adapter = ArrayAdapter(this@EditProfileActivity, android.R.layout.simple_spinner_dropdown_item, carreras)
                            spinnerCurso.adapter = ArrayAdapter(this@EditProfileActivity, android.R.layout.simple_spinner_dropdown_item, cursos)
                            // Seleccionar valores actuales si existen
                            if (departamentoNombre.isNotBlank()) {
                                val idx = departamentos.indexOf(departamentoNombre)
                                if (idx >= 0) spinnerDepartamento.setSelection(idx)
                            }
                            // Para carreras y cursos, seleccionar el primero si hay datos
                            if (carrerasArray != null && carrerasArray.length() > 0) {
                                val nombre = carrerasArray.getJSONObject(0).optString("nombre", "")
                                val idx = carreras.indexOf(nombre)
                                if (idx >= 0) spinnerCarrera.setSelection(idx)
                            }
                            if (cursosArray != null && cursosArray.length() > 0) {
                                val nombre = cursosArray.getJSONObject(0).optString("nombre", "")
                                val idx = cursos.indexOf(nombre)
                                if (idx >= 0) spinnerCurso.setSelection(idx)
                            }
                        } catch (e: Exception) {
                            Toast.makeText(this@EditProfileActivity, "Error procesando datos de perfil", Toast.LENGTH_LONG).show()
                        }
                    } else {
                        Toast.makeText(this@EditProfileActivity, "Error al obtener perfil", Toast.LENGTH_LONG).show()
                        finish()
                    }
                }
            }
        })
    }

    private fun guardarCambios() {
        val prefs = getSharedPreferences("MisPreferencias", 0)
        val token = prefs.getString("token", null)
        if (token.isNullOrBlank()) {
            Toast.makeText(this, "Token no encontrado. Inicia sesión primero.", Toast.LENGTH_LONG).show()
            return
        }
        val departamento = departamentos.getOrNull(spinnerDepartamento.selectedItemPosition)
        val carrera = carreras.getOrNull(spinnerCarrera.selectedItemPosition)
        val curso = cursos.getOrNull(spinnerCurso.selectedItemPosition)
        val json = org.json.JSONObject()
        json.put("departamentoId", departamento?.id)
        json.put("carreraId", carrera?.id)
        json.put("cursoId", curso?.id)
        val requestBody = okhttp3.RequestBody.create("application/json".toMediaType(), json.toString())
        val api = NetworkUtils.getApiService()
        val call = api.actualizarPerfil("Bearer $token", requestBody)
        call.enqueue(object : retrofit2.Callback<okhttp3.ResponseBody> {
            override fun onResponse(call: retrofit2.Call<okhttp3.ResponseBody>, response: retrofit2.Response<okhttp3.ResponseBody>) {
                if (response.isSuccessful) {
                    Toast.makeText(this@EditProfileActivity, "Cambios guardados correctamente", Toast.LENGTH_SHORT).show()
                    setResult(RESULT_OK)
                    finish()
                } else {
                    Toast.makeText(this@EditProfileActivity, "Error al guardar cambios", Toast.LENGTH_LONG).show()
                }
            }
            override fun onFailure(call: retrofit2.Call<okhttp3.ResponseBody>, t: Throwable) {
                Toast.makeText(this@EditProfileActivity, "Error al guardar cambios: ${t.message}", Toast.LENGTH_LONG).show()
            }
        })
    }
} 