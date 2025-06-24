package com.tecsup.back_springboot_srvt.controller;

import com.tecsup.back_springboot_srvt.dto.ApiResponseDTO;
import com.tecsup.back_springboot_srvt.model.CalendarioInstitucional;
import com.tecsup.back_springboot_srvt.repository.CalendarioInstitucionalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/calendario")
@CrossOrigin(origins = "*")
public class CalendarioController {    @Autowired
    private CalendarioInstitucionalRepository calendarioRepository;

    /**
     * Obtener fechas bloqueadas para el calendario
     */
    @GetMapping("/fechas-bloqueadas")
    public ResponseEntity<ApiResponseDTO<List<Map<String, Object>>>> obtenerFechasBloqueadas() {
        try {
            // Obtener fecha actual en zona horaria de Lima
            ZoneId limaZone = ZoneId.of("America/Lima");
            LocalDate fechaActual = ZonedDateTime.now(limaZone).toLocalDate();
            
            // Obtener fechas bloqueadas desde la fecha actual hacia adelante (próximo año)
            LocalDate fechaLimite = fechaActual.plusYears(1);
            
            List<CalendarioInstitucional> bloqueosActivos = calendarioRepository
                .findByFechaBloqueoBetween(fechaActual, fechaLimite);            List<Map<String, Object>> fechasBloqueadas = bloqueosActivos.stream()
                .map(bloqueo -> {
                    Map<String, Object> fechaInfo = new HashMap<>();
                    fechaInfo.put("fechaInicio", bloqueo.getFechaInicio().toString());
                    fechaInfo.put("fechaFin", bloqueo.getFechaFin().toString());
                    fechaInfo.put("descripcion", bloqueo.getDescripcion());
                    fechaInfo.put("tipoBloqueo", bloqueo.getTipoBloqueo());
                    fechaInfo.put("esGlobal", bloqueo.getAulaVirtual() == null);
                    if (bloqueo.getAulaVirtual() != null) {
                        fechaInfo.put("aulaAfectada", bloqueo.getAulaVirtual().getCodigo());
                    }
                    return fechaInfo;
                })
                .collect(Collectors.toList());

            ApiResponseDTO<List<Map<String, Object>>> response = ApiResponseDTO.success(
                "Fechas bloqueadas obtenidas exitosamente", 
                fechasBloqueadas
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            ApiResponseDTO<List<Map<String, Object>>> response = ApiResponseDTO.error(
                "Error al obtener fechas bloqueadas: " + e.getMessage()
            );
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Verificar si una fecha específica está bloqueada
     */
    @GetMapping("/verificar-fecha/{fecha}")
    public ResponseEntity<ApiResponseDTO<Map<String, Object>>> verificarFecha(
            @PathVariable String fecha,
            @RequestParam(required = false) Long aulaId) {
        
        try {
            LocalDate fechaConsulta = LocalDate.parse(fecha);
            
            // Buscar bloqueos para esta fecha
            List<CalendarioInstitucional> bloqueos;
            if (aulaId != null) {
                // Buscar bloqueos específicos del aula y globales
                bloqueos = calendarioRepository.findBloqueosParaFechaYAula(fechaConsulta, aulaId);
            } else {
                // Buscar solo bloqueos globales
                bloqueos = calendarioRepository.findBloqueosGlobales(fechaConsulta);
            }
            
            Map<String, Object> resultado = new HashMap<>();
            resultado.put("fechaBloqueada", !bloqueos.isEmpty());
            resultado.put("fecha", fecha);
            
            if (!bloqueos.isEmpty()) {
                CalendarioInstitucional primerBloqueo = bloqueos.get(0);
                resultado.put("motivo", primerBloqueo.getDescripcion());
                resultado.put("tipoBloqueo", primerBloqueo.getTipoBloqueo());
                resultado.put("esGlobal", primerBloqueo.getAulaVirtual() == null);
            }
            
            ApiResponseDTO<Map<String, Object>> response = ApiResponseDTO.success(
                "Verificación de fecha completada", 
                resultado
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            ApiResponseDTO<Map<String, Object>> response = ApiResponseDTO.error(
                "Error al verificar la fecha: " + e.getMessage()
            );
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Obtener información sobre el horario de funcionamiento
     */
    @GetMapping("/horario-funcionamiento")
    public ResponseEntity<ApiResponseDTO<Map<String, Object>>> obtenerHorarioFuncionamiento() {
        try {
            Map<String, Object> horario = new HashMap<>();
            horario.put("horaApertura", "08:00");
            horario.put("horaCierre", "22:00");
            horario.put("diasPermitidos", List.of("LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"));
            horario.put("duracionMinima", 45);
            horario.put("duracionMaxima", 240);
            horario.put("incrementosPermitidos", List.of(45, 60, 120, 180, 240));
            horario.put("zonaHoraria", "America/Lima");
            
            ApiResponseDTO<Map<String, Object>> response = ApiResponseDTO.success(
                "Horario de funcionamiento obtenido exitosamente", 
                horario
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            ApiResponseDTO<Map<String, Object>> response = ApiResponseDTO.error(
                "Error al obtener horario de funcionamiento: " + e.getMessage()
            );
            return ResponseEntity.status(500).body(response);
        }
    }

   
}
