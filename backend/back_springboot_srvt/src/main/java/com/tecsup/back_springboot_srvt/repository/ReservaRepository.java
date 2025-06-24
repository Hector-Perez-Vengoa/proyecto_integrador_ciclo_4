package com.tecsup.back_springboot_srvt.repository;

import com.tecsup.back_springboot_srvt.model.Reserva;
import com.tecsup.back_springboot_srvt.model.AulaVirtual;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    
    /**
     * Busca reservas que se solapen con el horario especificado en la misma aula y fecha
     */
    @Query("SELECT r FROM Reserva r WHERE r.aulaVirtual = :aulaVirtual " +
           "AND r.fechaReserva = :fechaReserva " +
           "AND r.estado NOT IN ('CANCELADA') " +
           "AND ((r.horaInicio < :horaFin AND r.horaFin > :horaInicio))")
    List<Reserva> findConflictingReservas(
        @Param("aulaVirtual") AulaVirtual aulaVirtual,
        @Param("fechaReserva") LocalDate fechaReserva,
        @Param("horaInicio") LocalTime horaInicio,
        @Param("horaFin") LocalTime horaFin
    );
    
    /**
     * Busca reservas por profesor en una fecha específica
     */
    List<Reserva> findByProfesorIdAndFechaReserva(Long profesorId, LocalDate fechaReserva);
    
    /**
     * Busca reservas por aula virtual en una fecha específica
     */
    List<Reserva> findByAulaVirtualIdAndFechaReserva(Long aulaVirtualId, LocalDate fechaReserva);
    
    /**
     * Busca todas las reservas de un profesor
     */
    @Query("SELECT r FROM Reserva r WHERE r.profesor.id = :profesorId " +
           "ORDER BY r.fechaReserva DESC, r.horaInicio DESC")
    List<Reserva> findByProfesorId(Long profesorId);
    
    /**
     * Busca reservas por estado
     */
    List<Reserva> findByEstado(String estado);
    
    /**
     * Busca reservas por profesor que puedan ser canceladas (antes de la fecha/hora)
     */
    @Query("SELECT r FROM Reserva r WHERE r.profesor.id = :profesorId " +
           "AND r.estado IN ('CONFIRMADA', 'ACTIVA', 'PENDIENTE') " +
           "AND (r.fechaReserva > :fechaActual OR " +
           "(r.fechaReserva = :fechaActual AND r.horaInicio > :horaActual)) " +
           "ORDER BY r.fechaReserva ASC, r.horaInicio ASC")
    List<Reserva> findReservasCancelablesPorProfesor(
        @Param("profesorId") Long profesorId,
        @Param("fechaActual") LocalDate fechaActual,
        @Param("horaActual") LocalTime horaActual
    );
    
    /**
     * Busca reservas futuras por profesor
     */
    @Query("SELECT r FROM Reserva r WHERE r.profesor.id = :profesorId " +
           "AND r.estado NOT IN ('CANCELADA') " +
           "AND (r.fechaReserva > :fechaActual OR " +
           "(r.fechaReserva = :fechaActual AND r.horaInicio > :horaActual)) " +
           "ORDER BY r.fechaReserva ASC, r.horaInicio ASC")
    List<Reserva> findReservasFuturasPorProfesor(
        @Param("profesorId") Long profesorId,
        @Param("fechaActual") LocalDate fechaActual,
        @Param("horaActual") LocalTime horaActual
    );
    
    /**
     * Busca reservas pasadas por profesor
     */
    @Query("SELECT r FROM Reserva r WHERE r.profesor.id = :profesorId " +
           "AND (r.fechaReserva < :fechaActual OR " +
           "(r.fechaReserva = :fechaActual AND r.horaFin <= :horaActual)) " +
           "ORDER BY r.fechaReserva DESC, r.horaInicio DESC")
    List<Reserva> findReservasPasadasPorProfesor(
        @Param("profesorId") Long profesorId,
        @Param("fechaActual") LocalDate fechaActual,
        @Param("horaActual") LocalTime horaActual
    );
}
