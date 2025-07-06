package com.tecsup.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import com.tecsup.R
import com.tecsup.model.AulaItem
import com.tecsup.model.AulaVirtual

class AulaVirtualAdapter(private val items: List<AulaItem>) :
    RecyclerView.Adapter<RecyclerView.ViewHolder>() {

    companion object {
        private const val TYPE_HEADER = 0
        private const val TYPE_AULA = 1
    }

    override fun getItemViewType(position: Int): Int {
        // Solo mostrar aulas, ignorar headers
        return TYPE_AULA
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        // Solo inflar el layout de aula
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_aula_virtual, parent, false)
        return AulaViewHolder(view)
    }

    override fun getItemCount(): Int = items.count { it is AulaItem.Aula }

    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        // Solo hacer bind de aulas, ignorar headers
        val aulaItems = items.filterIsInstance<AulaItem.Aula>()
        (holder as AulaViewHolder).bind(aulaItems[position].aula)
    }

    class HeaderViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        private val tvEstadoHeader: TextView = view.findViewById(R.id.tvEstadoHeader)
        fun bind(header: AulaItem.Header) {
            tvEstadoHeader.text = header.estado.uppercase()
        }
    }

    class AulaViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        private val tvCodigo: TextView = view.findViewById(R.id.tvCodigo)
        private val tvDescripcion: TextView = view.findViewById(R.id.tvDescripcion)
        private val ivEstadoIcon: ImageView = view.findViewById(R.id.ivEstadoIcon)
        private val ivAulaIcon: ImageView = view.findViewById(R.id.ivAulaIcon)

        fun bind(aula: AulaVirtual) {
            tvCodigo.text = aula.codigo
            tvDescripcion.text = aula.descripcion ?: "Sin descripción"
            // Icono de aula siempre igual (nuevo icono de Material Icons)
            ivAulaIcon.setImageResource(R.drawable.co_present_24px)
            // Icono de estado según el estado del aula
            ivEstadoIcon.setImageResource(getEstadoIcon(aula.estado))
            ivEstadoIcon.setColorFilter(getEstadoColor(aula.estado, itemView.context))
        }

        private fun getEstadoIcon(estado: String): Int {
            return when (estado.lowercase()) {
                "disponible", "available" -> R.drawable.meeting_room_24px
                "ocupado", "en uso", "occupied", "bloqueada", "bloqueado" -> R.drawable.no_meeting_room_24px
                "reservada", "reserved", "reservado" -> R.drawable.no_meeting_room_24px
                "en_mantenimiento", "maintenance", "mantenimiento" -> R.drawable.build_24px
                else -> R.drawable.co_present_24px // Por defecto, icono de aula
            }
        }

        private fun getEstadoColor(estado: String, context: android.content.Context): Int {
            return when (estado.lowercase()) {
                "disponible", "available" -> ContextCompat.getColor(context, R.color.estado_disponible)
                "en_mantenimiento", "maintenance", "mantenimiento" -> ContextCompat.getColor(context, R.color.estado_mantenimiento)
                "ocupado", "en uso", "occupied", "bloqueada", "bloqueado" -> ContextCompat.getColor(context, R.color.estado_no_disponible)
                "reservada", "reserved", "reservado" -> ContextCompat.getColor(context, R.color.estado_no_disponible)
                else -> ContextCompat.getColor(context, R.color.estado_no_disponible)
            }
        }
    }
}
