package com.tecsup.back_springboot_srvt.service;

import com.tecsup.back_springboot_srvt.model.AulaVirtual;
import com.tecsup.back_springboot_srvt.dto.*;
import java.util.List;

public interface AulaVirtualService {

    // Métodos originales (mantenemos compatibilidad)
    List<AulaVirtual> listar();
    List<AulaVirtual> listarDisponibles();
    List<AulaVirtual> listarDisponiblesConFiltros(String codigo, String descripcion);
    List<AulaVirtual> listarDisponiblesConFiltrosAvanzados(String fecha, String horaInicio, String horaFin, Long cursoId);
    AulaVirtual obtener(Long id);
    void crear(AulaVirtual aulaVirtual);
    void actualizar(AulaVirtual aulaVirtual);
    void eliminar(String codigo);

    // Nuevos métodos con DTOs y autenticación
    List<AulaVirtualResponse> listarTodasConAuth(String token);
    List<AulaVirtualResponse> listarDisponiblesConAuth(String token);
    List<AulaVirtualResponse> listarDisponiblesConFiltrosAuth(String token, AulaVirtualFilterRequest filtros);
    AulaVirtualResponse obtenerConAuth(String token, Long id);
    AulaVirtualResponse crearConAuth(String token, AulaVirtualRequest request);
    AulaVirtualResponse actualizarConAuth(String token, String codigo, AulaVirtualRequest request);
    void eliminarConAuth(String token, String codigo);

    // Métodos de utilidad
    String validarToken(String token);
    AulaVirtualResponse convertirAResponse(AulaVirtual aula);
    AulaVirtual convertirDeRequest(AulaVirtualRequest request);
}
