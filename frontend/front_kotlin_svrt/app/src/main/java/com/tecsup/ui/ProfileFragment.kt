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

class ProfileFragment : Fragment() {
    private lateinit var ivAvatar: ImageView
    private lateinit var tvNombreCompleto: TextView
    private lateinit var tvNombre: TextView
    private lateinit var tvApellidos: TextView
    private lateinit var tvCorreo: TextView
    private lateinit var tvDepartamento: TextView

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
        cargarPerfil()
        return view
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
            .url("http://10.0.2.2:8080/api/perfil")
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
                            val departamento = "" // No existe en el JSON, dejar vacío
                            val nombreCompleto = "$firstName $lastName".trim()
                            tvNombreCompleto.text = nombreCompleto
                            tvNombre.text = "Nombre: $firstName"
                            tvApellidos.text = "Apellidos: $lastName"
                            tvCorreo.text = "Correo: $email"
                            tvDepartamento.text = "Departamento: $departamento"
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