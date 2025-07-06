package com.tecsup.model

sealed class AulaItem {
    data class Header(val estado: String) : AulaItem()
    data class Aula(val aula: AulaVirtual) : AulaItem()
}