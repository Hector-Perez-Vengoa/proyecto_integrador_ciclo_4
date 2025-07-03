package com.tecsup.back_springboot_srvt.repository;

import com.tecsup.back_springboot_srvt.model.AulaVirtualComponente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AulaVirtualComponenteRepository extends JpaRepository<AulaVirtualComponente, Long> {

    @Query("SELECT c FROM AulaVirtualComponente c WHERE c.aulaVirtual.id = :aulaId")
    List<AulaVirtualComponente> findByAulaVirtualId(@Param("aulaId") Long aulaId);

}
