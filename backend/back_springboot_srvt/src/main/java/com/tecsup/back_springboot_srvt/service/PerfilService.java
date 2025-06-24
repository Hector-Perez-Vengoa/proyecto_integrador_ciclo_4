package com.tecsup.back_springboot_srvt.service;

import com.tecsup.back_springboot_srvt.dto.*;
import java.util.List;

public interface PerfilService {
    
    // Métodos principales
    PerfilResponse obtenerPerfilConAuth(String token);
    PerfilResponse actualizarPerfilConAuth(String token, ActualizarPerfilRequest request);
    ImagenPerfilResponse sincronizarImagenPerfilConAuth(String token);
    
    // Métodos para obtener datos de referencia
    List<DepartamentoDTO> listarDepartamentos();
    List<CarreraDTO> listarCarreras();
    List<CursoDTO> listarCursos();
    List<CarreraDTO> listarCarrerasPorDepartamento(Long departamentoId);
    List<CursoDTO> listarCursosPorCarrera(Long carreraId);
    List<CursoDTO> listarCursosPorCarreras(List<Long> carreraIds);
    
    // Métodos de utilidad
    String validarToken(String token);
}
