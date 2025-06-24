package com.tecsup.back_springboot_srvt.enums;

public enum EstadoReserva {
    PENDIENTE("PENDIENTE"),
    CONFIRMADA("CONFIRMADA"),
    ACTIVA("ACTIVA"),
    CANCELADA("CANCELADA"),
    NO_ASISTIDA("NO_ASISTIDA"),
    FINALIZADA("FINALIZADA"),
    COMPLETADA("COMPLETADA");
    
    private final String valor;
    
    EstadoReserva(String valor) {
        this.valor = valor;
    }
    
    public String getValor() {
        return valor;
    }
    
    @Override
    public String toString() {
        return valor;
    }
    
    /**
     * Convierte un string a EstadoReserva
     */
    public static EstadoReserva fromString(String estado) {
        for (EstadoReserva e : EstadoReserva.values()) {
            if (e.valor.equalsIgnoreCase(estado)) {
                return e;
            }
        }
        throw new IllegalArgumentException("Estado de reserva no válido: " + estado);
    }
    
    /**
     * Verifica si un estado es válido
     */
    public static boolean esValido(String estado) {
        try {
            fromString(estado);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
    
    /**
     * Verifica si el estado permite cancelación
     */
    public boolean permiteCancelacion() {
        return this == PENDIENTE || this == CONFIRMADA || this == ACTIVA;
    }
    
    /**
     * Verifica si el estado es final (no puede cambiar)
     */
    public boolean esFinal() {
        return this == CANCELADA || this == NO_ASISTIDA || this == FINALIZADA;
    }
    
    public enum TipoBloqueo {
        FERIADO("FERIADO"),
        MANTENIMIENTO("MANTENIMIENTO"),
        EVENTO_INSTITUCIONAL("EVENTO_INSTITUCIONAL"),
        EXAMEN_FINAL("EXAMEN_FINAL"),
        CAPACITACION("CAPACITACION"),
        SUSPENSION_ACTIVIDADES("SUSPENSION_ACTIVIDADES");
        
        private final String valor;
        
        TipoBloqueo(String valor) {
            this.valor = valor;
        }
        
        public String getValor() {
            return valor;
        }
        
        @Override
        public String toString() {
            return valor;
        }
        
        public static TipoBloqueo fromString(String tipo) {
            for (TipoBloqueo t : TipoBloqueo.values()) {
                if (t.valor.equalsIgnoreCase(tipo)) {
                    return t;
                }
            }
            throw new IllegalArgumentException("Tipo de bloqueo no válido: " + tipo);
        }
        
        public static boolean esValido(String tipo) {
            try {
                fromString(tipo);
                return true;
            } catch (IllegalArgumentException e) {
                return false;
            }
        }
    }
}
