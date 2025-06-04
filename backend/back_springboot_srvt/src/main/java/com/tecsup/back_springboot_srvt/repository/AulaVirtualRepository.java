package com.tecsup.back_springboot_srvt.repository;

import com.tecsup.back_springboot_srvt.model.AulaVirtual;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AulaVirtualRepository extends JpaRepository<AulaVirtual, Long> {
    
    List<AulaVirtual> findByEstado(String estado);
      @Query("SELECT a FROM AulaVirtual a WHERE a.estado = 'disponible'")
    List<AulaVirtual> findAulasDisponibles();    
    
    AulaVirtual findByCodigo(String codigo);
      @Query("SELECT a FROM AulaVirtual a WHERE a.estado = 'disponible' AND " +
           "(:codigo IS NULL OR LOWER(a.codigo) LIKE LOWER(CONCAT('%', :codigo, '%'))) AND " +
           "(:descripcion IS NULL OR LOWER(a.descripcion) LIKE LOWER(CONCAT('%', :descripcion, '%')))")
    List<AulaVirtual> findAulasDisponiblesConFiltros(
        @Param("codigo") String codigo, 
        @Param("descripcion") String descripcion
    );    /**
     * Buscar aulas disponibles con filtros avanzados por fecha, hora y curso
     * Esta consulta busca aulas que:
     * 1. Estén en estado 'disponible' 
     * 2. No tengan reservas conflictivas en la fecha y horario especificado
     * 3. Opcionalmente filtrar por curso específico
     */
    @Query("SELECT DISTINCT a FROM AulaVirtual a WHERE a.estado = 'disponible' AND " +
           "(:fecha IS NULL OR :horaInicio IS NULL OR :horaFin IS NULL OR " +
           "NOT EXISTS (SELECT r FROM Reserva r WHERE r.aulaVirtual.id = a.id AND " +
           "r.fechaReserva = :fecha AND r.estado = 'reservado' AND " +
           "((r.horaInicio <= :horaInicio AND r.horaFin > :horaInicio) OR " +
           "(r.horaInicio < :horaFin AND r.horaFin >= :horaFin) OR " +
           "(r.horaInicio >= :horaInicio AND r.horaFin <= :horaFin)))) AND " +
           "(:cursoId IS NULL OR EXISTS (SELECT c FROM Curso c WHERE c.id = :cursoId))")
    List<AulaVirtual> findAulasDisponiblesConFiltrosAvanzados(
        @Param("fecha") LocalDate fecha,
        @Param("horaInicio") LocalTime horaInicio, 
        @Param("horaFin") LocalTime horaFin,
        @Param("cursoId") Long cursoId
    );
}
