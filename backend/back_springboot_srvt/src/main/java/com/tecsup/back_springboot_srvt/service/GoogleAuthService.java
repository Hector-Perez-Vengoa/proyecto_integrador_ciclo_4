package com.tecsup.back_springboot_srvt.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class GoogleAuthService {

    @Value("${app.google.clientId}")
    private String googleClientId;
    
    public GoogleUserInfo verifyGoogleToken(String idTokenString) throws Exception {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(googleClientId))
                .build();
                
            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                  String email = payload.getEmail();
                String givenName = (String) payload.get("given_name");
                String familyName = (String) payload.get("family_name");
                String picture = (String) payload.get("picture"); // URL de la foto de perfil
                
                return new GoogleUserInfo(email, givenName, familyName, picture);
            } else {
                throw new Exception("Token de Google inválido");
            }
        } catch (Exception e) {
            throw new Exception("Error al verificar token de Google: " + e.getMessage());
        }
    }
      // Clase interna para la información de usuario de Google
    public static class GoogleUserInfo {
        private final String email;
        private final String givenName;
        private final String familyName;
        private final String picture; // URL de la foto de perfil
        
        public GoogleUserInfo(String email, String givenName, String familyName, String picture) {
            this.email = email;
            this.givenName = givenName;
            this.familyName = familyName;
            this.picture = picture;
        }
        
        public String getEmail() {
            return email;
        }
        
        public String getGivenName() {
            return givenName;
        }
        
        public String getFamilyName() {
            return familyName;
        }
        
        public String getPicture() {
            return picture;
        }
    }
}