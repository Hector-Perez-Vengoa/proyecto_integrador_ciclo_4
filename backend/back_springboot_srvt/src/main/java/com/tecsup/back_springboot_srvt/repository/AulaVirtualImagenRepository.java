package com.tecsup.back_springboot_srvt.repository;

import com.tecsup.back_springboot_srvt.model.AulaVirtual;
import com.tecsup.back_springboot_srvt.model.AulaVirtualImagen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AulaVirtualImagenRepository extends JpaRepository<AulaVirtualImagen, Long> {

    /**
     * Buscar todas las imágenes activas de un aula virtual, ordenadas por orden de visualización
     */
    @Query("SELECT img FROM AulaVirtualImagen img WHERE img.aulaVirtual = :aulaVirtual AND img.activo = true ORDER BY img.ordenVisualizacion ASC, img.fechaCreacion ASC")
    List<AulaVirtualImagen> findByAulaVirtualAndActivoTrueOrderByOrdenVisualizacion(@Param("aulaVirtual") AulaVirtual aulaVirtual);

    /**
     * Buscar la imagen principal de un aula virtual
     */
    @Query("SELECT img FROM AulaVirtualImagen img WHERE img.aulaVirtual = :aulaVirtual AND img.esPrincipal = true AND img.activo = true")
    Optional<AulaVirtualImagen> findImagenPrincipalByAulaVirtual(@Param("aulaVirtual") AulaVirtual aulaVirtual);

    /**
     * Buscar imágenes por aula virtual ID
     */
    @Query("SELECT img FROM AulaVirtualImagen img WHERE img.aulaVirtual.id = :aulaVirtualId AND img.activo = true ORDER BY img.ordenVisualizacion ASC")
    List<AulaVirtualImagen> findByAulaVirtualIdAndActivoTrue(@Param("aulaVirtualId") Long aulaVirtualId);

    /**
     * Contar imágenes activas de un aula virtual
     */
    @Query("SELECT COUNT(img) FROM AulaVirtualImagen img WHERE img.aulaVirtual = :aulaVirtual AND img.activo = true")
    Long countByAulaVirtualAndActivoTrue(@Param("aulaVirtual") AulaVirtual aulaVirtual);

    /**
     * Verificar si existe una imagen principal para el aula virtual
     */
    @Query("SELECT COUNT(img) > 0 FROM AulaVirtualImagen img WHERE img.aulaVirtual = :aulaVirtual AND img.esPrincipal = true AND img.activo = true")
    boolean existeImagenPrincipal(@Param("aulaVirtual") AulaVirtual aulaVirtual);

    /**
     * Obtener el próximo orden de visualización para un aula virtual
     */
    @Query("SELECT COALESCE(MAX(img.ordenVisualizacion), 0) + 1 FROM AulaVirtualImagen img WHERE img.aulaVirtual = :aulaVirtual")
    Integer obtenerSiguienteOrden(@Param("aulaVirtual") AulaVirtual aulaVirtual);
}
