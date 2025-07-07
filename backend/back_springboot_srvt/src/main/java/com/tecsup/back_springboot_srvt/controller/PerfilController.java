package com.tecsup.back_springboot_srvt.controller;

import com.tecsup.back_springboot_srvt.dto.*;
import com.tecsup.back_springboot_srvt.service.PerfilService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/perfil")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8000"})
public class PerfilController {
    
    @Autowired
    private PerfilService perfilService;
    
    @GetMapping
    public ResponseEntity<StandardApiResponse<PerfilResponse>> obtenerPerfil(
            @RequestHeader("Authorization") String token) {
        try {
            PerfilResponse perfil = perfilService.obtenerPerfilConAuth(token);
            return ResponseEntity.ok(StandardApiResponse.success("Perfil obtenido correctamente", perfil));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(StandardApiResponse.error(e.getMessage()));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("no encontrado")) {
                return ResponseEntity.status(404).body(StandardApiResponse.error(e.getMessage()));
            }
            return ResponseEntity.status(500).body(StandardApiResponse.error("Error interno: " + e.getMessage()));
        }
    }
    
    @PutMapping
    public ResponseEntity<StandardApiResponse<PerfilResponse>> actualizarPerfil(
            @RequestHeader("Authorization") String token, 
            @RequestBody ActualizarPerfilRequest request) {
        try {
            PerfilResponse perfil = perfilService.actualizarPerfilConAuth(token, request);
            return ResponseEntity.ok(StandardApiResponse.success("Perfil actualizado correctamente", perfil));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(StandardApiResponse.error(e.getMessage()));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("no encontrado")) {
                return ResponseEntity.status(404).body(StandardApiResponse.error(e.getMessage()));
            }
            return ResponseEntity.status(500).body(StandardApiResponse.error("Error interno: " + e.getMessage()));
        }
    }

    @PostMapping("/imagen/sincronizar") 
    public ResponseEntity<StandardApiResponse<ImagenPerfilResponse>> sincronizarImagenPerfil(
            @RequestHeader("Authorization") String token) {
        try {
            ImagenPerfilResponse imagen = perfilService.sincronizarImagenPerfilConAuth(token);
            return ResponseEntity.ok(StandardApiResponse.success("Imagen de perfil procesada", imagen));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(StandardApiResponse.error(e.getMessage()));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("no encontrado")) {
                return ResponseEntity.status(404).body(StandardApiResponse.error(e.getMessage()));
            }
            return ResponseEntity.status(500).body(StandardApiResponse.error("Error interno: " + e.getMessage()));
        }
    }

    @GetMapping("/departamentos")
    public ResponseEntity<StandardApiResponse<List<DepartamentoDTO>>> listarDepartamentos() {
        try {
            List<DepartamentoDTO> departamentos = perfilService.listarDepartamentos();
            return ResponseEntity.ok(StandardApiResponse.success("Departamentos obtenidos", departamentos));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(StandardApiResponse.error("Error al obtener departamentos: " + e.getMessage()));
        }
    }

    @GetMapping("/carreras")
    public ResponseEntity<StandardApiResponse<List<CarreraDTO>>> listarCarreras() {
        try {
            List<CarreraDTO> carreras = perfilService.listarCarreras();
            return ResponseEntity.ok(StandardApiResponse.success("Carreras obtenidas", carreras));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(StandardApiResponse.error("Error al obtener carreras: " + e.getMessage()));
        }
    }

    @GetMapping("/cursos")
    public ResponseEntity<StandardApiResponse<List<CursoDTO>>> listarCursos() {
        try {
            List<CursoDTO> cursos = perfilService.listarCursos();
            return ResponseEntity.ok(StandardApiResponse.success("Cursos obtenidos", cursos));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(StandardApiResponse.error("Error al obtener cursos: " + e.getMessage()));
        }
    }

    @GetMapping("/carreras/departamento/{departamentoId}")
    public ResponseEntity<StandardApiResponse<List<CarreraDTO>>> listarCarrerasPorDepartamento(
            @PathVariable Long departamentoId) {
        try {
            List<CarreraDTO> carreras = perfilService.listarCarrerasPorDepartamento(departamentoId);
            return ResponseEntity.ok(StandardApiResponse.success("Carreras obtenidas por departamento", carreras));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(StandardApiResponse.error("Error al obtener carreras por departamento: " + e.getMessage()));
        }
    }

    @GetMapping("/cursos/carrera/{carreraId}")
    public ResponseEntity<StandardApiResponse<List<CursoDTO>>> listarCursosPorCarrera(
            @PathVariable Long carreraId) {
        try {
            List<CursoDTO> cursos = perfilService.listarCursosPorCarrera(carreraId);
            return ResponseEntity.ok(StandardApiResponse.success("Cursos obtenidos por carrera", cursos));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(StandardApiResponse.error("Error al obtener cursos por carrera: " + e.getMessage()));
        }
    }
    
    @PostMapping("/cursos/carreras")
    public ResponseEntity<StandardApiResponse<List<CursoDTO>>> listarCursosPorCarreras(
            @RequestBody List<Long> carreraIds) {
        try {
            List<CursoDTO> cursos = perfilService.listarCursosPorCarreras(carreraIds);
            return ResponseEntity.ok(StandardApiResponse.success("Cursos obtenidos por carreras", cursos));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(StandardApiResponse.error("Error al obtener cursos por carreras: " + e.getMessage()));
        }
    }
    
    /**
     * Obtener perfil de usuario por ID - nuevo endpoint para compatibilidad con frontend
     */
    @GetMapping("/usuario/{userId}")
    public ResponseEntity<StandardApiResponse<Map<String, Object>>> obtenerPerfilUsuario(
            @PathVariable Integer userId) {
        try {
            PerfilResponse perfil = perfilService.obtenerPerfilPorUserId(userId);
            
            Map<String, Object> perfilData = new HashMap<>();
            perfilData.put("userId", userId);
            perfilData.put("nombre", perfil.getFirstName());
            perfilData.put("apellidos", perfil.getLastName());
            perfilData.put("email", perfil.getEmail());
            perfilData.put("fechaNacimiento", perfil.getFechaNacimiento());
            
            return ResponseEntity.ok(StandardApiResponse.success("Perfil obtenido exitosamente", perfilData));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(StandardApiResponse.error("Perfil no encontrado: " + e.getMessage()));
        }
    }

    @GetMapping("/mis-cursos")
    public ResponseEntity<StandardApiResponse<List<CursoDTO>>> obtenerMisCursos(
            @RequestHeader("Authorization") String token) {
        try {
            List<CursoDTO> cursos = perfilService.obtenerCursosDelUsuario(token);
            return ResponseEntity.ok(StandardApiResponse.success("Cursos del usuario obtenidos", cursos));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(StandardApiResponse.error(e.getMessage()));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("no encontrado")) {
                return ResponseEntity.status(404).body(StandardApiResponse.error(e.getMessage()));
            }
            return ResponseEntity.status(500).body(StandardApiResponse.error("Error interno: " + e.getMessage()));
        }
    }
}
