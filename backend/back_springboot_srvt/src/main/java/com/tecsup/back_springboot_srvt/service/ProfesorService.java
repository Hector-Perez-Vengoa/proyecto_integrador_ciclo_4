package com.tecsup.back_springboot_srvt.service;

import com.tecsup.back_springboot_srvt.model.Profesor;
import com.tecsup.back_springboot_srvt.model.User;
import com.tecsup.back_springboot_srvt.model.Perfil;
import com.tecsup.back_springboot_srvt.model.Curso;
import com.tecsup.back_springboot_srvt.dto.CursoDTO;
import com.tecsup.back_springboot_srvt.repository.ProfesorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfesorService {

    @Autowired
    private ProfesorRepository profesorRepository;

    @Transactional
    public Profesor asegurarProfesorParaUsuario(User user, Perfil perfil) { // Added Perfil parameter
        if (user == null || user.getEmail() == null || user.getEmail().isEmpty()) {
            System.err.println("Error: User object or User email is null/empty in asegurarProfesorParaUsuario.");
            return null; 
        }
        if (user.getId() == null) {
            System.err.println("Error: User ID is null. Cannot reliably create or find Profesor.");
            return null;
        }
        if (perfil == null || perfil.getId() == null) {
            System.err.println("Error: Perfil object or Perfil ID is null. Cannot reliably create Profesor.");
            // Decide if a profesor can be created without a perfilId or if this is a hard requirement.
            // For now, let's assume it's required for consistency.
            return null;
        }

        Optional<Profesor> profesorOpt = profesorRepository.findByCorreo(user.getEmail());
        if (profesorOpt.isPresent()) {
            Profesor existingProfesor = profesorOpt.get();
            // Ensure userId and perfilId are up-to-date if they were somehow not set or changed
            boolean updated = false;
            if (existingProfesor.getUserId() == null || !existingProfesor.getUserId().equals(user.getId())) {
                existingProfesor.setUserId(user.getId());
                updated = true;
            }
            if (existingProfesor.getPerfilId() == null || !existingProfesor.getPerfilId().equals(perfil.getId())) {
                existingProfesor.setPerfilId(perfil.getId());
                updated = true;
            }
            if (updated) {
                return profesorRepository.save(existingProfesor);
            }
            return existingProfesor;
        } else {
            Profesor nuevoProfesor = new Profesor();
            nuevoProfesor.setUserId(user.getId()); // Set userId
            nuevoProfesor.setPerfilId(perfil.getId()); // Set perfilId
            nuevoProfesor.setNombres(user.getFirstName() != null ? user.getFirstName() : "");
            nuevoProfesor.setApellidos(user.getLastName() != null ? user.getLastName() : "");
            nuevoProfesor.setCorreo(user.getEmail());
            nuevoProfesor.setFechaCreacion(LocalDateTime.now());

            // Generate a temporary unique code to satisfy NOT NULL constraint.
            // This will be overwritten by the final PROFxxx code.
            // Assuming 'codigo' column can hold at least 7 characters.
            String tempCodigo = "T" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
            nuevoProfesor.setCodigo(tempCodigo);

            // Save once to get the ID and persist with temporary code
            Profesor profesorGuardado = profesorRepository.save(nuevoProfesor);

            // Generate and set the final codigo using the generated ID
            String codigoGenerado = String.format("PROF%03d", profesorGuardado.getId());
            profesorGuardado.setCodigo(codigoGenerado);

            // Save again to update with the final codigo
            return profesorRepository.save(profesorGuardado);
        }
    }

    /**
     * Obtiene el ID del profesor asociado a un usuario específico
     * @param userId ID del usuario
     * @return ID del profesor o null si no se encuentra
     */
    public Long obtenerProfesorIdPorUsuario(Integer userId) {
        if (userId == null) {
            return null;
        }
        
        Optional<Profesor> profesorOpt = profesorRepository.findByUserId(userId);
        return profesorOpt.map(Profesor::getId).orElse(null);
    }

    /**
     * Obtiene un profesor por su userId
     * @param userId ID del usuario
     * @return Profesor asociado al usuario o null si no se encuentra
     */
    public Profesor obtenerProfesorPorUsuario(Integer userId) {
        if (userId == null) {
            return null;
        }
        
        return profesorRepository.findByUserId(userId).orElse(null);
    }

    /**
     * Obtener perfil del profesor por userId
     */
    public Map<String, Object> obtenerPerfilProfesorPorUserId(Integer userId) {
        if (userId == null) {
            return null;
        }
        
        Optional<Profesor> profesorOpt = profesorRepository.findByUserId(userId);
        if (!profesorOpt.isPresent()) {
            return null;
        }
        
        Profesor profesor = profesorOpt.get();
        Map<String, Object> perfilProfesor = new HashMap<>();
        perfilProfesor.put("profesorId", profesor.getId());
        perfilProfesor.put("userId", userId);
        perfilProfesor.put("nombres", profesor.getNombres());
        perfilProfesor.put("apellidos", profesor.getApellidos());
        perfilProfesor.put("correo", profesor.getCorreo());
        perfilProfesor.put("departamento", profesor.getDepartamento() != null ? profesor.getDepartamento().getNombre() : null);
        
        return perfilProfesor;
    }

    /**
     * Obtener cursos asignados a un profesor
     */
    public List<CursoDTO> obtenerCursosDelProfesor(Long profesorId) {
        Optional<Profesor> profesorOpt = profesorRepository.findById(profesorId);
        if (!profesorOpt.isPresent()) {
            throw new RuntimeException("Profesor no encontrado con ID: " + profesorId);
        }
        
        Profesor profesor = profesorOpt.get();
        List<Curso> cursos = profesor.getCursos();
        
        if (cursos == null) {
            return List.of();
        }
        
        return cursos.stream()
            .map(curso -> new CursoDTO(
                curso.getId(), 
                curso.getNombre(), 
                curso.getDescripcion(), 
                null, null, null, null
            ))
            .collect(Collectors.toList());
    }

    /**
     * Obtener ID del profesor por su email/username
     * @param username Email/username del profesor
     * @return ID del profesor o null si no se encuentra
     */
    public Long obtenerIdPorUsername(String username) {
        if (username == null || username.isEmpty()) {
            return null;
        }
        
        Optional<Profesor> profesorOpt = profesorRepository.findByCorreo(username);
        return profesorOpt.map(Profesor::getId).orElse(null);
    }
}
