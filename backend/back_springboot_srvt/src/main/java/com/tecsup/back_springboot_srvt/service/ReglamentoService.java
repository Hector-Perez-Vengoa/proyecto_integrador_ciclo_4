package com.tecsup.back_springboot_srvt.service;

import com.tecsup.back_springboot_srvt.dto.ReglamentoRequestDTO;
import com.tecsup.back_springboot_srvt.dto.ReglamentoResponseDTO;
import com.tecsup.back_springboot_srvt.model.Reglamento;
import com.tecsup.back_springboot_srvt.repository.ReglamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReglamentoService {

    @Autowired
    private ReglamentoRepository reglamentoRepository;

    public Page<ReglamentoResponseDTO> obtenerReglamentos(String estado, String tipo, String busqueda, Pageable pageable) {
        Page<Reglamento> reglamentos;
        
        if (StringUtils.hasText(busqueda)) {
            reglamentos = reglamentoRepository.findByTituloContainingIgnoreCaseAndEstadoNot(
                busqueda, "eliminado", pageable);
        } else if (StringUtils.hasText(estado) && StringUtils.hasText(tipo)) {
            reglamentos = reglamentoRepository.findByEstadoAndTipo(estado, tipo, pageable);
        } else if (StringUtils.hasText(estado)) {
            reglamentos = reglamentoRepository.findByEstado(estado, pageable);
        } else if (StringUtils.hasText(tipo)) {
            reglamentos = reglamentoRepository.findByTipo(tipo, pageable);
        } else {
            reglamentos = reglamentoRepository.findByEstadoNot("eliminado", pageable);
        }
        
        List<ReglamentoResponseDTO> dtos = reglamentos.getContent().stream()
                .map(this::convertirAResponseDTO)
                .collect(Collectors.toList());
        
        return new PageImpl<>(dtos, pageable, reglamentos.getTotalElements());
    }

    // Obtener reglamento por ID
    public ReglamentoResponseDTO obtenerReglamentoPorId(Long id) {
        Reglamento reglamento = reglamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reglamento no encontrado con ID: " + id));
        
        if ("eliminado".equals(reglamento.getEstado())) {
            throw new RuntimeException("El reglamento ha sido eliminado");
        }
        
        return convertirAResponseDTO(reglamento);
    }

    // Crear nuevo reglamento
    public ReglamentoResponseDTO crearReglamento(ReglamentoRequestDTO request) {
        Reglamento reglamento = new Reglamento();
        mapearRequestAEntity(request, reglamento);
        reglamento.setFechaCreacion(LocalDateTime.now());
        reglamento.setFechaModificacion(LocalDateTime.now());
        reglamento.setEstado("activo");
        reglamento.setContadorVisualizaciones(0L);
        reglamento.setContadorDescargas(0L);
        
        Reglamento savedReglamento = reglamentoRepository.save(reglamento);
        return convertirAResponseDTO(savedReglamento);
    }

    // Actualizar reglamento
    public ReglamentoResponseDTO actualizarReglamento(Long id, ReglamentoRequestDTO request) {
        Reglamento reglamento = reglamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reglamento no encontrado con ID: " + id));
        
        if ("eliminado".equals(reglamento.getEstado())) {
            throw new RuntimeException("No se puede actualizar un reglamento eliminado");
        }
        
        mapearRequestAEntity(request, reglamento);
        reglamento.setFechaModificacion(LocalDateTime.now());
        
        Reglamento updatedReglamento = reglamentoRepository.save(reglamento);
        return convertirAResponseDTO(updatedReglamento);
    }

    // Eliminar reglamento (eliminación lógica)
    public void eliminarReglamento(Long id) {
        Reglamento reglamento = reglamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reglamento no encontrado con ID: " + id));
        
        reglamento.setEstado("eliminado");
        reglamento.setFechaModificacion(LocalDateTime.now());
        reglamentoRepository.save(reglamento);
    }

    // Cambiar estado del reglamento
    public ReglamentoResponseDTO cambiarEstadoReglamento(Long id, String estado) {
        Reglamento reglamento = reglamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reglamento no encontrado con ID: " + id));
        
        if ("eliminado".equals(reglamento.getEstado())) {
            throw new RuntimeException("No se puede cambiar el estado de un reglamento eliminado");
        }
        
        List<String> estadosValidos = Arrays.asList("activo", "inactivo", "borrador");
        if (!estadosValidos.contains(estado)) {
            throw new RuntimeException("Estado no válido: " + estado);
        }
        
        reglamento.setEstado(estado);
        reglamento.setFechaModificacion(LocalDateTime.now());
        
        Reglamento updatedReglamento = reglamentoRepository.save(reglamento);
        return convertirAResponseDTO(updatedReglamento);
    }

    // Obtener reglamento activo por tipo
    public ReglamentoResponseDTO obtenerReglamentoActivo(String tipo) {
        Optional<Reglamento> reglamento = reglamentoRepository.findFirstByTipoAndEstadoOrderByFechaCreacionDesc(
                tipo, "activo");
        
        if (reglamento.isEmpty()) {
            throw new RuntimeException("No se encontró un reglamento activo para el tipo: " + tipo);
        }
        
        return convertirAResponseDTO(reglamento.get());
    }

    // Descargar PDF del reglamento
    public Resource descargarPdf(Long id) {
        try {
            Reglamento reglamento = reglamentoRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Reglamento no encontrado con ID: " + id));
            
            if ("eliminado".equals(reglamento.getEstado())) {
                throw new RuntimeException("El reglamento ha sido eliminado");
            }
            
            // Construir la ruta del archivo PDF
            Path filePath = Paths.get(reglamento.getRutaArchivo());
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Archivo PDF no encontrado o no legible");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener el archivo PDF: " + e.getMessage());
        }
    }

    // Incrementar contador de visualizaciones
    public void incrementarVisualizaciones(Long id) {
        Reglamento reglamento = reglamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reglamento no encontrado con ID: " + id));
        
        reglamento.setContadorVisualizaciones(reglamento.getContadorVisualizaciones() + 1);
        reglamento.setFechaModificacion(LocalDateTime.now());
        reglamentoRepository.save(reglamento);
    }

    // Incrementar contador de descargas
    public void incrementarDescargas(Long id) {
        Reglamento reglamento = reglamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reglamento no encontrado con ID: " + id));
        
        reglamento.setContadorDescargas(reglamento.getContadorDescargas() + 1);
        reglamento.setFechaModificacion(LocalDateTime.now());
        reglamentoRepository.save(reglamento);
    }

    // Obtener estadísticas de reglamentos
    public Map<String, Object> obtenerEstadisticas() {
        Map<String, Object> estadisticas = new HashMap<>();
        
        // Contadores por estado
        Long totalActivos = reglamentoRepository.countByEstado("activo");
        Long totalInactivos = reglamentoRepository.countByEstado("inactivo");
        Long totalBorradores = reglamentoRepository.countByEstado("borrador");
        Long totalEliminados = reglamentoRepository.countByEstado("eliminado");
        
        estadisticas.put("totalActivos", totalActivos);
        estadisticas.put("totalInactivos", totalInactivos);
        estadisticas.put("totalBorradores", totalBorradores);
        estadisticas.put("totalEliminados", totalEliminados);
        estadisticas.put("total", totalActivos + totalInactivos + totalBorradores);
        
        // Estadísticas de visualizaciones y descargas
        Long totalVisualizaciones = reglamentoRepository.sumContadorVisualizaciones();
        Long totalDescargas = reglamentoRepository.sumContadorDescargas();
        
        estadisticas.put("totalVisualizaciones", totalVisualizaciones != null ? totalVisualizaciones : 0);
        estadisticas.put("totalDescargas", totalDescargas != null ? totalDescargas : 0);
        
        // Reglamentos más populares
        List<Reglamento> masVistos = reglamentoRepository.findTop5ByEstadoOrderByContadorVisualizacionesDesc("activo");
        List<Reglamento> masDescargados = reglamentoRepository.findTop5ByEstadoOrderByContadorDescargasDesc("activo");
        
        estadisticas.put("masVistos", masVistos.stream()
                .map(this::convertirAResponseDTO)
                .collect(Collectors.toList()));
        estadisticas.put("masDescargados", masDescargados.stream()
                .map(this::convertirAResponseDTO)
                .collect(Collectors.toList()));
        
        return estadisticas;
    }

    // Métodos privados de utilidad
    private void mapearRequestAEntity(ReglamentoRequestDTO request, Reglamento reglamento) {
        reglamento.setTitulo(request.getTitulo());
        reglamento.setDescripcion(request.getDescripcion());
        reglamento.setTipo(request.getTipo());
        reglamento.setVersion(request.getVersion());
        reglamento.setRutaArchivo(request.getRutaArchivo());
        reglamento.setTamanoArchivo(request.getTamanoArchivo());
        reglamento.setAutor(request.getAutor());
        reglamento.setEsObligatorio(request.getEsObligatorio());
        reglamento.setMetadatos(request.getMetadatos());
    }

    private ReglamentoResponseDTO convertirAResponseDTO(Reglamento reglamento) {
        ReglamentoResponseDTO dto = new ReglamentoResponseDTO();
        dto.setId(reglamento.getId());
        dto.setTitulo(reglamento.getTitulo());
        dto.setDescripcion(reglamento.getDescripcion());
        dto.setTipo(reglamento.getTipo());
        dto.setVersion(reglamento.getVersion());
        dto.setEstado(reglamento.getEstado());
        dto.setRutaArchivo(reglamento.getRutaArchivo());
        dto.setTamanoArchivo(reglamento.getTamanoArchivo());
        dto.setTamanoLegible(reglamento.getTamanoLegible());
        dto.setNombreArchivo(reglamento.getNombreArchivo());
        dto.setAutor(reglamento.getAutor());
        dto.setEsObligatorio(reglamento.getEsObligatorio());
        dto.setContadorVisualizaciones(reglamento.getContadorVisualizaciones());
        dto.setContadorDescargas(reglamento.getContadorDescargas());
        dto.setFechaCreacion(reglamento.getFechaCreacion());
        dto.setFechaModificacion(reglamento.getFechaModificacion());
        dto.setMetadatos(reglamento.getMetadatos());
        
        // Construir URLs para el PDF
        String baseUrl = "http://localhost:8080/api/reglamentos/" + reglamento.getId();
        dto.setUrlVisualizacion(baseUrl + "/view");
        dto.setUrlDescarga(baseUrl + "/download");
        
        return dto;
    }
}
