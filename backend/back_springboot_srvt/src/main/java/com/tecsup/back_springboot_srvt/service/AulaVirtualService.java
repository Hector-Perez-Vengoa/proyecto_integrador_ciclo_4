package com.tecsup.back_springboot_srvt.service;
import com.tecsup.back_springboot_srvt.model.AulaVirtual;
import java.util.List;

public interface AulaVirtualService {

    List<AulaVirtual> listar();
    List<AulaVirtual> listarDisponibles();
    
    List<AulaVirtual> listarDisponiblesConFiltros(String codigo, String descripcion);
    List<AulaVirtual> listarDisponiblesConFiltrosAvanzados(String fecha, String horaInicio, String horaFin, Long cursoId);
    
    AulaVirtual obtener(Long id);
    void crear(AulaVirtual aulaVirtual);
    void actualizar(AulaVirtual aulaVirtual);
    void eliminar(String codigo);
}
