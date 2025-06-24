package com.tecsup.back_springboot_srvt.repository;

import com.tecsup.back_springboot_srvt.model.Departamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartamentoRepository extends JpaRepository<Departamento, Long> {
}