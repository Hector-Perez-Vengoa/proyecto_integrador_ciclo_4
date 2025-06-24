package com.tecsup.back_springboot_srvt.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Component
@ConfigurationProperties(prefix = "reservas.bloques")
public class BloquesConfig {
    
    /**
     * Duración de cada bloque en minutos (45 por defecto - típico universitario)
     */
    private int duracionMinutos = 45;
    
    /**
     * Intervalo entre bloques en minutos (15 por defecto - descanso)
     */
    private int intervalominutos = 15;
    
    /**
     * Hora de inicio de actividades académicas
     */
    private String horaInicio = "07:00";
    
    /**
     * Hora de fin de actividades académicas
     */
    private String horaFin = "22:00";
    
    /**
     * Si se permite reservar bloques parciales
     */
    private boolean permitirBloqueParcial = false;
    
    // Getters y Setters
    public int getDuracionMinutos() {
        return duracionMinutos;
    }
    
    public void setDuracionMinutos(int duracionMinutos) {
        this.duracionMinutos = duracionMinutos;
    }
    
    public int getIntervalominutos() {
        return intervalominutos;
    }
    
    public void setIntervalominutos(int intervalominutos) {
        this.intervalominutos = intervalominutos;
    }
    
    public String getHoraInicio() {
        return horaInicio;
    }
    
    public void setHoraInicio(String horaInicio) {
        this.horaInicio = horaInicio;
    }
    
    public String getHoraFin() {
        return horaFin;
    }
    
    public void setHoraFin(String horaFin) {
        this.horaFin = horaFin;
    }
    
    public boolean isPermitirBloqueParcial() {
        return permitirBloqueParcial;
    }
    
    public void setPermitirBloqueParcial(boolean permitirBloqueParcial) {
        this.permitirBloqueParcial = permitirBloqueParcial;
    }
    
    /**
     * Obtiene la duración total de un bloque incluyendo el intervalo
     */
    public int getDuracionTotalMinutos() {
        return duracionMinutos + intervalominutos;
    }
    
    /**
     * Genera todos los bloques de tiempo disponibles en un día
     */
    public List<BloqueHorario> generarBloquesDisponibles() {
        List<BloqueHorario> bloques = new ArrayList<>();
        LocalTime inicio = LocalTime.parse(horaInicio);
        LocalTime fin = LocalTime.parse(horaFin);
        
        LocalTime horaActual = inicio;
        int numeroBloque = 1;
        
        while (horaActual.plusMinutes(duracionMinutos).isBefore(fin) || 
               horaActual.plusMinutes(duracionMinutos).equals(fin)) {
            
            LocalTime finBloque = horaActual.plusMinutes(duracionMinutos);
            bloques.add(new BloqueHorario(numeroBloque, horaActual, finBloque));
            
            horaActual = horaActual.plusMinutes(getDuracionTotalMinutos());
            numeroBloque++;
        }
        
        return bloques;
    }
      /**
     * Clase interna para representar un bloque horario
     */
    public static class BloqueHorario {
        private int numero;
        private LocalTime inicio;
        private LocalTime fin;
        private String descripcion;
        
        public BloqueHorario(int numero, LocalTime inicio, LocalTime fin) {
            this.numero = numero;
            this.inicio = inicio;
            this.fin = fin;
            this.descripcion = String.format("Bloque %d: %s - %s", numero, inicio, fin);
        }
        
        public BloqueHorario(int numero, LocalTime inicio, LocalTime fin, String descripcion) {
            this.numero = numero;
            this.inicio = inicio;
            this.fin = fin;
            this.descripcion = descripcion;
        }
        
        // Getters
        public int getNumero() { return numero; }
        public LocalTime getInicio() { return inicio; }
        public LocalTime getFin() { return fin; }
        public String getDescripcion() { return descripcion; }
        
        @Override
        public String toString() {
            return String.format("Bloque %d: %s - %s", numero, inicio, fin);
        }
    }
}
