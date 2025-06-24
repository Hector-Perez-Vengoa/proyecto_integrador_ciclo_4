package com.tecsup.back_springboot_srvt.repository;

import com.tecsup.back_springboot_srvt.model.Profesor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ProfesorRepository extends JpaRepository<Profesor, Long> {
    Optional<Profesor> findByCorreo(String correo);
    Optional<Profesor> findByCodigo(String codigo);
    boolean existsByCodigo(String codigo);
    
    /**
     * Busca un profesor por su user_id
     */
    Optional<Profesor> findByUserId(Integer userId);
    
    /**
     * Verifica si un profesor tiene asignado un curso específico
     */
    @Query("SELECT COUNT(p) > 0 FROM Profesor p JOIN p.cursos c WHERE p.id = :profesorId AND c.id = :cursoId")
    boolean profesorTieneCursoAsignado(@Param("profesorId") Long profesorId, @Param("cursoId") Long cursoId);
}