package com.tecsup.back_springboot_srvt.service;

import com.tecsup.back_springboot_srvt.model.User;
import com.tecsup.back_springboot_srvt.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class AuthServiceTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User testUser;    @BeforeEach
    void setUp() {
        // No limpiar datos para evitar conflictos con foreign keys
        // Usar emails únicos con timestamp en cada test
    }    @Test
    void testRegistroUsuario() {
        // Datos de prueba con timestamp único
        long timestamp = System.currentTimeMillis();
        String email = "test.user." + timestamp + "@tecsup.edu.pe";
        String password = "password123";
        String firstName = "Test";
        String lastName = "User";

        // Crear usuario
        User user = new User();
        user.setUsername(email);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setDateJoined(LocalDateTime.now());
        user.setActive(true);

        // Guardar usuario
        User savedUser = userRepository.save(user);

        // Verificaciones
        assertNotNull(savedUser.getId());
        assertEquals(email, savedUser.getEmail());
        assertEquals(firstName, savedUser.getFirstName());
        assertEquals(lastName, savedUser.getLastName());
        assertTrue(passwordEncoder.matches(password, savedUser.getPassword()));
        assertTrue(savedUser.isActive());
        assertNotNull(savedUser.getDateJoined());

        // Verificar que se puede encontrar por email
        assertTrue(userRepository.existsByEmail(email));
        
        System.out.println("✅ Test de registro exitoso - Usuario ID: " + savedUser.getId());
    }

    @Test
    void testLoginUsuario() {
        // Primero registrar un usuario
        String email = "login.test@tecsup.edu.pe";
        String password = "loginpass123";
        
        User user = new User();
        user.setUsername(email);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setFirstName("Login");
        user.setLastName("Test");
        user.setDateJoined(LocalDateTime.now());
        user.setActive(true);
        
        User savedUser = userRepository.save(user);

        // Simular login - buscar usuario por email
        User foundUser = userRepository.findByEmail(email).orElse(null);
        
        // Verificaciones de login
        assertNotNull(foundUser);
        assertEquals(email, foundUser.getEmail());
        assertTrue(passwordEncoder.matches(password, foundUser.getPassword()));
        assertTrue(foundUser.isActive());

        // Actualizar último login
        foundUser.setLastLogin(LocalDateTime.now());
        userRepository.save(foundUser);
        
        assertNotNull(foundUser.getLastLogin());
        
        System.out.println("✅ Test de login exitoso - Usuario: " + foundUser.getEmail());
    }
}
