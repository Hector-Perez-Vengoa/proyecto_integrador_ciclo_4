package com.tecsup.back_springboot_srvt.service;

import com.tecsup.back_springboot_srvt.controller.UserController.ChangePasswordRequest;
import com.tecsup.back_springboot_srvt.controller.UserController.SetupPasswordRequest;
import com.tecsup.back_springboot_srvt.model.User;
import com.tecsup.back_springboot_srvt.repository.UserRepository;
import com.tecsup.back_springboot_srvt.security.UserDetailsImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Base64;

@Service
public class UserPasswordService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    // Prefijo para identificar contraseñas temporales de Google (más seguro)
    private static final String GOOGLE_TEMP_PREFIX = "$GOOGLE_TEMP$";
    private static final SecureRandom secureRandom = new SecureRandom();

    /**
     * Genera una contraseña temporal aleatoria para usuarios de Google OAuth
     */
    public static String generarContrasenaTemporalGoogle() {
        byte[] randomBytes = new byte[32]; // 256 bits de entropía
        secureRandom.nextBytes(randomBytes);
        String randomPassword = Base64.getEncoder().encodeToString(randomBytes);
        return GOOGLE_TEMP_PREFIX + randomPassword;
    }

    /**
     * Verifica si una contraseña es temporal de Google
     */
    public static boolean esContrasenaTemporalGoogle(String password) {
        return password != null && password.startsWith(GOOGLE_TEMP_PREFIX);
    }

    /**
     * Cambiar contraseña de usuario existente
     */
    public void cambiarContrasena(ChangePasswordRequest request) {
        User user = obtenerUsuarioAutenticado();

        // Validar contraseña actual (solo si no es temporal de Google)
        if (!esContrasenaTemporalGoogle(user.getPassword())) {
            if (request.getCurrentPassword() == null || request.getCurrentPassword().trim().isEmpty()) {
                throw new IllegalArgumentException("La contraseña actual es requerida");
            }
            
            if (!encoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new IllegalArgumentException("Contraseña actual incorrecta");
            }
        }

        // Validar nueva contraseña
        validarNuevaContrasena(request.getNewPassword());

        // Actualizar contraseña
        user.setPassword(encoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    /**
     * Configurar contraseña para usuarios de Google OAuth
     */
    public void configurarContrasena(SetupPasswordRequest request) {
        User user = obtenerUsuarioAutenticado();

        // Verificar que el usuario necesite configurar contraseña
        if (!esContrasenaTemporalGoogle(user.getPassword())) {
            throw new IllegalArgumentException("Este usuario ya tiene una contraseña configurada. Use el endpoint de cambio de contraseña.");
        }

        // Validar nueva contraseña
        validarNuevaContrasena(request.getPassword());

        // Actualizar contraseña
        user.setPassword(encoder.encode(request.getPassword()));
        userRepository.save(user);
    }

    /**
     * Obtener usuario autenticado actual
     */
    private User obtenerUsuarioAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        return userRepository.findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    /**
     * Validar requisitos de nueva contraseña
     */
    private void validarNuevaContrasena(String password) {
        if (password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("La contraseña es requerida");
        }

        if (password.length() < 6) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 6 caracteres");
        }

        if (password.length() > 128) {
            throw new IllegalArgumentException("La contraseña no puede exceder 128 caracteres");
        }

        // Opcional: Agregar más validaciones de seguridad
        if (password.equals("123456") || password.equals("password") || password.equals("admin")) {
            throw new IllegalArgumentException("La contraseña es demasiado común. Use una contraseña más segura");
        }
    }
}
