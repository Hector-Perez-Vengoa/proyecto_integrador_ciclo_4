package com.tecsup.back_springboot_srvt.service;

import com.tecsup.back_springboot_srvt.model.Perfil;
import com.tecsup.back_springboot_srvt.model.User;
import com.tecsup.back_springboot_srvt.repository.PerfilRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Servicio para gestionar imágenes de perfil basadas en Google
 * Sincroniza automáticamente las fotos de perfil de Google
 */
@Service
public class GoogleProfileImageService {

    @Autowired
    private PerfilRepository perfilRepository;

    /**
     * Actualiza la imagen de perfil del usuario con la URL de Google
     * @param user Usuario al que actualizar
     * @param googlePictureUrl URL de la imagen de Google
     * @return true si se actualizó correctamente
     */
    @Transactional
    public boolean actualizarImagenPerfil(User user, String googlePictureUrl) {
        if (user == null) {
            return false;
        }

        try {
            // Buscar o crear perfil
            Perfil perfil = perfilRepository.findByUser(user).orElseGet(() -> {
                Perfil nuevoPerfil = new Perfil(user);
                return perfilRepository.save(nuevoPerfil);
            });

            // Actualizar la imagen de perfil con la URL de Google
            String imagenUrl = procesarUrlGooglePicture(googlePictureUrl);
            perfil.setImagenPerfil(imagenUrl);
            perfil.setFechaActualizacion(LocalDateTime.now());
            
            perfilRepository.save(perfil);
            
            System.out.println("✅ [PROFILE IMAGE] Imagen de perfil actualizada para usuario: " + user.getEmail());
            return true;
            
        } catch (Exception e) {
            System.err.println("❌ [PROFILE IMAGE] Error al actualizar imagen de perfil: " + e.getMessage());
            return false;
        }
    }

    /**
     * Procesa la URL de la imagen de Google para optimizarla
     * @param googlePictureUrl URL original de Google
     * @return URL procesada y optimizada
     */
    private String procesarUrlGooglePicture(String googlePictureUrl) {
        if (googlePictureUrl == null || googlePictureUrl.trim().isEmpty()) {
            return null;
        }

        // Google permite modificar el tamaño de la imagen agregando parámetros
        // Ejemplo: https://lh3.googleusercontent.com/a/default-user=s96-c
        // s96-c = size 96px, crop to square
        
        String url = googlePictureUrl.trim();
        
        // Si la URL ya tiene parámetros de tamaño, los removemos para agregar los nuestros
        if (url.contains("=s")) {
            url = url.substring(0, url.lastIndexOf("=s"));
        }
        
        // Agregamos parámetros para una imagen de 200px cuadrada
        if (!url.endsWith("=")) {
            url += "=s200-c";
        } else {
            url += "s200-c";
        }
        
        return url;
    }

    /**
     * Obtiene la URL de la imagen de perfil actual del usuario
     * @param user Usuario
     * @return URL de la imagen o null si no tiene
     */
    public String obtenerImagenPerfil(User user) {
        if (user == null) {
            return null;
        }

        return perfilRepository.findByUser(user)
                .map(Perfil::getImagenPerfil)
                .orElse(null);
    }

    /**
     * Genera una URL de imagen por defecto basada en las iniciales del usuario
     * @param user Usuario
     * @return URL de imagen generada
     */
    public String generarImagenPorDefecto(User user) {
        if (user == null) {
            return "https://ui-avatars.com/api/?name=User&background=2c5282&color=ffffff&size=200";
        }

        String nombre = "";
        if (user.getFirstName() != null && !user.getFirstName().isEmpty()) {
            nombre += user.getFirstName().charAt(0);
        }
        if (user.getLastName() != null && !user.getLastName().isEmpty()) {
            nombre += user.getLastName().charAt(0);
        }
        
        if (nombre.isEmpty()) {
            nombre = user.getEmail() != null ? user.getEmail().substring(0, 1).toUpperCase() : "U";
        }

        // Usamos UI Avatars como fallback - genera imágenes con iniciales
        return String.format("https://ui-avatars.com/api/?name=%s&background=2c5282&color=ffffff&size=200&bold=true", 
                            nombre.toUpperCase());
    }

    /**
     * Verifica si una URL de imagen de Google es válida
     * @param url URL a verificar
     * @return true si es válida
     */
    public boolean esUrlGoogleValida(String url) {
        if (url == null || url.trim().isEmpty()) {
            return false;
        }
        
        return url.contains("googleusercontent.com") || 
               url.contains("google.com") ||
               url.contains("ui-avatars.com"); // Incluimos nuestro fallback
    }
}
