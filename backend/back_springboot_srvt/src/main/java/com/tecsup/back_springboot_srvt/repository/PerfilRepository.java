package com.tecsup.back_springboot_srvt.repository;
import com.tecsup.back_springboot_srvt.model.User;
import com.tecsup.back_springboot_srvt.model.Perfil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PerfilRepository extends JpaRepository<Perfil, Long> {
    
    Optional<Perfil> findByUser(User user);

    /**
     * Buscar perfil por ID de usuario
     */
    Optional<Perfil> findByUserId(Integer userId);
    
    /**
     * Verificar si existe un perfil para un ID de usuario
     */
    boolean existsByUserId(Integer userId);
}
