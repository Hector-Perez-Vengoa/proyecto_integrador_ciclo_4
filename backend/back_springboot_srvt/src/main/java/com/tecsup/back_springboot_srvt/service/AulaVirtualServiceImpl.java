package com.tecsup.back_springboot_srvt.service;

import com.tecsup.back_springboot_srvt.model.AulaVirtual;
import com.tecsup.back_springboot_srvt.dto.*;
import com.tecsup.back_springboot_srvt.repository.AulaVirtualRepository;
import com.tecsup.back_springboot_srvt.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AulaVirtualServiceImpl implements AulaVirtualService {

    private final AulaVirtualRepository aulaVirtualRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    public AulaVirtualServiceImpl(AulaVirtualRepository aulaVirtualRepository) {
        this.aulaVirtualRepository = aulaVirtualRepository;
    }

    @Override
    public List<AulaVirtual> listar() {
        // LÓGICA DE NEGOCIO: Ordenar todas las aulas por código
        return aulaVirtualRepository.findAll();
    }

    @Override
    public List<AulaVirtual> listarDisponibles() {
        // LÓGICA DE NEGOCIO: Solo aulas en estado disponible, ordenadas
        return aulaVirtualRepository.findAulasDisponibles();
    }

    @Override
    public List<AulaVirtual> listarDisponiblesConFiltros(String codigo, String descripcion) {
        // LÓGICA DE NEGOCIO: Validar y limpiar parámetros
        String codigoLimpio = StringUtils.hasText(codigo) ? codigo.trim() : null;
        String descripcionLimpia = StringUtils.hasText(descripcion) ? descripcion.trim() : null;
        
        // LÓGICA DE NEGOCIO: Si no hay filtros, devolver todas las disponibles
        if (codigoLimpio == null && descripcionLimpia == null) {
            return listarDisponibles();
        }
        
        return aulaVirtualRepository.findAulasDisponiblesConFiltros(codigoLimpio, descripcionLimpia);
    }

    @Override
    public List<AulaVirtual> listarDisponiblesConFiltrosAvanzados(String fecha, String horaInicio, String horaFin, Long cursoId) {
        try {
            // LÓGICA DE NEGOCIO: Validar fechas y horas
            LocalDate fechaLocal = validarYParsearFecha(fecha);
            LocalTime horaInicioLocal = validarYParsearHora(horaInicio);
            LocalTime horaFinLocal = validarYParsearHora(horaFin);
            
            // LÓGICA DE NEGOCIO: Validar que hora fin sea mayor que hora inicio
            if (horaInicioLocal != null && horaFinLocal != null && 
                horaFinLocal.isBefore(horaInicioLocal)) {
                throw new IllegalArgumentException("La hora de fin debe ser posterior a la hora de inicio");
            }
            
            // LÓGICA DE NEGOCIO: Validar que la fecha no sea pasada
            if (fechaLocal != null && fechaLocal.isBefore(LocalDate.now())) {
                throw new IllegalArgumentException("No se pueden buscar aulas para fechas pasadas");
            }
            
            return aulaVirtualRepository.findAulasDisponiblesConFiltrosAvanzados(
                fechaLocal, horaInicioLocal, horaFinLocal, cursoId);
                
        } catch (IllegalArgumentException e) {
            throw e; // Re-lanzar errores de validación
        } catch (Exception e) {
            // LÓGICA DE NEGOCIO: Manejo de errores, log y fallback
            System.err.println("Error al procesar filtros avanzados: " + e.getMessage());
            return aulaVirtualRepository.findAulasDisponibles();
        }
    }

    @Override
    public AulaVirtual obtener(Long id) {
        // LÓGICA DE NEGOCIO: Validar ID
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("ID de aula virtual inválido");
        }
        
        return aulaVirtualRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Aula virtual no encontrada con ID: " + id));
    }

    @Override
    public void crear(AulaVirtual aulaVirtual) {
        // LÓGICA DE NEGOCIO: Validaciones antes de crear
        validarAulaVirtual(aulaVirtual);
        
        // LÓGICA DE NEGOCIO: Verificar que no exista el código
        if (aulaVirtualRepository.existsByCodigo(aulaVirtual.getCodigo())) {
            throw new IllegalArgumentException("Ya existe un aula con el código: " + aulaVirtual.getCodigo());
        }
        
        // LÓGICA DE NEGOCIO: Establecer valores por defecto
        if (aulaVirtual.getEstado() == null) {
            aulaVirtual.setEstado("disponible");
        }
        
        aulaVirtualRepository.save(aulaVirtual);
    }

    @Override
    public void actualizar(AulaVirtual aulaVirtual) {
        // LÓGICA DE NEGOCIO: Validar que existe
        if (!aulaVirtualRepository.existsById(aulaVirtual.getId())) {
            throw new RuntimeException("Aula virtual no encontrada para actualizar");
        }
        
        // LÓGICA DE NEGOCIO: Validaciones
        validarAulaVirtual(aulaVirtual);
        
        aulaVirtualRepository.save(aulaVirtual);
    }

    @Override
    public void eliminar(String codigo) {
        // LÓGICA DE NEGOCIO: Validar código
        if (!StringUtils.hasText(codigo)) {
            throw new IllegalArgumentException("Código de aula requerido para eliminar");
        }
        
        // LÓGICA DE NEGOCIO: Buscar y verificar que existe
        String codigoLimpio = codigo.trim().toUpperCase();
        AulaVirtual aula = aulaVirtualRepository.findByCodigo(codigoLimpio)
            .orElseThrow(() -> new RuntimeException("Aula no encontrada con código: " + codigo));
        
        // LÓGICA DE NEGOCIO: Verificar que no tenga reservas activas
        // TODO: Aquí podrías inyectar ReservaRepository y validar si tiene reservas futuras
        
        aulaVirtualRepository.delete(aula);
    }

    // MÉTODOS PRIVADOS CON LÓGICA DE NEGOCIO
    
    private void validarAulaVirtual(AulaVirtual aulaVirtual) {
        if (aulaVirtual == null) {
            throw new IllegalArgumentException("Aula virtual no puede ser nula");
        }
        
        if (!StringUtils.hasText(aulaVirtual.getCodigo())) {
            throw new IllegalArgumentException("Código de aula es requerido");
        }
        
        if (!StringUtils.hasText(aulaVirtual.getDescripcion())) {
            throw new IllegalArgumentException("Descripción de aula es requerida");
        }
        
        // LÓGICA DE NEGOCIO: Normalizar código
        aulaVirtual.setCodigo(aulaVirtual.getCodigo().trim().toUpperCase());
        
        // LÓGICA DE NEGOCIO: Validar estado
        if (aulaVirtual.getEstado() != null && 
            !aulaVirtual.getEstado().matches("^(disponible|mantenimiento|fuera_de_servicio)$")) {
            throw new IllegalArgumentException("Estado inválido. Debe ser: disponible, mantenimiento, fuera_de_servicio");
        }
    }
    
    private LocalDate validarYParsearFecha(String fecha) {
        if (!StringUtils.hasText(fecha)) {
            return null;
        }
        
        try {
            return LocalDate.parse(fecha.trim());
        } catch (Exception e) {
            throw new IllegalArgumentException("Formato de fecha inválido: " + fecha + ". Use YYYY-MM-DD");
        }
    }
    
    private LocalTime validarYParsearHora(String hora) {
        if (!StringUtils.hasText(hora)) {
            return null;
        }
        
        try {
            return LocalTime.parse(hora.trim());
        } catch (Exception e) {
            throw new IllegalArgumentException("Formato de hora inválido: " + hora + ". Use HH:MM");
        }
    }

    // NUEVOS MÉTODOS CON DTOs Y AUTENTICACIÓN

    @Override
    public List<AulaVirtualResponse> listarTodasConAuth(String token) {
        validarToken(token);
        return listar().stream()
                .map(this::convertirAResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AulaVirtualResponse> listarDisponiblesConAuth(String token) {
        validarToken(token);
        return listarDisponibles().stream()
                .map(this::convertirAResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AulaVirtualResponse> listarDisponiblesConFiltrosAuth(String token, AulaVirtualFilterRequest filtros) {
        validarToken(token);
        
        List<AulaVirtual> aulas;
        if (filtros.getFecha() != null || filtros.getHoraInicio() != null || 
            filtros.getHoraFin() != null || filtros.getCursoId() != null) {
            aulas = listarDisponiblesConFiltrosAvanzados(
                filtros.getFecha(), filtros.getHoraInicio(), 
                filtros.getHoraFin(), filtros.getCursoId());
        } else {
            aulas = listarDisponiblesConFiltros(filtros.getCodigo(), filtros.getDescripcion());
        }
        
        return aulas.stream()
                .map(this::convertirAResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AulaVirtualResponse obtenerConAuth(String token, Long id) {
        validarToken(token);
        AulaVirtual aula = obtener(id);
        return convertirAResponse(aula);
    }

    @Override
    public AulaVirtualResponse crearConAuth(String token, AulaVirtualRequest request) {
        validarToken(token);
        AulaVirtual aula = convertirDeRequest(request);
        crear(aula);
        return convertirAResponse(aula);
    }

    @Override
    public AulaVirtualResponse actualizarConAuth(String token, String codigo, AulaVirtualRequest request) {
        validarToken(token);
        AulaVirtual aula = convertirDeRequest(request);
        aula.setCodigo(codigo);
        actualizar(aula);
        return convertirAResponse(aula);
    }

    @Override
    public void eliminarConAuth(String token, String codigo) {
        validarToken(token);
        eliminar(codigo);
    }

    @Override
    public String validarToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new IllegalArgumentException("Token de autenticación requerido");
        }
        
        try {
            String jwtToken = token.replace("Bearer ", "");
            String username = jwtUtils.getUserNameFromJwtToken(jwtToken);
            
            if (username == null || !jwtUtils.validateJwtToken(jwtToken)) {
                throw new IllegalArgumentException("Token inválido o expirado");
            }
            
            return username;
        } catch (Exception e) {
            throw new IllegalArgumentException("Token inválido o expirado");
        }
    }

    @Override
    public AulaVirtualResponse convertirAResponse(AulaVirtual aula) {
        if (aula == null) return null;
        
        return new AulaVirtualResponse(
                aula.getId(),
                aula.getCodigo(),
                aula.getEstado(),
                aula.getDescripcion(),
                aula.getFechaCreacion()
        );
    }

    @Override
    public AulaVirtual convertirDeRequest(AulaVirtualRequest request) {
        if (request == null) return null;
        
        AulaVirtual aula = new AulaVirtual();
        aula.setCodigo(request.getCodigo());
        aula.setEstado(request.getEstado());
        aula.setDescripcion(request.getDescripcion());
        return aula;
    }
}
