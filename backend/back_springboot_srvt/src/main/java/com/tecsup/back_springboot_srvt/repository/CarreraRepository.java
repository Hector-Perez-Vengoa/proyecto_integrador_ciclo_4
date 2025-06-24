package com.tecsup.back_springboot_srvt.repository;

import com.tecsup.back_springboot_srvt.model.Carrera;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CarreraRepository extends JpaRepository<Carrera, Long> {
    // Encontrar carreras por departamento
    List<Carrera> findByDepartamentoId(Long departamentoId);
}