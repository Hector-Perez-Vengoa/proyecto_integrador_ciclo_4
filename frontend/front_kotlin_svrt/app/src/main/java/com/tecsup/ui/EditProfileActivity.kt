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
import com.tecsup.model.UserProfile
import android.widget.AutoCompleteTextView

class EditProfileActivity : AppCompatActivity() {
    private lateinit var ivAvatar: ImageView
    private lateinit var tvNombreCompleto: TextView
    private lateinit var tvNombre: TextView
    private lateinit var tvApellidos: TextView
    private lateinit var tvCorreo: TextView
    private lateinit var spinnerDepartamento: AutoCompleteTextView
    private lateinit var spinnerCarrera: AutoCompleteTextView
    private lateinit var spinnerCurso: AutoCompleteTextView
    private lateinit var btnGuardar: MaterialButton
    private lateinit var btnCancelar: MaterialButton
    private var departamentos: List<Departamento> = emptyList()
    private var carreras: List<Carrera> = emptyList()
    private var cursos: List<Curso> = emptyList()
    private var spinnersCargados = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_edit_profile)
        ivAvatar = findViewById(R.id.ivAvatar)
        tvNombreCompleto = findViewById(R.id.tvNombreCompleto)
        tvNombre = findViewById(R.id.tvNombre)
        tvApellidos = findViewById(R.id.tvApellidos)
        tvCorreo = findViewById(R.id.tvCorreo)
        spinnerDepartamento = findViewById<AutoCompleteTextView>(R.id.spinnerDepartamento)
        spinnerCarrera = findViewById<AutoCompleteTextView>(R.id.spinnerCarrera)
        spinnerCurso = findViewById<AutoCompleteTextView>(R.id.spinnerCurso)
        btnGuardar = findViewById(R.id.btnGuardar)
        btnCancelar = findViewById(R.id.btnCancelar)
        cargarOpcionesSpinners()
        btnGuardar.setOnClickListener { guardarCambios() }
        btnCancelar.setOnClickListener { finish() }
    }

    private fun cargarOpcionesSpinners() {
        val prefs = getSharedPreferences("MisPreferencias", 0)
        val token = prefs.getString("token", null) ?: return
        val api = NetworkUtils.getApiService()
        spinnersCargados = 0
        // Departamentos
        api.listarDepartamentos("Bearer $token").enqueue(object : retrofit2.Callback<com.tecsup.model.ApiResponse<List<Departamento>>> {
            override fun onResponse(call: retrofit2.Call<com.tecsup.model.ApiResponse<List<Departamento>>>, response: retrofit2.Response<com.tecsup.model.ApiResponse<List<Departamento>>>) {
                android.util.Log.d("EditProfile", "Departamentos - Código HTTP: ${response.code()}")
                android.util.Log.d("EditProfile", "Departamentos - Body: ${response.body()}")
                android.util.Log.d("EditProfile", "Departamentos - ErrorBody: ${response.errorBody()?.string()}")
                val lista = response.body()?.data ?: emptyList()
                android.util.Log.d("EditProfile", "Departamentos - Lista recibida: $lista")
                departamentos = lista
                if (lista.isEmpty()) Toast.makeText(this@EditProfileActivity, "No hay departamentos disponibles", Toast.LENGTH_LONG).show()
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
                spinnersCargados++
                intentarCargarPerfil()
            }
            override fun onFailure(call: retrofit2.Call<com.tecsup.model.ApiResponse<List<Departamento>>>, t: Throwable) {
                android.util.Log.e("EditProfile", "Departamentos - Error de red: ${t.message}", t)
                Toast.makeText(this@EditProfileActivity, "Error al cargar departamentos: ${t.message}", Toast.LENGTH_LONG).show()
            }
        })
        // Carreras
        api.listarCarreras("Bearer $token").enqueue(object : retrofit2.Callback<com.tecsup.model.ApiResponse<List<Carrera>>> {
            override fun onResponse(call: retrofit2.Call<com.tecsup.model.ApiResponse<List<Carrera>>>, response: retrofit2.Response<com.tecsup.model.ApiResponse<List<Carrera>>>) {
                android.util.Log.d("EditProfile", "Carreras - Código HTTP: ${response.code()}")
                android.util.Log.d("EditProfile", "Carreras - Body: ${response.body()}")
                android.util.Log.d("EditProfile", "Carreras - ErrorBody: ${response.errorBody()?.string()}")
                val lista = response.body()?.data ?: emptyList()
                android.util.Log.d("EditProfile", "Carreras - Lista recibida: $lista")
                carreras = lista
                if (lista.isEmpty()) Toast.makeText(this@EditProfileActivity, "No hay carreras disponibles", Toast.LENGTH_LONG).show()
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
                spinnersCargados++
                intentarCargarPerfil()
            }
            override fun onFailure(call: retrofit2.Call<com.tecsup.model.ApiResponse<List<Carrera>>>, t: Throwable) {
                android.util.Log.e("EditProfile", "Carreras - Error de red: ${t.message}", t)
                Toast.makeText(this@EditProfileActivity, "Error al cargar carreras: ${t.message}", Toast.LENGTH_LONG).show()
            }
        })
        // Cursos
        api.listarCursos("Bearer $token").enqueue(object : retrofit2.Callback<com.tecsup.model.ApiResponse<List<Curso>>> {
            override fun onResponse(call: retrofit2.Call<com.tecsup.model.ApiResponse<List<Curso>>>, response: retrofit2.Response<com.tecsup.model.ApiResponse<List<Curso>>>) {
                android.util.Log.d("EditProfile", "Cursos - Código HTTP: ${response.code()}")
                android.util.Log.d("EditProfile", "Cursos - Body: ${response.body()}")
                android.util.Log.d("EditProfile", "Cursos - ErrorBody: ${response.errorBody()?.string()}")
                val lista = response.body()?.data ?: emptyList()
                android.util.Log.d("EditProfile", "Cursos - Lista recibida: $lista")
                cursos = lista
                if (lista.isEmpty()) Toast.makeText(this@EditProfileActivity, "No hay cursos disponibles", Toast.LENGTH_LONG).show()
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
                spinnersCargados++
                intentarCargarPerfil()
            }
            override fun onFailure(call: retrofit2.Call<com.tecsup.model.ApiResponse<List<Curso>>>, t: Throwable) {
                android.util.Log.e("EditProfile", "Cursos - Error de red: ${t.message}", t)
                Toast.makeText(this@EditProfileActivity, "Error al cargar cursos: ${t.message}", Toast.LENGTH_LONG).show()
            }
        })
    }

    private fun intentarCargarPerfil() {
        if (spinnersCargados == 3) {
            cargarDatosPerfil()
        }
    }

    private fun cargarDatosPerfil() {
        val prefs = getSharedPreferences("MisPreferencias", 0)
        val token = prefs.getString("token", null) ?: return
        val api = NetworkUtils.getApiService()
        api.obtenerPerfil("Bearer $token").enqueue(object : retrofit2.Callback<UserProfile> {
            override fun onResponse(call: retrofit2.Call<UserProfile>, response: retrofit2.Response<UserProfile>) {
                if (response.isSuccessful) {
                    val data = response.body() ?: return
                    tvNombreCompleto.text = "${data.firstName ?: ""} ${data.lastName ?: ""}"
                    tvNombre.text = "Nombre: ${data.firstName ?: ""}"
                    tvApellidos.text = "Apellidos: ${data.lastName ?: ""}"
                    tvCorreo.text = "Correo: ${data.email ?: ""}"
                    if (!data.imagenPerfil.isNullOrBlank()) {
                        Glide.with(this@EditProfileActivity)
                            .load(data.imagenPerfil)
                            .placeholder(R.drawable.default_avatar)
                            .error(R.drawable.default_avatar)
                            .circleCrop()
                            .into(ivAvatar)
                    } else {
                        ivAvatar.setImageResource(R.drawable.default_avatar)
                    }
                    // Seleccionar valores actuales en los spinners si existen
                    data.departamento?.let { dep ->
                        val idx = departamentos.indexOfFirst { it.id == dep.id }
                        if (idx >= 0) spinnerDepartamento.setSelection(idx)
                    }
                    data.carreras?.firstOrNull()?.let { car ->
                        val idx = carreras.indexOfFirst { it.id == car.id }
                        if (idx >= 0) spinnerCarrera.setSelection(idx)
                    }
                    data.cursos?.firstOrNull()?.let { cur ->
                        val idx = cursos.indexOfFirst { it.id == cur.id }
                        if (idx >= 0) spinnerCurso.setSelection(idx)
                    }
                }
            }
            override fun onFailure(call: retrofit2.Call<UserProfile>, t: Throwable) {
                Toast.makeText(this@EditProfileActivity, "Error al cargar perfil: ${t.message}", Toast.LENGTH_LONG).show()
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
        // Obtener el elemento seleccionado por texto
        val depIdx = departamentos.indexOfFirst { it.nombre == spinnerDepartamento.text.toString() }
        val departamento = departamentos.getOrNull(depIdx)
        val carIdx = carreras.indexOfFirst { it.nombre == spinnerCarrera.text.toString() }
        val carrera = carreras.getOrNull(carIdx)
        val curIdx = cursos.indexOfFirst { it.nombre == spinnerCurso.text.toString() }
        val curso = cursos.getOrNull(curIdx)
        val json = org.json.JSONObject()
        json.put("departamentoId", departamento?.id)
        val carreraIds = org.json.JSONArray(listOfNotNull(carrera?.id))
        val cursoIds = org.json.JSONArray(listOfNotNull(curso?.id))
        json.put("carreraIds", carreraIds)
        json.put("cursoIds", cursoIds)
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