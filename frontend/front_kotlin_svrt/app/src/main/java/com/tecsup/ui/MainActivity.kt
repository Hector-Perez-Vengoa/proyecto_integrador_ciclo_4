package com.tecsup.ui

import android.os.Bundle
import android.util.Log
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.tecsup.R
import com.tecsup.adapter.AulaVirtualAdapter
import com.tecsup.api.ApiService
import com.tecsup.model.AulaVirtual
import com.tecsup.model.ApiResponse
import com.tecsup.utils.DateUtils
import okhttp3.OkHttpClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class MainActivity : AppCompatActivity() {

    private lateinit var tvUserName: TextView
    private lateinit var tvUserAvatar: ImageView
    private lateinit var ivNotifications: ImageView
    private lateinit var tvFechaActual: TextView
    private lateinit var rvAulas: RecyclerView
    private lateinit var bottomNavigationView: BottomNavigationView

    private lateinit var aulaAdapter: AulaVirtualAdapter
    private val aulaList = mutableListOf<AulaVirtual>()

    private var userName: String = ""
    private var userEmail: String = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        userName = intent.getStringExtra("user_name") ?: "Usuario"
        userEmail = intent.getStringExtra("user_email") ?: ""

        initViews()
        setupRecyclerView()
        setupBottomNavigation()
        setupClickListeners()
        loadAulasVirtuales()
        setCurrentDate()
    }

    private fun initViews() {
        tvUserName = findViewById(R.id.tvUserName)
        tvUserAvatar = findViewById(R.id.tvUserAvatar)
        ivNotifications = findViewById(R.id.ivNotifications)
        tvFechaActual = findViewById(R.id.tvFechaActual)
        rvAulas = findViewById(R.id.rvClases)
        bottomNavigationView = findViewById(R.id.bottomNavigationView)

        tvUserName.text = "Hola $userName"
    }

    private fun setupRecyclerView() {
        aulaAdapter = AulaVirtualAdapter(aulaList)
        rvAulas.apply {
            layoutManager = LinearLayoutManager(this@MainActivity)
            adapter = aulaAdapter
        }
    }

    private fun setupBottomNavigation() {
        bottomNavigationView.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_inicio -> true
                R.id.nav_reservas -> {
                    Toast.makeText(this, "Ir a reservas", Toast.LENGTH_SHORT).show()
                    true
                }
                R.id.nav_perfil -> {
                    Toast.makeText(this, "Ir al perfil", Toast.LENGTH_SHORT).show()
                    true
                }
                else -> false
            }
        }
    }

    private fun setupClickListeners() {
        ivNotifications.setOnClickListener {
            Toast.makeText(this, "Notificaciones próximamente", Toast.LENGTH_SHORT).show()
        }
        tvUserAvatar.setOnClickListener {
            Toast.makeText(this, "Perfil de usuario", Toast.LENGTH_SHORT).show()
        }
    }

    private fun setCurrentDate() {
        val currentDate = DateUtils.getCurrentDateFormatted()
        tvFechaActual.text = currentDate
    }

    private fun loadAulasVirtuales() {
        val prefs = getSharedPreferences("MisPreferencias", MODE_PRIVATE)
        val token = prefs.getString("token", null)

        if (token.isNullOrBlank()) {
            Toast.makeText(this, "Token no encontrado. Inicia sesión primero.", Toast.LENGTH_LONG).show()
            Log.e("MainActivity", "Token no encontrado en SharedPreferences")
            return
        }

        val retrofit = Retrofit.Builder()
            .baseUrl("http://10.0.2.2:8080/")
            .addConverterFactory(GsonConverterFactory.create())
            .client(OkHttpClient.Builder().build())
            .build()

        val api = retrofit.create(ApiService::class.java)

        api.listarAulas("Bearer $token").enqueue(object : Callback<ApiResponse<List<AulaVirtual>>> {
            override fun onResponse(
                call: Call<ApiResponse<List<AulaVirtual>>>,
                response: Response<ApiResponse<List<AulaVirtual>>>
            ) {
                if (response.isSuccessful && response.body() != null) {
                    val aulas = response.body()!!.data
                    Log.d("MainActivity", "Respuesta recibida: ${aulas.size} aulas")

                    aulaList.clear()
                    aulaList.addAll(aulas)
                    aulaAdapter.notifyDataSetChanged()
                    Toast.makeText(this@MainActivity, "Aulas cargadas: ${aulas.size}", Toast.LENGTH_SHORT).show()
                } else {
                    Log.e("MainActivity", "Respuesta fallida: ${response.code()} - ${response.message()}")
                    Toast.makeText(this@MainActivity, "Error: ${response.message()}", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<ApiResponse<List<AulaVirtual>>>, t: Throwable) {
                Toast.makeText(this@MainActivity, "Fallo de red: ${t.message}", Toast.LENGTH_LONG).show()
                Log.e("MainActivity", "Error cargando aulas", t)
            }
        })
    }
}
