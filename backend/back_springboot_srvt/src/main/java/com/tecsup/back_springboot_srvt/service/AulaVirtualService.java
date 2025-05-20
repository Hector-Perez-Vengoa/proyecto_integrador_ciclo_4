package com.tecsup.back_springboot_srvt.service;
import com.tecsup.back_springboot_srvt.model.AulaVirtual;
import java.util.List;

public interface AulaVirtualService {

    List<AulaVirtual> listar();
    AulaVirtual obtener(Long id);
    void crear(AulaVirtual aulaVirtual);
    void actualizar(AulaVirtual aulaVirtual);
    void eliminar(String codigo);
}
