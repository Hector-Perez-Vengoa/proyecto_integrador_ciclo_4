package com.tecsup.back_springboot_srvt.repository;

import com.tecsup.back_springboot_srvt.model.Reglamento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReglamentoRepository extends JpaRepository<Reglamento, Long> {
    
    // Buscar por estado
    Page<Reglamento> findByEstado(String estado, Pageable pageable);
    
    // Buscar por tipo
    Page<Reglamento> findByTipo(String tipo, Pageable pageable);
    
    // Buscar por estado y tipo
    Page<Reglamento> findByEstadoAndTipo(String estado, String tipo, Pageable pageable);
    
    // Buscar excluyendo un estado
    Page<Reglamento> findByEstadoNot(String estado, Pageable pageable);
    
    // Buscar por título (búsqueda)
    Page<Reglamento> findByTituloContainingIgnoreCaseAndEstadoNot(String titulo, String estado, Pageable pageable);
    
    // Buscar reglamento activo por tipo
    Optional<Reglamento> findFirstByTipoAndEstadoOrderByFechaCreacionDesc(String tipo, String estado);
    
    // Contar por estado
    Long countByEstado(String estado);
    
    // Estadísticas de visualizaciones y descargas
    @Query("SELECT COALESCE(SUM(r.contadorVisualizaciones), 0) FROM Reglamento r WHERE r.estado != 'eliminado'")
    Long sumContadorVisualizaciones();
    
    @Query("SELECT COALESCE(SUM(r.contadorDescargas), 0) FROM Reglamento r WHERE r.estado != 'eliminado'")
    Long sumContadorDescargas();
    
    // Top 5 más vistos
    List<Reglamento> findTop5ByEstadoOrderByContadorVisualizacionesDesc(String estado);
    
    // Top 5 más descargados
    List<Reglamento> findTop5ByEstadoOrderByContadorDescargasDesc(String estado);
    
    // Buscar por múltiples estados
    @Query("SELECT r FROM Reglamento r WHERE r.estado IN :estados")
    Page<Reglamento> findByEstadoIn(@Param("estados") List<String> estados, Pageable pageable);
    
    // Buscar por filtros combinados
    @Query("SELECT r FROM Reglamento r WHERE " +
           "(:titulo IS NULL OR LOWER(r.titulo) LIKE LOWER(CONCAT('%', :titulo, '%'))) AND " +
           "(:tipo IS NULL OR r.tipo = :tipo) AND " +
           "(:estado IS NULL OR r.estado = :estado) AND " +
           "r.estado != 'eliminado'")
    Page<Reglamento> findByFiltros(@Param("titulo") String titulo, 
                                   @Param("tipo") String tipo, 
                                   @Param("estado") String estado, 
                                   Pageable pageable);
    
    // Buscar reglamentos obligatorios activos
    List<Reglamento> findByEsObligatorioAndEstado(Boolean esObligatorio, String estado);
    
    // Buscar por autor
    Page<Reglamento> findByAutorContainingIgnoreCaseAndEstadoNot(String autor, String estado, Pageable pageable);
    
    // Verificar si existe un reglamento activo del mismo tipo y versión
    @Query("SELECT COUNT(r) > 0 FROM Reglamento r WHERE r.tipo = :tipo AND r.version = :version AND r.estado = 'activo' AND r.id != :id")
    boolean existeReglamentoActivoTipoVersion(@Param("tipo") String tipo, @Param("version") String version, @Param("id") Long id);
    
    // Buscar reglamentos por rango de fechas
    @Query("SELECT r FROM Reglamento r WHERE r.fechaCreacion BETWEEN :fechaInicio AND :fechaFin AND r.estado != 'eliminado'")
    Page<Reglamento> findByFechaCreacionBetween(@Param("fechaInicio") java.time.LocalDateTime fechaInicio, 
                                                @Param("fechaFin") java.time.LocalDateTime fechaFin, 
                                                Pageable pageable);
}
