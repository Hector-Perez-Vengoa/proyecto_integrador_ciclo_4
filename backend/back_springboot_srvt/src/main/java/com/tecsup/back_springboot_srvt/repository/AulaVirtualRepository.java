package com.tecsup.back_springboot_srvt.repository;

import com.tecsup.back_springboot_srvt.model.AulaVirtual;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AulaVirtualRepository extends JpaRepository<AulaVirtual, Long> {
    
    /**
     * Busca aulas por estado
     */
    List<AulaVirtual> findByEstado(String estado);
    
    /**
     * Busca aulas disponibles
     */
    @Query("SELECT a FROM AulaVirtual a WHERE a.estado = 'disponible' ORDER BY a.codigo")
    List<AulaVirtual> findAulasDisponibles();    
    
    /**
     * Busca aula por código
     */
    Optional<AulaVirtual> findByCodigo(String codigo);
    
    /**
     * Verifica si existe un aula con el código especificado
     */
    boolean existsByCodigo(String codigo);
    
    /**
     * Busca aulas disponibles con filtros básicos
     */
    @Query("SELECT a FROM AulaVirtual a WHERE a.estado = 'disponible' AND " +
           "(:codigo IS NULL OR LOWER(a.codigo) LIKE LOWER(CONCAT('%', :codigo, '%'))) AND " +
           "(:descripcion IS NULL OR LOWER(a.descripcion) LIKE LOWER(CONCAT('%', :descripcion, '%'))) " +
           "ORDER BY a.codigo")
    List<AulaVirtual> findAulasDisponiblesConFiltros(
        @Param("codigo") String codigo, 
        @Param("descripcion") String descripcion
    );
    
    /**
     * Buscar aulas disponibles con filtros avanzados por fecha, hora y curso
     * Esta consulta busca aulas que:
     * 1. Estén en estado 'disponible' 
     * 2. No tengan reservas conflictivas en la fecha y horario especificado
     */
    @Query("SELECT DISTINCT a FROM AulaVirtual a WHERE a.estado = 'disponible' AND " +
           "(:fecha IS NULL OR :horaInicio IS NULL OR :horaFin IS NULL OR " +
           "NOT EXISTS (SELECT r FROM Reserva r WHERE r.aulaVirtual.id = a.id AND " +
           "r.fechaReserva = :fecha AND r.estado NOT IN ('CANCELADA') AND " +
           "((r.horaInicio < :horaFin AND r.horaFin > :horaInicio)))) " +
           "ORDER BY a.codigo")
    List<AulaVirtual> findAulasDisponiblesConFiltrosAvanzados(
        @Param("fecha") LocalDate fecha,
        @Param("horaInicio") LocalTime horaInicio, 
        @Param("horaFin") LocalTime horaFin,
        @Param("cursoId") Long cursoId
    );
}
