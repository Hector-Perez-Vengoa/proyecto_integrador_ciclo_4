package com.tecsup.ui

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.bumptech.glide.Glide
import com.tecsup.R
import com.tecsup.utils.NetworkUtils
import okhttp3.*
import org.json.JSONObject
import java.io.IOException
import android.util.Log
import android.graphics.drawable.GradientDrawable
import com.google.android.flexbox.FlexboxLayout

class ProfileFragment : Fragment() {
    private lateinit var ivAvatar: ImageView
    private lateinit var tvNombreCompleto: TextView
    private lateinit var tvNombre: TextView
    private lateinit var tvApellidos: TextView
    private lateinit var tvCorreo: TextView
    private lateinit var tvDepartamento: TextView
    private lateinit var layoutCarreras: FlexboxLayout
    private lateinit var layoutCursos: FlexboxLayout

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.activity_profile, container, false)
        ivAvatar = view.findViewById(R.id.ivAvatar)
        tvNombreCompleto = view.findViewById(R.id.tvNombreCompleto)
        tvNombre = view.findViewById(R.id.tvNombre)
        tvApellidos = view.findViewById(R.id.tvApellidos)
        tvCorreo = view.findViewById(R.id.tvCorreo)
        tvDepartamento = view.findViewById(R.id.tvDepartamento)
        layoutCarreras = view.findViewById(R.id.layoutCarreras)
        layoutCursos = view.findViewById(R.id.layoutCursos)
        cargarPerfil()
        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val toolbar = requireActivity().findViewById<androidx.appcompat.widget.Toolbar>(R.id.profileToolbar)
        toolbar?.title = "TECSUP"
        val btnEditarPerfil = view.findViewById<com.google.android.material.button.MaterialButton>(R.id.btnEditarPerfil)
        btnEditarPerfil.setOnClickListener {
            val intent = android.content.Intent(requireContext(), EditProfileActivity::class.java)
            startActivity(intent)
        }
    }

    private fun cargarPerfil() {
        val prefs = requireContext().getSharedPreferences("MisPreferencias", 0)
        val token = prefs.getString("token", null)
        if (token.isNullOrBlank()) {
            Toast.makeText(requireContext(), "Token no encontrado. Inicia sesión primero.", Toast.LENGTH_LONG).show()
            Log.e("ProfileFragment", "Token no encontrado en SharedPreferences")
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
                requireActivity().runOnUiThread {
                    Toast.makeText(requireContext(), "Error de red: ${e.message}", Toast.LENGTH_LONG).show()
                    Log.e("ProfileFragment", "Error de red: ${e.message}")
                }
            }
            override fun onResponse(call: Call, response: Response) {
                val body = response.body?.string()
                requireActivity().runOnUiThread {
                    if (body.isNullOrBlank()) {
                        Toast.makeText(requireContext(), "Respuesta vacía del servidor", Toast.LENGTH_LONG).show()
                        Log.e("ProfileFragment", "Respuesta vacía del servidor")
                        return@runOnUiThread
                    }
                    Log.d("ProfileFragment", "Respuesta JSON: $body")
                    if (response.isSuccessful) {
                        try {
                            val json = JSONObject(body)
                            val data = json.optJSONObject("data") ?: json
                            val firstName = data.optString("firstName", "")
                            val lastName = data.optString("lastName", "")
                            val email = data.optString("email", "")
                            val departamentoObj = data.optJSONObject("departamento")
                            val departamentoNombre = departamentoObj?.optString("nombre", "") ?: ""
                            val nombreCompleto = "$firstName $lastName".trim()
                            tvNombreCompleto.text = nombreCompleto
                            tvNombre.text = "Nombre: $firstName"
                            tvApellidos.text = "Apellidos: $lastName"
                            tvCorreo.text = "Correo: $email"
                            tvDepartamento.text = "Departamento: ${departamentoNombre}"
                            val imagenPerfil = data.optString("imagenPerfil", null)
                            if (!imagenPerfil.isNullOrBlank()) {
                                Glide.with(this@ProfileFragment)
                                    .load(imagenPerfil)
                                    .placeholder(R.drawable.default_avatar)
                                    .error(R.drawable.default_avatar)
                                    .circleCrop()
                                    .into(ivAvatar)
                            } else {
                                ivAvatar.setImageResource(R.drawable.default_avatar)
                            }
                            if (firstName.isBlank() || lastName.isBlank() || email.isBlank()) {
                                Toast.makeText(requireContext(), "Algunos campos están vacíos. Revisa el JSON en Logcat.", Toast.LENGTH_LONG).show()
                                Log.w("ProfileFragment", "Campos vacíos: firstName='$firstName', lastName='$lastName', email='$email'")
                            }
                            val carrerasArray = data.optJSONArray("carreras")
                            val cursosArray = data.optJSONArray("cursos")
                            // Parsear carreras
                            val carrerasList = mutableListOf<String>()
                            if (carrerasArray != null) {
                                for (i in 0 until carrerasArray.length()) {
                                    val carrera = carrerasArray.getJSONObject(i)
                                    val nombre = carrera.optString("nombre", "")
                                    if (nombre.isNotBlank()) carrerasList.add(nombre)
                                }
                            }
                            // Parsear cursos
                            val cursosList = mutableListOf<String>()
                            if (cursosArray != null) {
                                for (i in 0 until cursosArray.length()) {
                                    val curso = cursosArray.getJSONObject(i)
                                    val nombre = curso.optString("nombre", "")
                                    if (nombre.isNotBlank()) cursosList.add(nombre)
                                }
                            }
                            Log.d("ProfileFragment", "Cursos parseados: $cursosList")
                            // Chips para carreras
                            layoutCarreras.removeAllViews()
                            for (nombre in carrerasList) {
                                val chip = TextView(requireContext())
                                chip.text = nombre
                                chip.setPadding(32, 12, 32, 12)
                                chip.setTextColor(0xFF1976D2.toInt())
                                chip.textSize = 15f
                                val bg = GradientDrawable()
                                bg.cornerRadius = 40f
                                bg.setColor(0xFFE3F2FD.toInt())
                                chip.background = bg
                                val params = FlexboxLayout.LayoutParams(FlexboxLayout.LayoutParams.WRAP_CONTENT, FlexboxLayout.LayoutParams.WRAP_CONTENT)
                                params.setMargins(0, 0, 16, 0)
                                chip.layoutParams = params
                                layoutCarreras.addView(chip)
                            }
                            // Chips para cursos
                            layoutCursos.removeAllViews()
                            for (nombre in cursosList) {
                                val chip = TextView(requireContext())
                                chip.text = nombre
                                chip.setPadding(32, 12, 32, 12)
                                chip.setTextColor(0xFF388E3C.toInt())
                                chip.textSize = 15f
                                val bg = GradientDrawable()
                                bg.cornerRadius = 40f
                                bg.setColor(0xFFC8E6C9.toInt())
                                chip.background = bg
                                val params = FlexboxLayout.LayoutParams(FlexboxLayout.LayoutParams.WRAP_CONTENT, FlexboxLayout.LayoutParams.WRAP_CONTENT)
                                params.setMargins(0, 0, 16, 0)
                                chip.layoutParams = params
                                layoutCursos.addView(chip)
                            }
                        } catch (e: Exception) {
                            Toast.makeText(requireContext(), "Error procesando datos de perfil", Toast.LENGTH_LONG).show()
                            Toast.makeText(requireContext(), body, Toast.LENGTH_LONG).show()
                            Log.e("ProfileFragment", "Error procesando datos de perfil", e)
                            Log.e("ProfileFragment", "JSON recibido: $body")
                        }
                    } else {
                        Toast.makeText(requireContext(), "Error al obtener perfil", Toast.LENGTH_LONG).show()
                        Log.e("ProfileFragment", "Error HTTP: ${response.code} - ${response.message}")
                        Log.e("ProfileFragment", "Respuesta: $body")
                    }
                }
            }
        })
    }
} 