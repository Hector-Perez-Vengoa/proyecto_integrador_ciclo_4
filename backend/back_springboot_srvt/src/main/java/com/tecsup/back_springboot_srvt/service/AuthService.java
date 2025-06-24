package com.tecsup.back_springboot_srvt.service;

import com.tecsup.back_springboot_srvt.dto.AuthResponse;
import com.tecsup.back_springboot_srvt.dto.LoginRequest;
import com.tecsup.back_springboot_srvt.dto.SignupRequest;
import com.tecsup.back_springboot_srvt.dto.GoogleAuthRequest;
import com.tecsup.back_springboot_srvt.model.User;
import com.tecsup.back_springboot_srvt.model.Perfil;
import com.tecsup.back_springboot_srvt.repository.UserRepository;
import com.tecsup.back_springboot_srvt.repository.PerfilRepository;
import com.tecsup.back_springboot_srvt.security.JwtUtils;
import com.tecsup.back_springboot_srvt.security.UserDetailsImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private static final String TECSUP_DOMAIN = "@tecsup.edu.pe";

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PerfilRepository perfilRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private GoogleAuthService googleAuthService;

    @Autowired
    private ProfesorService profesorService;

    @Autowired
    private GoogleProfileImageService googleProfileImageService;

    /**
     * Autenticar usuario con email y contraseña
     */
    public AuthResponse authenticateUser(LoginRequest loginRequest) {
        // Validar dominio TECSUP
        String normalizedEmail = loginRequest.getEmail().trim().toLowerCase();
        if (!normalizedEmail.endsWith(TECSUP_DOMAIN)) {
            throw new IllegalArgumentException("Solo se permiten correos @tecsup.edu.pe");
        }        // Verificar si el usuario necesita configurar contraseña
        User existingUser = userRepository.findByEmail(normalizedEmail).orElse(null);
        if (existingUser != null && UserPasswordService.esContrasenaTemporalGoogle(existingUser.getPassword())) {
            throw new IllegalStateException("Debe configurar su contraseña antes de iniciar sesión");
        }

        // Autenticar
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizedEmail, loginRequest.getPassword()));

        // Generar JWT token
        String jwt = jwtUtils.generateJwtToken(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        // Actualizar último login
        User user = userRepository.findByUsername(userDetails.getUsername()).orElse(null);
        if (user != null) {
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
        }

        // Obtener profesor ID
        Long profesorId = obtenerProfesorId(userDetails.getId());

        // Crear respuesta
        Map<String, Object> userInfo = createUserInfo(userDetails.getId(), profesorId, 
                userDetails.getUsername(), userDetails.getEmail(), 
                user != null ? user.getFirstName() : "", 
                user != null ? user.getLastName() : "");

        return new AuthResponse(jwt, "Bearer", userInfo);
    }

    /**
     * Registrar nuevo usuario
     */
    @Transactional
    public AuthResponse registerUser(SignupRequest signUpRequest) {
        // Validar dominio TECSUP
        String normalizedEmail = signUpRequest.getEmail().trim().toLowerCase();
        if (!normalizedEmail.endsWith(TECSUP_DOMAIN)) {
            throw new IllegalArgumentException("Solo se permiten correos de TECSUP");
        }

        // Verificar si el email ya existe
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new IllegalArgumentException("El email ya está registrado");
        }

        // Crear nuevo usuario
        User user = new User(
                normalizedEmail, // username is email
                normalizedEmail,
                encoder.encode(signUpRequest.getPassword()),
                signUpRequest.getFirstName(),
                signUpRequest.getLastName()
        );
        user.setDateJoined(LocalDateTime.now());
        user.setLastLogin(LocalDateTime.now());
        user.setActive(true);
        User savedUser = userRepository.save(user);

        // Crear Perfil
        Perfil perfil = new Perfil();
        perfil.setUser(savedUser);
        perfil.setFechaActualizacion(LocalDateTime.now());
        Perfil savedPerfil = perfilRepository.save(perfil);

        // Asegurar profesor
        profesorService.asegurarProfesorParaUsuario(savedUser, savedPerfil);

        // Autenticar y generar token
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        signUpRequest.getEmail().trim().toLowerCase(),
                        signUpRequest.getPassword()
                )
        );
        String jwt = jwtUtils.generateJwtToken(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        // Obtener profesor ID
        Long profesorId = obtenerProfesorId(savedUser.getId());

        // Crear respuesta
        Map<String, Object> userInfo = createUserInfo(userDetails.getId(), profesorId,
                userDetails.getUsername(), userDetails.getEmail(),
                savedUser.getFirstName(), savedUser.getLastName());

        return new AuthResponse(jwt, "Bearer", userInfo, "Usuario registrado exitosamente!");
    }

    /**
     * Autenticar con Google OAuth
     */
    @Transactional
    public AuthResponse authenticateWithGoogle(GoogleAuthRequest googleRequest) {
        try {
            // Verificar token con Google
            GoogleAuthService.GoogleUserInfo userInfo = googleAuthService.verifyGoogleToken(googleRequest.getToken());
            
            if (userInfo == null) {
                throw new IllegalArgumentException("El token de Google no es válido o ha expirado");
            }

            // Extraer datos verificados
            String email = userInfo.getEmail().trim().toLowerCase();
            String firstName = userInfo.getGivenName();
            String lastName = userInfo.getFamilyName();
            String googlePictureUrl = userInfo.getPicture();

            // Validar email
            if (email == null || email.trim().isEmpty()) {
                throw new IllegalArgumentException("El token de Google no contiene información de email");
            }

            // Verificar dominio TECSUP
            if (!email.endsWith(TECSUP_DOMAIN)) {
                throw new IllegalArgumentException("Solo se permiten correos @tecsup.edu.pe");
            }

            // Buscar o crear usuario
            User userEntity = processGoogleUser(email, firstName, lastName, googlePictureUrl);

            // Crear o recuperar perfil
            Perfil userPerfil = perfilRepository.findByUser(userEntity).orElseGet(() -> {
                Perfil newPerfil = new Perfil(userEntity);
                newPerfil.setFechaActualizacion(LocalDateTime.now());
                return perfilRepository.save(newPerfil);
            });

            // Asegurar profesor
            profesorService.asegurarProfesorParaUsuario(userEntity, userPerfil);

            // Actualizar imagen de perfil
            if (googlePictureUrl != null && !googlePictureUrl.trim().isEmpty()) {
                userPerfil.actualizarImagenGoogle(googlePictureUrl);
                perfilRepository.save(userPerfil);
                googleProfileImageService.actualizarImagenPerfil(userEntity, googlePictureUrl);
            }

            // Generar token
            String jwt = jwtUtils.generateTokenFromUsername(userEntity.getUsername());

            // Obtener profesor ID
            Long profesorId = obtenerProfesorId(userEntity.getId());

            // Crear respuesta
            Map<String, Object> userInfoMap = createUserInfo(userEntity.getId(), profesorId,
                    userEntity.getUsername(), userEntity.getEmail(),
                    userEntity.getFirstName(), userEntity.getLastName());            AuthResponse response = new AuthResponse(jwt, "Bearer", userInfoMap);
            
            // Verificar si necesita configurar contraseña
            boolean needsPassword = UserPasswordService.esContrasenaTemporalGoogle(userEntity.getPassword());
            if (needsPassword) {
                response.setRequirePassword(true);
            }

            return response;
        } catch (Exception e) {
            // Re-lanzar como RuntimeException para que el controller pueda manejarla
            throw new RuntimeException("Error procesando autenticación de Google: " + e.getMessage(), e);
        }
    }

    /**
     * Procesar usuario de Google (crear o actualizar)
     */
    private User processGoogleUser(String email, String firstName, String lastName, String googlePictureUrl) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isPresent()) {
            // Usuario existente - actualizar datos
            User userEntity = userOpt.get();
            userEntity.setLastLogin(LocalDateTime.now());
            
            if (firstName != null && !firstName.trim().isEmpty()) {
                userEntity.setFirstName(firstName.trim());
            }
            if (lastName != null && !lastName.trim().isEmpty()) {
                userEntity.setLastName(lastName.trim());
            }
            if (googlePictureUrl != null && !googlePictureUrl.trim().isEmpty()) {
                userEntity.setGoogleImageUrl(googlePictureUrl);
            }
            
            return userRepository.save(userEntity);
        } else {
            // Crear nuevo usuario
            User newUser = new User();
            newUser.setUsername(email);
            newUser.setEmail(email);
            newUser.setFirstName(firstName != null ? firstName.trim() : "");
            newUser.setLastName(lastName != null ? lastName.trim() : "");
            String tempPassword = UserPasswordService.generarContrasenaTemporalGoogle();
            newUser.setPassword(encoder.encode(tempPassword));
            newUser.setDateJoined(LocalDateTime.now());
            newUser.setLastLogin(LocalDateTime.now());
            newUser.setActive(true);
            
            if (googlePictureUrl != null && !googlePictureUrl.trim().isEmpty()) {
                newUser.setGoogleImageUrl(googlePictureUrl);
            }
            
            return userRepository.save(newUser);
        }
    }

    /**
     * Obtener profesor ID de manera segura
     */
    private Long obtenerProfesorId(Integer userId) {
        try {
            return profesorService.obtenerProfesorIdPorUsuario(userId);
        } catch (Exception e) {
            // No es crítico si no se puede obtener profesorId
            return null;
        }
    }

    /**
     * Crear información del usuario para la respuesta
     */
    private Map<String, Object> createUserInfo(Integer id, Long profesorId, String username, 
                                             String email, String firstName, String lastName) {
        return Map.of(
                "id", id,
                "profesorId", profesorId != null ? profesorId : id,
                "username", username,
                "email", email,
                "firstName", firstName != null ? firstName : "",
                "lastName", lastName != null ? lastName : ""
        );
    }
}
