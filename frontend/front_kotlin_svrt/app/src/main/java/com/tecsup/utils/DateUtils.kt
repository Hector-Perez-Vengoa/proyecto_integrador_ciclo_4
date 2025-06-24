package com.tecsup.utils

import java.text.SimpleDateFormat
import java.util.*

object DateUtils {

    fun getCurrentDateFormatted(): String {
        val calendar = Calendar.getInstance()
        val dayOfWeek = getDayOfWeekInSpanish(calendar.get(Calendar.DAY_OF_WEEK))
        val day = calendar.get(Calendar.DAY_OF_MONTH)
        val month = getMonthInSpanish(calendar.get(Calendar.MONTH))

        return "$dayOfWeek $day $month"
    }

    private fun getDayOfWeekInSpanish(dayOfWeek: Int): String {
        return when (dayOfWeek) {
            Calendar.SUNDAY -> "Domingo"
            Calendar.MONDAY -> "Lunes"
            Calendar.TUESDAY -> "Martes"
            Calendar.WEDNESDAY -> "Miércoles"
            Calendar.THURSDAY -> "Jueves"
            Calendar.FRIDAY -> "Viernes"
            Calendar.SATURDAY -> "Sábado"
            else -> ""
        }
    }

    private fun getMonthInSpanish(month: Int): String {
        return when (month) {
            Calendar.JANUARY -> "Enero"
            Calendar.FEBRUARY -> "Febrero"
            Calendar.MARCH -> "Marzo"
            Calendar.APRIL -> "Abril"
            Calendar.MAY -> "Mayo"
            Calendar.JUNE -> "Junio"
            Calendar.JULY -> "Julio"
            Calendar.AUGUST -> "Agosto"
            Calendar.SEPTEMBER -> "Septiembre"
            Calendar.OCTOBER -> "Octubre"
            Calendar.NOVEMBER -> "Noviembre"
            Calendar.DECEMBER -> "Diciembre"
            else -> ""
        }
    }

    fun getCurrentTime(): String {
        val sdf = SimpleDateFormat("HH:mm", Locale.getDefault())
        return sdf.format(Date())
    }

    fun formatTime(hour: Int, minute: Int): String {
        return String.format("%02d:%02d", hour, minute)
    }
}