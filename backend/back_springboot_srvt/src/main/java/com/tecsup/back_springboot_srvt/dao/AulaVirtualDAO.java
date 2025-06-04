package com.tecsup.back_springboot_srvt.dao;
import com.tecsup.back_springboot_srvt.model.AulaVirtual;
import java.util.List;

public interface AulaVirtualDAO {
    List<AulaVirtual> Listar();
    List<AulaVirtual> ListarDisponibles();
    
    List<AulaVirtual> ListarDisponiblesConFiltros(String codigo, String descripcion);
    List<AulaVirtual> ListarDisponiblesConFiltrosAvanzados(String fecha, String horaInicio, String horaFin, Long cursoId);
    
    AulaVirtual BuscarPorCodigo(Long id);
    void guardar (AulaVirtual aulaVirtual);
    void actualizar (AulaVirtual aulaVirtual);
    void eliminar (String codigo);
}
