package com.tecsup.back_springboot_srvt.repository;

import com.tecsup.back_springboot_srvt.model.Curso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CursoRepository extends JpaRepository<Curso, Long> {
    // Encontrar cursos por carrera
    List<Curso> findByCarreraId(Long carreraId);
    
    // Encontrar cursos por múltiples carreras
    @Query("SELECT c FROM Curso c WHERE c.carrera.id IN :carreraIds")
    List<Curso> findByCarreraIdIn(@Param("carreraIds") List<Long> carreraIds);
}