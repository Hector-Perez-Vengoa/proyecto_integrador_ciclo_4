package com.tecsup.back_springboot_srvt.controller;
import com.tecsup.back_springboot_srvt.model.Perfil;
import com.tecsup.back_springboot_srvt.model.User;
import com.tecsup.back_springboot_srvt.repository.PerfilRepository;
import com.tecsup.back_springboot_srvt.repository.UserRepository;
import com.tecsup.back_springboot_srvt.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/perfil")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8000"})
public class PerfilController {
    
    @Autowired
    private PerfilRepository perfilRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    @Value("${upload.directory:uploads/}")
    private String uploadDirectory;
    
    /**
     * Método helper para validar token JWT y extraer username
     */
    private String validarYExtraerUsername(String token) {
        try {
            String jwtToken = token.replace("Bearer ", "");
            String username = jwtUtils.getUserNameFromJwtToken(jwtToken);
            
            if (username == null || !jwtUtils.validateJwtToken(jwtToken)) {
                return null;
            }
            
            return username;
        } catch (Exception e) {
            return null;
        }
    }
    
    /**
     * Crear respuesta de error
     */
    private Map<String, Object> crearRespuestaError(String mensaje) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", mensaje);
        response.put("success", false);
        response.put("data", null);
        return response;
    }
    
    /**
     * Crear respuesta exitosa
     */
    private Map<String, Object> crearRespuestaExitosa(String mensaje, Object data) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", mensaje);
        response.put("success", true);
        response.put("data", data);
        return response;
    }
      /**
     * Convertir Perfil y User a Map para respuesta
     */
    private Map<String, Object> convertirPerfilAMap(Perfil perfil) {
        Map<String, Object> data = new HashMap<>();
        data.put("id", perfil.getId());
        data.put("biografia", perfil.getBiografia());
        data.put("ubicacion", perfil.getUbicacion());
        data.put("telefono", perfil.getTelefono());
        data.put("fechaNacimiento", perfil.getFechaNacimiento());
        data.put("sitioWeb", perfil.getSitioWeb());
        data.put("linkedin", perfil.getLinkedin());
        data.put("twitter", perfil.getTwitter());
        data.put("imagenPerfil", perfil.getImagenPerfil());
        data.put("fechaActualizacion", perfil.getFechaActualizacion());
        
        // Datos del usuario
        User user = perfil.getUser();
        if (user != null) {
            data.put("username", user.getUsername());
            data.put("email", user.getEmail());
            data.put("firstName", user.getFirstName());
            data.put("lastName", user.getLastName());
            String nombreCompleto = (user.getFirstName() != null ? user.getFirstName() : "") + " " + 
                                   (user.getLastName() != null ? user.getLastName() : "");
            data.put("nombreCompleto", nombreCompleto.trim());
        }
        
        return data;
    }
    
    /**
     * Obtener perfil del usuario autenticado
     */
    @GetMapping
    public ResponseEntity<?> obtenerPerfil(@RequestHeader("Authorization") String token) {
        try {
            String username = validarYExtraerUsername(token);
            
            if (username == null) {
                return ResponseEntity.status(401).body(crearRespuestaError("Token inválido o expirado"));
            }
            
            Optional<User> userOpt = userRepository.findByUsername(username);
            if (!userOpt.isPresent()) {
                return ResponseEntity.status(404).body(crearRespuestaError("Usuario no encontrado"));
            }
            
            User user = userOpt.get();
            
            // Buscar perfil, crear uno nuevo si no existe
            Optional<Perfil> perfilOpt = perfilRepository.findByUserId(user.getId());
            Perfil perfil;
            
            if (!perfilOpt.isPresent()) {
                // Crear nuevo perfil
                perfil = new Perfil();
                perfil.setUser(user);
                perfil = perfilRepository.save(perfil);
            } else {
                perfil = perfilOpt.get();
            }
            
            Map<String, Object> data = convertirPerfilAMap(perfil);
            return ResponseEntity.ok().body(crearRespuestaExitosa("Perfil obtenido correctamente", data));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(crearRespuestaError("Error al obtener perfil: " + e.getMessage()));
        }
    }
    
    /**
     * Actualizar perfil del usuario autenticado
     */
    @PutMapping
    public ResponseEntity<?> actualizarPerfil(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> perfilData) {
        try {
            String username = validarYExtraerUsername(token);
            
            if (username == null) {
                return ResponseEntity.status(401).body(crearRespuestaError("Token inválido o expirado"));
            }
            
            Optional<User> userOpt = userRepository.findByUsername(username);
            if (!userOpt.isPresent()) {
                return ResponseEntity.status(404).body(crearRespuestaError("Usuario no encontrado"));
            }
            
            User user = userOpt.get();
            
            // Actualizar datos del usuario
            if (perfilData.containsKey("firstName")) {
                user.setFirstName((String) perfilData.get("firstName"));
            }
            if (perfilData.containsKey("lastName")) {
                user.setLastName((String) perfilData.get("lastName"));
            }
            if (perfilData.containsKey("email")) {
                user.setEmail((String) perfilData.get("email"));
            }
            
            user = userRepository.save(user);
            
            // Buscar o crear perfil
            Optional<Perfil> perfilOpt = perfilRepository.findByUserId(user.getId());
            Perfil perfil;
            
            if (!perfilOpt.isPresent()) {
                perfil = new Perfil();
                perfil.setUser(user);
            } else {
                perfil = perfilOpt.get();
            }
              // Actualizar datos del perfil
            if (perfilData.containsKey("biografia")) {
                perfil.setBiografia((String) perfilData.get("biografia"));
            }
            if (perfilData.containsKey("ubicacion")) {
                perfil.setUbicacion((String) perfilData.get("ubicacion"));
            }
            if (perfilData.containsKey("telefono")) {
                perfil.setTelefono((String) perfilData.get("telefono"));
            }
            if (perfilData.containsKey("fechaNacimiento")) {
                // Convertir String a LocalDate si es necesario
                String fechaStr = (String) perfilData.get("fechaNacimiento");
                if (fechaStr != null && !fechaStr.isEmpty()) {
                    try {
                        perfil.setFechaNacimiento(LocalDate.parse(fechaStr));
                    } catch (Exception e) {
                        // Mantener la fecha actual si hay error en el parseo
                    }
                }
            }
            if (perfilData.containsKey("sitioWeb")) {
                perfil.setSitioWeb((String) perfilData.get("sitioWeb"));
            }
            if (perfilData.containsKey("linkedin")) {
                perfil.setLinkedin((String) perfilData.get("linkedin"));
            }
            if (perfilData.containsKey("twitter")) {
                perfil.setTwitter((String) perfilData.get("twitter"));
            }
            
            perfil = perfilRepository.save(perfil);
            
            Map<String, Object> data = convertirPerfilAMap(perfil);
            return ResponseEntity.ok().body(crearRespuestaExitosa("Perfil actualizado correctamente", data));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(crearRespuestaError("Error al actualizar perfil: " + e.getMessage()));
        }
    }
    
    /**
     * Verificar estado del perfil (si está completo)
     */
    @GetMapping("/estado")
    public ResponseEntity<?> verificarEstadoPerfil(@RequestHeader("Authorization") String token) {
        try {
            String username = validarYExtraerUsername(token);
            
            if (username == null) {
                return ResponseEntity.status(401).body(crearRespuestaError("Token inválido o expirado"));
            }
            
            Optional<User> userOpt = userRepository.findByUsername(username);
            if (!userOpt.isPresent()) {
                return ResponseEntity.status(404).body(crearRespuestaError("Usuario no encontrado"));
            }
            
            User user = userOpt.get();
            Optional<Perfil> perfilOpt = perfilRepository.findByUserId(user.getId());
            
            // Verificar completitud del perfil
            boolean tieneNombre = user.getFirstName() != null && !user.getFirstName().trim().isEmpty();
            boolean tieneApellido = user.getLastName() != null && !user.getLastName().trim().isEmpty();
            boolean tieneEmail = user.getEmail() != null && !user.getEmail().trim().isEmpty();
            boolean tienePerfil = perfilOpt.isPresent();
            
            boolean perfilCompleto = tieneNombre && tieneApellido && tieneEmail;
            
            Map<String, Object> estadoData = new HashMap<>();
            estadoData.put("perfilCompleto", perfilCompleto);
            estadoData.put("tieneNombre", tieneNombre);
            estadoData.put("tieneApellido", tieneApellido);
            estadoData.put("tieneEmail", tieneEmail);
            estadoData.put("tienePerfil", tienePerfil);            estadoData.put("username", user.getUsername());
            estadoData.put("email", user.getEmail());
            String nombreCompleto = (user.getFirstName() != null ? user.getFirstName() : "") + " " + 
                                   (user.getLastName() != null ? user.getLastName() : "");
            estadoData.put("nombreCompleto", nombreCompleto.trim());
            
            return ResponseEntity.ok().body(crearRespuestaExitosa("Estado del perfil verificado", estadoData));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(crearRespuestaError("Error al verificar estado del perfil: " + e.getMessage()));
        }
    }
    
    /**
     * Subir imagen de perfil
     */
    @PostMapping("/imagen")
    public ResponseEntity<?> subirImagenPerfil(
            @RequestHeader("Authorization") String token,
            @RequestParam("imagen") MultipartFile imagen) {
        try {
            String username = validarYExtraerUsername(token);
            
            if (username == null) {
                return ResponseEntity.status(401).body(crearRespuestaError("Token inválido o expirado"));
            }
            
            // Validar que sea una imagen
            if (imagen.isEmpty()) {
                return ResponseEntity.badRequest().body(crearRespuestaError("No se ha proporcionado ninguna imagen"));
            }
            
            String contentType = imagen.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body(crearRespuestaError("El archivo debe ser una imagen"));
            }
            
            // Validar tamaño (máximo 5MB)
            if (imagen.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest().body(crearRespuestaError("La imagen no debe superar los 5MB"));
            }
            
            Optional<User> userOpt = userRepository.findByUsername(username);
            if (!userOpt.isPresent()) {
                return ResponseEntity.status(404).body(crearRespuestaError("Usuario no encontrado"));
            }
            
            User user = userOpt.get();
            
            // Buscar o crear perfil
            Optional<Perfil> perfilOpt = perfilRepository.findByUserId(user.getId());
            Perfil perfil;
            
            if (!perfilOpt.isPresent()) {
                perfil = new Perfil();
                perfil.setUser(user);
                perfil = perfilRepository.save(perfil);
            } else {
                perfil = perfilOpt.get();
            }
              // Crear directorio específico para el usuario
            Path userUploadPath = Paths.get(uploadDirectory, "user_" + user.getId(), "profile");
            if (!Files.exists(userUploadPath)) {
                Files.createDirectories(userUploadPath);
            }
            
            // Eliminar imagen anterior si existe
            if (perfil.getImagenPerfil() != null && !perfil.getImagenPerfil().isEmpty()) {
                try {
                    String oldImagePath = perfil.getImagenPerfil();
                    if (oldImagePath.startsWith("/uploads/")) {
                        Path oldFilePath = Paths.get(uploadDirectory + oldImagePath.substring("/uploads/".length()));
                        Files.deleteIfExists(oldFilePath);
                    }
                } catch (Exception e) {
                    // Log error pero continúa con la subida
                    System.err.println("Error eliminando imagen anterior: " + e.getMessage());
                }
            }
            
            // Generar nombre único para el archivo
            String originalFilename = imagen.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".") ? 
                             originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
            String filename = "profile_" + System.currentTimeMillis() + extension;
            
            // Guardar archivo en la carpeta del usuario
            Path filePath = userUploadPath.resolve(filename);
            Files.copy(imagen.getInputStream(), filePath);
            
            // Actualizar perfil con nueva ruta de imagen
            String rutaImagen = "/uploads/user_" + user.getId() + "/profile/" + filename;
            perfil.setImagenPerfil(rutaImagen);
            perfil = perfilRepository.save(perfil);
            
            Map<String, Object> imagenData = new HashMap<>();
            imagenData.put("rutaImagen", rutaImagen);
            imagenData.put("filename", filename);
            
            return ResponseEntity.ok().body(crearRespuestaExitosa("Imagen de perfil actualizada correctamente", imagenData));
            
        } catch (IOException e) {
            return ResponseEntity.status(500).body(crearRespuestaError("Error al guardar la imagen: " + e.getMessage()));
        } catch (Exception e) {            return ResponseEntity.status(500).body(crearRespuestaError("Error al subir imagen: " + e.getMessage()));
        }
    }

    /**
     * Endpoint para servir imágenes estáticas
     */
    @GetMapping("/uploads/**")
    public ResponseEntity<Resource> serveFile(HttpServletRequest request) {
        try {
            // Extraer el path después de /api/perfil/uploads/
            String requestPath = request.getRequestURI();
            String filePath = requestPath.substring("/api/perfil/uploads/".length());
            
            // Construir la ruta completa del archivo
            Path fullPath = Paths.get(uploadDirectory).resolve(filePath).normalize();
            Resource resource = new UrlResource(fullPath.toUri());

            if (resource.exists() && resource.isReadable()) {
                String contentType = Files.probeContentType(fullPath);
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
