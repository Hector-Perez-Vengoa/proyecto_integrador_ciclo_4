package com.tecsup.back_springboot_srvt.repository;

import com.tecsup.back_springboot_srvt.model.CalendarioInstitucional;
import com.tecsup.back_springboot_srvt.model.AulaVirtual;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CalendarioInstitucionalRepository extends JpaRepository<CalendarioInstitucional, Long> {
    
    /**
     * Busca bloqueos activos que afecten una fecha específica
     * (bloqueos globales - sin aula específica)
     */
    @Query("SELECT c FROM CalendarioInstitucional c WHERE c.activo = true " +
           "AND c.aulaVirtual IS NULL " +
           "AND :fecha BETWEEN c.fechaInicio AND c.fechaFin")
    List<CalendarioInstitucional> findBloqueosGlobales(@Param("fecha") LocalDate fecha);
    
    /**
     * Busca bloqueos activos que afecten un aula específica en una fecha
     */
    @Query("SELECT c FROM CalendarioInstitucional c WHERE c.activo = true " +
           "AND c.aulaVirtual = :aulaVirtual " +
           "AND :fecha BETWEEN c.fechaInicio AND c.fechaFin")
    List<CalendarioInstitucional> findBloqueosPorAula(
        @Param("aulaVirtual") AulaVirtual aulaVirtual,
        @Param("fecha") LocalDate fecha
    );
    
    /**
     * Busca todos los bloqueos activos para una fecha (globales + específicos de aula)
     */
    @Query("SELECT c FROM CalendarioInstitucional c WHERE c.activo = true " +
           "AND :fecha BETWEEN c.fechaInicio AND c.fechaFin " +
           "AND (c.aulaVirtual IS NULL OR c.aulaVirtual = :aulaVirtual)")
    List<CalendarioInstitucional> findTodosLosBloqueosParaAulaYFecha(
        @Param("aulaVirtual") AulaVirtual aulaVirtual,
        @Param("fecha") LocalDate fecha
    );
    
    /**
     * Busca bloqueos por tipo
     */    List<CalendarioInstitucional> findByTipoBloqueoAndActivoTrue(String tipoBloqueo);
    
    /**
     * Busca bloqueos activos en un rango de fechas
     */
    @Query("SELECT c FROM CalendarioInstitucional c WHERE c.activo = true " +
           "AND ((c.fechaInicio BETWEEN :fechaInicio AND :fechaFin) " +
           "OR (c.fechaFin BETWEEN :fechaInicio AND :fechaFin) " +
           "OR (c.fechaInicio <= :fechaInicio AND c.fechaFin >= :fechaFin))")
    List<CalendarioInstitucional> findBloqueosEnRango(
        @Param("fechaInicio") LocalDate fechaInicio,
        @Param("fechaFin") LocalDate fechaFin
    );
    
    /**
     * Busca bloqueos activos entre dos fechas
     */
    @Query("SELECT c FROM CalendarioInstitucional c WHERE c.activo = true " +
           "AND c.fechaInicio >= :fechaInicio AND c.fechaFin <= :fechaFin")
    List<CalendarioInstitucional> findByFechaBloqueoBetween(
        @Param("fechaInicio") LocalDate fechaInicio,
        @Param("fechaFin") LocalDate fechaFin
    );
    
    /**
     * Busca bloqueos para una fecha específica y aula específica (incluyendo globales)
     */
    @Query("SELECT c FROM CalendarioInstitucional c WHERE c.activo = true " +
           "AND :fecha BETWEEN c.fechaInicio AND c.fechaFin " +
           "AND (c.aulaVirtual IS NULL OR c.aulaVirtual.id = :aulaId)")
    List<CalendarioInstitucional> findBloqueosParaFechaYAula(
        @Param("fecha") LocalDate fecha,
        @Param("aulaId") Long aulaId
    );
}
