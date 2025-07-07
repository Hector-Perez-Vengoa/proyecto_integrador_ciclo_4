package com.tecsup.ui

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.ImageView
import android.widget.ProgressBar
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
import com.tecsup.model.AulaItem
import com.tecsup.utils.NetworkUtils
import okhttp3.OkHttpClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.net.SocketTimeoutException
import java.net.UnknownHostException
import java.util.concurrent.TimeUnit
import androidx.fragment.app.Fragment

class MainActivity : AppCompatActivity() {

    private lateinit var tvUserName: TextView
    private lateinit var tvUserAvatar: ImageView
    private lateinit var ivNotifications: ImageView
    private lateinit var tvFechaActual: TextView
    private lateinit var rvAulas: RecyclerView
    private lateinit var bottomNavigationView: BottomNavigationView
    private lateinit var progressBar: ProgressBar

    private lateinit var aulaAdapter: AulaVirtualAdapter
    private val aulaList = mutableListOf<AulaItem>()

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
    }

    private fun initViews() {
        tvUserName = findViewById(R.id.tvUserName)
        tvUserAvatar = findViewById(R.id.tvUserAvatar)
        ivNotifications = findViewById(R.id.ivNotifications)
        rvAulas = findViewById(R.id.rvClases)
        bottomNavigationView = findViewById(R.id.bottomNavigationView)
        progressBar = findViewById(R.id.progressBar)

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
                R.id.nav_inicio -> {
                    // Si hay un fragmento en pantalla, quitarlo y mostrar la lista de aulas
                    val fragment = supportFragmentManager.findFragmentById(R.id.mainLayout)
                    if (fragment is ProfileFragment) {
                        supportFragmentManager.popBackStack()
                    }
                    loadAulasVirtuales()
                    true
                }
                R.id.nav_reservas -> {
                    // Si hay un fragmento en pantalla, quitarlo y mostrar la lista de aulas
                    val fragment = supportFragmentManager.findFragmentById(R.id.mainLayout)
                    if (fragment is ProfileFragment) {
                        supportFragmentManager.popBackStack()
                    }
                    Toast.makeText(this, "Ir a reservas", Toast.LENGTH_SHORT).show()
                    true
                }
                R.id.nav_perfil -> {
                    // Navegar al fragmento de perfil solo si no está ya visible
                    val fragment = supportFragmentManager.findFragmentById(R.id.mainLayout)
                    if (fragment !is ProfileFragment) {
                        supportFragmentManager.beginTransaction()
                            .replace(R.id.mainLayout, ProfileFragment())
                            .addToBackStack(null)
                            .commit()
                    }
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
            // Navegar al fragmento de perfil solo si no está ya visible
            val fragment = supportFragmentManager.findFragmentById(R.id.mainLayout)
            if (fragment !is ProfileFragment) {
                supportFragmentManager.beginTransaction()
                    .replace(R.id.mainLayout, ProfileFragment())
                    .addToBackStack(null)
                    .commit()
            }
        }
    }

    private fun showLoading(show: Boolean) {
        progressBar.visibility = if (show) View.VISIBLE else View.GONE
        rvAulas.visibility = if (show) View.GONE else View.VISIBLE
    }

    private fun loadAulasVirtuales() {
        if (!NetworkUtils.isNetworkAvailable(this)) {
            Toast.makeText(this, "Sin conexión a internet", Toast.LENGTH_SHORT).show()
            return
        }

        val prefs = getSharedPreferences("MisPreferencias", MODE_PRIVATE)
        val token = prefs.getString("token", null)

        if (token.isNullOrBlank()) {
            Toast.makeText(this, "Token no encontrado. Inicia sesión primero.", Toast.LENGTH_LONG).show()
            Log.e("MainActivity", "Token no encontrado en SharedPreferences")
            return
        }

        showLoading(true)

        val retrofit = Retrofit.Builder()
            .baseUrl("http://192.168.1.208:8080/")
            .addConverterFactory(GsonConverterFactory.create())
            .client(NetworkUtils.createOkHttpClient())
            .build()

        val api = retrofit.create(ApiService::class.java)

        api.listarAulas("Bearer $token").enqueue(object : Callback<ApiResponse<List<AulaVirtual>>> {
            override fun onResponse(
                call: Call<ApiResponse<List<AulaVirtual>>>,
                response: Response<ApiResponse<List<AulaVirtual>>>
            ) {
                showLoading(false)
                
                if (response.isSuccessful && response.body() != null) {
                    val aulas = response.body()!!.data
                    Log.d("MainActivity", "Respuesta recibida: ${aulas.size} aulas")

                    val agrupadas = agruparPorEstado(aulas)
                    aulaList.clear()
                    aulaList.addAll(agrupadas)
                    aulaAdapter.notifyDataSetChanged()

                    if (aulas.isEmpty()) {
                        Toast.makeText(this@MainActivity, "No hay aulas disponibles", Toast.LENGTH_SHORT).show()
                    } else {
                        Toast.makeText(this@MainActivity, "Aulas cargadas: ${aulas.size}", Toast.LENGTH_SHORT).show()
                    }
                } else {
                    Log.e("MainActivity", "Respuesta fallida: ${response.code()} - ${response.message()}")
                    val errorMessage = NetworkUtils.getHttpErrorMessage(response.code())
                    Toast.makeText(this@MainActivity, errorMessage, Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<ApiResponse<List<AulaVirtual>>>, t: Throwable) {
                showLoading(false)
                val errorMessage = NetworkUtils.getErrorMessage(t)
                Toast.makeText(this@MainActivity, errorMessage, Toast.LENGTH_LONG).show()
                Log.e("MainActivity", "Error cargando aulas", t)
            }
        })
    }

    private fun agruparPorEstado(aulas: List<AulaVirtual>): List<AulaItem> {
        return aulas
            .groupBy { it.estado }
            .flatMap { (estado, aulasPorEstado) ->
                listOf(AulaItem.Header(estado)) + aulasPorEstado.map { AulaItem.Aula(it) }
            }
    }

    override fun onResume() {
        super.onResume()
        // Recargar datos cuando la actividad vuelve a estar visible
        if (aulaList.isEmpty()) {
            loadAulasVirtuales()
        }
    }
}
