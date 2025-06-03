package com.tecsup.back_springboot_srvt.service;

import com.tecsup.back_springboot_srvt.model.Perfil;
import com.tecsup.back_springboot_srvt.model.User;
import com.tecsup.back_springboot_srvt.repository.PerfilRepository;
import com.tecsup.back_springboot_srvt.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class PerfilServiceTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PerfilRepository perfilRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User testUser;    @BeforeEach
    void setUp() {
        // No limpiar datos para evitar conflictos con foreign keys
        // Crear usuario de prueba con email único
        long timestamp = System.currentTimeMillis();
        testUser = new User();
        testUser.setUsername("perfil.test." + timestamp + "@tecsup.edu.pe");
        testUser.setEmail("perfil.test." + timestamp + "@tecsup.edu.pe");
        testUser.setPassword(passwordEncoder.encode("password123"));
        testUser.setFirstName("Perfil");
        testUser.setLastName("Test");
        testUser.setDateJoined(LocalDateTime.now());
        testUser.setActive(true);
        
        testUser = userRepository.save(testUser);
    }

    @Test
    void testCrearPerfil() {
        // Datos del perfil
        String biografia = "Soy estudiante de TECSUP en la carrera de Desarrollo de Software";
        String telefono = "+51987654321";
        String ubicacion = "Lima, Perú";
        LocalDate fechaNacimiento = LocalDate.of(2000, 5, 15);
        String sitioWeb = "https://github.com/perfiltest";
        String linkedin = "https://linkedin.com/in/perfiltest";

        // Crear perfil
        Perfil perfil = new Perfil();
        perfil.setUser(testUser);
        perfil.setBiografia(biografia);
        perfil.setTelefono(telefono);
        perfil.setUbicacion(ubicacion);
        perfil.setFechaNacimiento(fechaNacimiento);
        perfil.setSitioWeb(sitioWeb);
        perfil.setLinkedin(linkedin);

        // Guardar perfil
        Perfil savedPerfil = perfilRepository.save(perfil);

        // Verificaciones
        assertNotNull(savedPerfil.getId());
        assertEquals(testUser.getId(), savedPerfil.getUser().getId());
        assertEquals(biografia, savedPerfil.getBiografia());
        assertEquals(telefono, savedPerfil.getTelefono());
        assertEquals(ubicacion, savedPerfil.getUbicacion());
        assertEquals(fechaNacimiento, savedPerfil.getFechaNacimiento());
        assertEquals(sitioWeb, savedPerfil.getSitioWeb());
        assertEquals(linkedin, savedPerfil.getLinkedin());

        System.out.println("✅ Test de crear perfil exitoso - Perfil ID: " + savedPerfil.getId());
    }

    @Test
    void testActualizarPerfil() {
        // Crear perfil inicial
        Perfil perfil = new Perfil();
        perfil.setUser(testUser);
        perfil.setBiografia("Biografia inicial");
        perfil.setTelefono("+51999888777");
        
        Perfil savedPerfil = perfilRepository.save(perfil);

        // Actualizar datos
        String nuevaBiografia = "Biografia actualizada - Desarrollador Full Stack";
        String nuevoTelefono = "+51987123456";
        String ubicacion = "Arequipa, Perú";

        savedPerfil.setBiografia(nuevaBiografia);
        savedPerfil.setTelefono(nuevoTelefono);
        savedPerfil.setUbicacion(ubicacion);

        // Guardar cambios
        Perfil updatedPerfil = perfilRepository.save(savedPerfil);

        // Verificaciones
        assertEquals(nuevaBiografia, updatedPerfil.getBiografia());
        assertEquals(nuevoTelefono, updatedPerfil.getTelefono());
        assertEquals(ubicacion, updatedPerfil.getUbicacion());

        System.out.println("✅ Test de actualizar perfil exitoso");
    }

    @Test
    void testBuscarPerfilPorUsuario() {
        // Crear perfil
        Perfil perfil = new Perfil();
        perfil.setUser(testUser);
        perfil.setBiografia("Perfil de búsqueda");
        
        perfilRepository.save(perfil);

        // Buscar perfil por usuario
        Perfil foundPerfil = perfilRepository.findByUserId(testUser.getId()).orElse(null);

        // Verificaciones
        assertNotNull(foundPerfil);
        assertEquals(testUser.getId(), foundPerfil.getUser().getId());
        assertEquals("Perfil de búsqueda", foundPerfil.getBiografia());

        System.out.println("✅ Test de buscar perfil por usuario exitoso");
    }
}
