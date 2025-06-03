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
public class IntegratedServiceTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PerfilRepository perfilRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        perfilRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void testRegistroLoginYPerfil() {
        System.out.println("🚀 Iniciando test integrado: Registro → Login → Perfil");

        // PASO 1: REGISTRO
        String email = "integration.test@tecsup.edu.pe";
        String password = "securepass123";
        
        User user = new User();
        user.setUsername(email);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setFirstName("Integration");
        user.setLastName("Test");
        user.setDateJoined(LocalDateTime.now());
        user.setActive(true);
        
        User registeredUser = userRepository.save(user);
        
        System.out.println("✅ PASO 1 - REGISTRO exitoso: " + registeredUser.getEmail());
        assertNotNull(registeredUser.getId());
        
        // PASO 2: LOGIN
        User loginUser = userRepository.findByEmail(email).orElse(null);
        assertNotNull(loginUser);
        assertTrue(passwordEncoder.matches(password, loginUser.getPassword()));
        
        // Actualizar último login
        loginUser.setLastLogin(LocalDateTime.now());
        userRepository.save(loginUser);
        
        System.out.println("✅ PASO 2 - LOGIN exitoso para: " + loginUser.getEmail());
        
        // PASO 3: CREAR PERFIL
        Perfil perfil = new Perfil();
        perfil.setUser(loginUser);
        perfil.setBiografia("Estudiante de TECSUP - Desarrollo de Software");
        perfil.setTelefono("+51987654321");
        perfil.setUbicacion("Lima, Perú");
        perfil.setFechaNacimiento(LocalDate.of(1999, 8, 15));
        perfil.setSitioWeb("https://portfolio.tecsup.edu.pe");
        perfil.setLinkedin("https://linkedin.com/in/tecsup-student");
        
        Perfil savedPerfil = perfilRepository.save(perfil);
        
        System.out.println("✅ PASO 3 - PERFIL creado exitosamente ID: " + savedPerfil.getId());
        assertNotNull(savedPerfil.getId());
        assertEquals(loginUser.getId(), savedPerfil.getUser().getId());
        
        // VERIFICACIÓN FINAL
        User finalUser = userRepository.findById(registeredUser.getId()).orElse(null);
        Perfil finalPerfil = perfilRepository.findByUserId(registeredUser.getId()).orElse(null);
        
        assertNotNull(finalUser);
        assertNotNull(finalPerfil);
        assertNotNull(finalUser.getLastLogin());
        
        System.out.println("🎉 TEST INTEGRADO COMPLETADO EXITOSAMENTE!");
        System.out.println("   - Usuario: " + finalUser.getEmail());
        System.out.println("   - Perfil: " + finalPerfil.getBiografia());
        System.out.println("   - Último login: " + finalUser.getLastLogin());
    }
}
