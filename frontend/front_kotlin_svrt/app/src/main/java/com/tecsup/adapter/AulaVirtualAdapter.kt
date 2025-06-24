package com.tecsup.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.cardview.widget.CardView
import androidx.recyclerview.widget.RecyclerView
import com.tecsup.R
import com.tecsup.model.AulaVirtual

class AulaVirtualAdapter(
    private val aulas: List<AulaVirtual>
) : RecyclerView.Adapter<AulaVirtualAdapter.AulaViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): AulaViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_aula_virtual, parent, false)
        return AulaViewHolder(view)
    }

    override fun onBindViewHolder(holder: AulaViewHolder, position: Int) {
        val aula = aulas[position]
        holder.bind(aula)
    }

    override fun getItemCount(): Int = aulas.size

    class AulaViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val card: CardView = itemView.findViewById(R.id.cardAula)
        private val tvCodigo: TextView = itemView.findViewById(R.id.tvCodigo)
        private val tvDescripcion: TextView = itemView.findViewById(R.id.tvDescripcion)
        private val tvEstado: TextView = itemView.findViewById(R.id.tvEstado)

        fun bind(aula: AulaVirtual) {
            tvCodigo.text = "Código: ${aula.codigo}"
            tvDescripcion.text = "Descripción: ${aula.descripcion ?: "Sin descripción"}"
            tvEstado.text = "Estado: ${aula.estado}"
        }
    }
}
