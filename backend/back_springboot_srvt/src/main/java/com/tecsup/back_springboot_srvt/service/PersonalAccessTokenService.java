package com.tecsup.back_springboot_srvt.service;

import com.tecsup.back_springboot_srvt.dto.CreatePersonalAccessTokenRequest;
import com.tecsup.back_springboot_srvt.dto.PersonalAccessTokenResponse;
import com.tecsup.back_springboot_srvt.model.PersonalAccessToken;
import com.tecsup.back_springboot_srvt.model.User;
import com.tecsup.back_springboot_srvt.repository.PersonalAccessTokenRepository;
import com.tecsup.back_springboot_srvt.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class PersonalAccessTokenService {
    
    @Autowired
    private PersonalAccessTokenRepository tokenRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Value("${app.pat.max-tokens-per-user:10}")
    private int maxTokensPerUser;
    
    @Value("${app.pat.default-expiration-days:365}")
    private int defaultExpirationDays;
    
    @Value("${app.pat.token-length:40}")
    private int tokenLength;
    
    private static final String TOKEN_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final String TOKEN_PREFIX = "tscp_";
    
    /**
     * Create a new personal access token for a user
     */
    public PersonalAccessTokenResponse createToken(Integer userId, CreatePersonalAccessTokenRequest request) {
        // Validate user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        
        // Check if user already has maximum number of tokens
        long activeTokenCount = tokenRepository.countByUserIdAndIsActiveTrue(userId);
        if (activeTokenCount >= maxTokensPerUser) {
            throw new IllegalStateException("Has alcanzado el límite máximo de tokens personales (" + maxTokensPerUser + ")");
        }
        
        // Check if token name already exists for this user
        if (tokenRepository.existsByNameAndUserIdAndIsActiveTrue(request.getName(), userId)) {
            throw new IllegalArgumentException("Ya existe un token con este nombre");
        }
        
        // Generate unique token
        String token = generateUniqueToken();
        
        // Calculate expiration date
        LocalDateTime expiresAt = null;
        if (request.getExpirationDays() != null && request.getExpirationDays() > 0) {
            expiresAt = LocalDateTime.now().plusDays(request.getExpirationDays());
        } else if (request.getExpirationDays() == null) {
            // Use default expiration
            expiresAt = LocalDateTime.now().plusDays(defaultExpirationDays);
        }
        // If expirationDays is 0 or negative, token never expires (expiresAt remains null)
        
        // Create and save token
        PersonalAccessToken personalAccessToken = new PersonalAccessToken(
                request.getName(), token, userId, expiresAt
        );
        
        personalAccessToken = tokenRepository.save(personalAccessToken);
        
        // Return response with full token (only time it's shown)
        PersonalAccessTokenResponse response = mapToResponse(personalAccessToken);
        response.setFullToken(token); // Only shown during creation
        response.setDescription(request.getDescription());
        
        return response;
    }
    
    /**
     * List all tokens for a user
     */
    @Transactional(readOnly = true)
    public List<PersonalAccessTokenResponse> getUserTokens(Integer userId) {
        List<PersonalAccessToken> tokens = tokenRepository.findByUserIdAndIsActiveTrueOrderByCreatedAtDesc(userId);
        return tokens.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Revoke a specific token
     */
    public void revokeToken(Integer userId, Long tokenId) {
        PersonalAccessToken token = tokenRepository.findById(tokenId)
                .orElseThrow(() -> new IllegalArgumentException("Token no encontrado"));
        
        if (!token.getUserId().equals(userId)) {
            throw new IllegalArgumentException("No tienes permiso para revocar este token");
        }
        
        if (!token.isActive()) {
            throw new IllegalArgumentException("El token ya está revocado");
        }
        
        token.revoke();
        tokenRepository.save(token);
    }
    
    /**
     * Revoke all tokens for a user
     */
    public int revokeAllTokens(Integer userId) {
        return tokenRepository.revokeAllTokensForUser(userId, LocalDateTime.now());
    }
    
    /**
     * Validate and authenticate using a personal access token
     */
    @Transactional
    public Optional<User> authenticateWithToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            return Optional.empty();
        }
        
        // Remove "Bearer " prefix if present
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        
        Optional<PersonalAccessToken> patOpt = tokenRepository.findByTokenAndIsActiveTrue(token);
        
        if (patOpt.isPresent()) {
            PersonalAccessToken pat = patOpt.get();
            
            // Check if token is expired
            if (pat.isExpired()) {
                return Optional.empty();
            }
            
            // Update last used timestamp
            pat.markAsUsed();
            tokenRepository.save(pat);
            
            // Return the user
            return userRepository.findById(pat.getUserId());
        }
        
        return Optional.empty();
    }
    
    /**
     * Clean up expired tokens
     */
    @Transactional
    public int cleanupExpiredTokens() {
        LocalDateTime now = LocalDateTime.now();
        
        // First, mark expired tokens as inactive
        List<PersonalAccessToken> expiredTokens = tokenRepository.findExpiredTokens(now);
        for (PersonalAccessToken token : expiredTokens) {
            token.revoke();
        }
        tokenRepository.saveAll(expiredTokens);
        
        // Optionally delete very old expired tokens (older than 30 days)
        LocalDateTime cutoff = now.minusDays(30);
        return tokenRepository.deleteExpiredTokens(cutoff);
    }
    
    /**
     * Generate a unique token string
     */
    private String generateUniqueToken() {
        SecureRandom random = new SecureRandom();
        String token;
        
        do {
            StringBuilder sb = new StringBuilder(TOKEN_PREFIX);
            for (int i = 0; i < tokenLength; i++) {
                sb.append(TOKEN_CHARS.charAt(random.nextInt(TOKEN_CHARS.length())));
            }
            token = sb.toString();
        } while (tokenRepository.findByTokenAndIsActiveTrue(token).isPresent());
        
        return token;
    }
    
    /**
     * Map PersonalAccessToken entity to response DTO
     */
    private PersonalAccessTokenResponse mapToResponse(PersonalAccessToken token) {
        PersonalAccessTokenResponse response = new PersonalAccessTokenResponse();
        response.setId(token.getId());
        response.setName(token.getName());
        response.setTokenPrefix(token.getTokenPrefix());
        response.setLastUsedAt(token.getLastUsedAt());
        response.setExpiresAt(token.getExpiresAt());
        response.setCreatedAt(token.getCreatedAt());
        response.setActive(token.isActive());
        response.setExpired(token.isExpired());
        
        return response;
    }
}