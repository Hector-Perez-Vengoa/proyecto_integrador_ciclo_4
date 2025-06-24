package com.tecsup.back_springboot_srvt.service;

import com.tecsup.back_springboot_srvt.dto.*;
import com.tecsup.back_springboot_srvt.model.*;
import com.tecsup.back_springboot_srvt.repository.*;
import com.tecsup.back_springboot_srvt.security.JwtUtils;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PerfilServiceImpl implements PerfilService {

    @Autowired
    private PerfilRepository perfilRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private DepartamentoRepository departamentoRepository;
    
    @Autowired
    private CarreraRepository carreraRepository;
    
    @Autowired
    private CursoRepository cursoRepository;
    
    @Autowired
    private ProfesorRepository profesorRepository;
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    @Autowired
    private ProfesorService profesorService;

    @Override
    public PerfilResponse obtenerPerfilConAuth(String token) {
        String username = validarToken(token);
        
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("Usuario no encontrado");
        }
        User user = userOpt.get();
        
        Optional<Perfil> perfilOpt = perfilRepository.findByUserId(user.getId());
        Perfil perfil;
        
        if (!perfilOpt.isPresent()) {
            perfil = new Perfil();
            perfil.setUser(user);
            perfil.setFechaActualizacion(LocalDateTime.now());
            perfil = perfilRepository.save(perfil);
            profesorService.asegurarProfesorParaUsuario(user, perfil);
        } else {
            perfil = perfilOpt.get();
            profesorService.asegurarProfesorParaUsuario(user, perfil);
        }
        
        return convertirAPerfilResponse(perfil);
    }

    @Override
    @Transactional
    public PerfilResponse actualizarPerfilConAuth(String token, ActualizarPerfilRequest request) {
        String username = validarToken(token);
        
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("Usuario no encontrado");
        }
        User user = userOpt.get();

        // Actualizar datos del User
        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        userRepository.save(user);

        // Actualizar datos del Perfil
        Optional<Perfil> perfilOpt = perfilRepository.findByUserId(user.getId());
        if (!perfilOpt.isPresent()) {
            throw new RuntimeException("Perfil no encontrado para el usuario");
        }
        Perfil perfil = perfilOpt.get();
        
        if (request.getBiografia() != null) perfil.setBiografia(request.getBiografia());
        if (request.getTelefono() != null) perfil.setTelefono(request.getTelefono());
        if (request.getFechaNacimiento() != null) perfil.setFechaNacimiento(request.getFechaNacimiento());

        // Actualizar Departamento
        if (request.getDepartamentoId() != null) {
            Optional<Departamento> deptoOpt = departamentoRepository.findById(request.getDepartamentoId());
            if (deptoOpt.isPresent()) {
                perfil.setDepartamento(deptoOpt.get());
            }
        }

        // Actualizar Carreras
        if (request.getCarreraIds() != null && !request.getCarreraIds().isEmpty()) {
            List<Carrera> carreras = carreraRepository.findAllById(request.getCarreraIds());
            perfil.setCarreras(carreras);
        } else {
            perfil.setCarreras(new ArrayList<>());
        }

        // Actualizar Cursos
        if (request.getCursoIds() != null && !request.getCursoIds().isEmpty()) {
            List<Curso> cursos = cursoRepository.findAllById(request.getCursoIds());
            perfil.setCursos(cursos);
        } else {
            perfil.setCursos(new ArrayList<>());
        }
        
        perfil.setFechaActualizacion(LocalDateTime.now());
        perfilRepository.save(perfil);
        
        // Actualizar entidad Profesor
        actualizarProfesor(user, perfil);
        
        return convertirAPerfilResponse(perfil);
    }

    @Override
    public ImagenPerfilResponse sincronizarImagenPerfilConAuth(String token) {
        String username = validarToken(token);
        
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("Usuario no encontrado");
        }
        User user = userOpt.get();

        Optional<Perfil> perfilOpt = perfilRepository.findByUserId(user.getId());
        if (!perfilOpt.isPresent()) {
            throw new RuntimeException("Perfil no encontrado");
        }
        Perfil perfil = perfilOpt.get();

        String googleImageUrl = user.getGoogleImageUrl();
        
        if (googleImageUrl != null && !googleImageUrl.isEmpty()) {
            perfil.actualizarImagenGoogle(googleImageUrl);
            perfilRepository.save(perfil);
            
            return new ImagenPerfilResponse(
                perfil.getImagenUrl(),
                user.getEmail(),
                "Imagen de perfil sincronizada desde Google exitosamente",
                googleImageUrl
            );
        } else {
            perfil.setImagenPerfil(null);
            perfil.setFechaActualizacion(LocalDateTime.now());
            perfilRepository.save(perfil);
            
            return new ImagenPerfilResponse(
                perfil.getImagenUrl(),
                user.getEmail(),
                "No hay imagen de Google disponible, usando avatar generado"
            );
        }
    }

    @Override
    public List<DepartamentoDTO> listarDepartamentos() {
        List<Departamento> departamentos = departamentoRepository.findAll();
        return departamentos.stream()
            .map(d -> new DepartamentoDTO(d.getId(), d.getNombre(), null, null))
            .collect(Collectors.toList());
    }

    @Override
    public List<CarreraDTO> listarCarreras() {
        List<Carrera> carreras = carreraRepository.findAll();
        return carreras.stream()
            .map(c -> new CarreraDTO(c.getId(), c.getNombre(), c.getCodigo(), null, null, null))
            .collect(Collectors.toList());
    }

    @Override
    public List<CursoDTO> listarCursos() {
        List<Curso> cursos = cursoRepository.findAll();
        return cursos.stream()
            .map(c -> new CursoDTO(c.getId(), c.getNombre(), null, null, null, null, null))
            .collect(Collectors.toList());
    }

    @Override
    public List<CarreraDTO> listarCarrerasPorDepartamento(Long departamentoId) {
        List<Carrera> carreras = carreraRepository.findByDepartamentoId(departamentoId);
        return carreras.stream()
            .map(c -> new CarreraDTO(c.getId(), c.getNombre(), c.getCodigo(), null, null, null))
            .collect(Collectors.toList());
    }

    @Override
    public List<CursoDTO> listarCursosPorCarrera(Long carreraId) {
        List<Curso> cursos = cursoRepository.findByCarreraId(carreraId);
        return cursos.stream()
            .map(c -> new CursoDTO(c.getId(), c.getNombre(), null, null, null, null, null))
            .collect(Collectors.toList());
    }

    @Override
    public List<CursoDTO> listarCursosPorCarreras(List<Long> carreraIds) {
        if (carreraIds == null || carreraIds.isEmpty()) {
            return new ArrayList<>();
        }
        
        List<Curso> cursos = cursoRepository.findByCarreraIdIn(carreraIds);
        return cursos.stream()
            .map(c -> new CursoDTO(c.getId(), c.getNombre(), null, null, null, null, null))
            .collect(Collectors.toList());
    }

    @Override
    public String validarToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new IllegalArgumentException("Token de autenticación requerido");
        }
        
        try {
            String jwtToken = token.replace("Bearer ", "");
            String username = jwtUtils.getUserNameFromJwtToken(jwtToken);
            
            if (username == null || !jwtUtils.validateJwtToken(jwtToken)) {
                throw new IllegalArgumentException("Token inválido o expirado");
            }
            
            return username;
        } catch (Exception e) {
            throw new IllegalArgumentException("Token inválido o expirado");
        }
    }

    // MÉTODOS PRIVADOS HELPER

    private PerfilResponse convertirAPerfilResponse(Perfil perfil) {
        PerfilResponse response = new PerfilResponse();
        
        response.setId(perfil.getId());
        response.setBiografia(perfil.getBiografia());
        response.setTelefono(perfil.getTelefono());
        response.setFechaNacimiento(perfil.getFechaNacimiento());
        response.setImagenPerfil(perfil.getImagenUrl());
        response.setFechaActualizacion(perfil.getFechaActualizacion());
        
        User user = perfil.getUser();
        if (user != null) {
            response.setUsername(user.getUsername());
            response.setEmail(user.getEmail());
            response.setFirstName(user.getFirstName());
            response.setLastName(user.getLastName());
            
            String nombreCompleto = (user.getFirstName() != null ? user.getFirstName() : "") + " " + 
                                   (user.getLastName() != null ? user.getLastName() : "");
            response.setNombreCompleto(nombreCompleto.trim());
        }
        
        if (perfil.getDepartamento() != null) {
            response.setDepartamento(new DepartamentoDTO(
                perfil.getDepartamento().getId(),
                perfil.getDepartamento().getNombre(),
                null, null
            ));
        }

        if (perfil.getCarreras() != null) {
            List<CarreraDTO> carrerasDTO = perfil.getCarreras().stream()
                .map(c -> new CarreraDTO(c.getId(), c.getNombre(), c.getCodigo(), null, null, null))
                .collect(Collectors.toList());
            response.setCarreras(carrerasDTO);
        }

        if (perfil.getCursos() != null) {
            List<CursoDTO> cursosDTO = perfil.getCursos().stream()
                .map(c -> new CursoDTO(c.getId(), c.getNombre(), null, null, null, null, null))
                .collect(Collectors.toList());
            response.setCursos(cursosDTO);
        }
        
        return response;
    }

    private void actualizarProfesor(User user, Perfil perfil) {
        try {
            Optional<Profesor> profesorOpt = profesorRepository.findByUserId(user.getId());
            Profesor profesor;
            
            if (profesorOpt.isPresent()) {
                profesor = profesorOpt.get();
            } else {
                profesor = new Profesor();
                profesor.setUserId(user.getId());
                profesor.setPerfilId(perfil.getId());
            }
            
            profesor.setNombres(user.getFirstName());
            profesor.setApellidos(user.getLastName());
            profesor.setCorreo(user.getEmail());
            profesor.setPerfilId(perfil.getId());
            
            if (perfil.getDepartamento() != null) {
                profesor.setDepartamento(perfil.getDepartamento());
            }
            
            profesor = profesorRepository.save(profesor);
            
            // Actualizar relaciones many-to-many
            actualizarRelacionesProfesor(profesor, perfil);
            
        } catch (Exception e) {
            throw new RuntimeException("Error actualizando profesor: " + e.getMessage(), e);
        }
    }

    private void actualizarRelacionesProfesor(Profesor profesor, Perfil perfil) {
        try {
            // Actualizar carreras
            entityManager.createNativeQuery("DELETE FROM profesordb_carreras WHERE profesordb_id = ?")
                .setParameter(1, profesor.getId())
                .executeUpdate();
            
            if (perfil.getCarreras() != null && !perfil.getCarreras().isEmpty()) {
                for (Carrera carrera : perfil.getCarreras()) {
                    entityManager.createNativeQuery("INSERT INTO profesordb_carreras (profesordb_id, carreradb_id) VALUES (?, ?)")
                        .setParameter(1, profesor.getId())
                        .setParameter(2, carrera.getId())
                        .executeUpdate();
                }
            }
            
            // Actualizar cursos
            entityManager.createNativeQuery("DELETE FROM profesordb_cursos WHERE profesordb_id = ?")
                .setParameter(1, profesor.getId())
                .executeUpdate();
            
            if (perfil.getCursos() != null && !perfil.getCursos().isEmpty()) {
                for (Curso curso : perfil.getCursos()) {
                    entityManager.createNativeQuery("INSERT INTO profesordb_cursos (profesordb_id, cursodb_id) VALUES (?, ?)")
                        .setParameter(1, profesor.getId())
                        .setParameter(2, curso.getId())
                        .executeUpdate();
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Error actualizando relaciones del profesor: " + e.getMessage(), e);
        }
    }
}
