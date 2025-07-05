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
     * Busca reservas por usuario en una fecha específica
     */
    List<Reserva> findByUserIdAndFechaReserva(Integer userId, LocalDate fechaReserva);
    
    /**
     * Busca reservas por aula virtual en una fecha específica
     */
    List<Reserva> findByAulaVirtualIdAndFechaReserva(Long aulaVirtualId, LocalDate fechaReserva);
    
    /**
     * Busca todas las reservas de un usuario
     */
    @Query("SELECT r FROM Reserva r WHERE r.user.id = :userId " +
           "ORDER BY r.fechaReserva DESC, r.horaInicio DESC")
    List<Reserva> findByUserId(Integer userId);
    
    /**
     * Busca reservas por estado
     */
    List<Reserva> findByEstado(String estado);
    
    /**
     * Busca reservas por usuario que puedan ser canceladas (antes de la fecha/hora)
     */
    @Query("SELECT r FROM Reserva r WHERE r.user.id = :userId " +
           "AND r.estado IN ('CONFIRMADA', 'ACTIVA', 'PENDIENTE') " +
           "AND (r.fechaReserva > :fechaActual OR " +
           "(r.fechaReserva = :fechaActual AND r.horaInicio > :horaActual)) " +
           "ORDER BY r.fechaReserva ASC, r.horaInicio ASC")
    List<Reserva> findReservasCancelablesPorUsuario(
        @Param("userId") Integer userId,
        @Param("fechaActual") LocalDate fechaActual,
        @Param("horaActual") LocalTime horaActual
    );
    
    /**
     * Busca reservas futuras por usuario
     */
    @Query("SELECT r FROM Reserva r WHERE r.user.id = :userId " +
           "AND r.estado NOT IN ('CANCELADA') " +
           "AND (r.fechaReserva > :fechaActual OR " +
           "(r.fechaReserva = :fechaActual AND r.horaInicio > :horaActual)) " +
           "ORDER BY r.fechaReserva ASC, r.horaInicio ASC")
    List<Reserva> findReservasFuturasPorUsuario(
        @Param("userId") Integer userId,
        @Param("fechaActual") LocalDate fechaActual,
        @Param("horaActual") LocalTime horaActual
    );
    
    /**
     * Busca reservas pasadas por usuario
     */
    @Query("SELECT r FROM Reserva r WHERE r.user.id = :userId " +
           "AND (r.fechaReserva < :fechaActual OR " +
           "(r.fechaReserva = :fechaActual AND r.horaFin <= :horaActual)) " +
           "ORDER BY r.fechaReserva DESC, r.horaInicio DESC")
    List<Reserva> findReservasPasadasPorUsuario(
        @Param("userId") Integer userId,
        @Param("fechaActual") LocalDate fechaActual,
        @Param("horaActual") LocalTime horaActual
    );
}
