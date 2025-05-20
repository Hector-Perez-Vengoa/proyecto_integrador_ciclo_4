package com.tecsup.back_springboot_srvt.dao;
import com.tecsup.back_springboot_srvt.model.AulaVirtual;
import java.util.List;

public interface AulaVirtualDAO {
    List<AulaVirtual> Listar();
    AulaVirtual BuscarPorCodigo(String codigo);
    void guardar (AulaVirtual aulaVirtual);
    void actualizar (AulaVirtual aulaVirtual);
    void eliminar (String codigo);
}
