package com.tecsup.back_springboot_srvt.repository;

import com.tecsup.back_springboot_srvt.model.AulaVirtual;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AulaVirtualRepository extends JpaRepository<AulaVirtual, Long> {
    
    // Buscar aulas por estado
    List<AulaVirtual> findByEstado(String estado);
    
    // Buscar aulas disponibles
    @Query("SELECT a FROM AulaVirtual a WHERE a.estado = 'disponible'")
    List<AulaVirtual> findAulasDisponibles();    
    // Buscar por código
    AulaVirtual findByCodigo(String codigo);
}
