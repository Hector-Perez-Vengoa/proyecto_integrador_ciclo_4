package com.tecsup.back_springboot_srvt.service;

import com.tecsup.back_springboot_srvt.dto.CreatePersonalAccessTokenRequest;
import com.tecsup.back_springboot_srvt.dto.PersonalAccessTokenResponse;
import com.tecsup.back_springboot_srvt.model.PersonalAccessToken;
import com.tecsup.back_springboot_srvt.model.User;
import com.tecsup.back_springboot_srvt.repository.PersonalAccessTokenRepository;
import com.tecsup.back_springboot_srvt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PersonalAccessTokenServiceTest {

    @Mock
    private PersonalAccessTokenRepository tokenRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private PersonalAccessTokenService tokenService;

    private User testUser;
    private PersonalAccessToken testToken;

    @BeforeEach
    void setUp() {
        // Set configuration values using reflection
        ReflectionTestUtils.setField(tokenService, "maxTokensPerUser", 10);
        ReflectionTestUtils.setField(tokenService, "defaultExpirationDays", 365);
        ReflectionTestUtils.setField(tokenService, "tokenLength", 40);
        
        testUser = new User();
        testUser.setId(1);
        testUser.setEmail("test@tecsup.edu.pe");
        testUser.setUsername("testuser");
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        
        testToken = new PersonalAccessToken();
        testToken.setId(1L);
        testToken.setName("Test Token");
        testToken.setToken("tscp_1234567890abcdef");
        testToken.setUserId(1);
        testToken.setCreatedAt(LocalDateTime.now());
        testToken.setActive(true);
    }

    @Test
    void createToken_Success() {
        // Arrange
        CreatePersonalAccessTokenRequest request = new CreatePersonalAccessTokenRequest();
        request.setName("My API Token");
        request.setExpirationDays(30);

        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(tokenRepository.countByUserIdAndIsActiveTrue(1)).thenReturn(2L);
        when(tokenRepository.existsByNameAndUserIdAndIsActiveTrue("My API Token", 1)).thenReturn(false);
        when(tokenRepository.findByTokenAndIsActiveTrue(anyString())).thenReturn(Optional.empty());
        when(tokenRepository.save(any(PersonalAccessToken.class))).thenReturn(testToken);

        // Act
        PersonalAccessTokenResponse response = tokenService.createToken(1, request);

        // Assert
        assertNotNull(response);
        assertEquals("Test Token", response.getName());
        assertNotNull(response.getFullToken());
        assertTrue(response.getFullToken().startsWith("tscp_"));
        verify(tokenRepository).save(any(PersonalAccessToken.class));
    }

    @Test
    void createToken_UserNotFound() {
        // Arrange
        CreatePersonalAccessTokenRequest request = new CreatePersonalAccessTokenRequest();
        request.setName("My API Token");

        when(userRepository.findById(999)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            tokenService.createToken(999, request);
        });
    }

    @Test
    void createToken_MaxTokensReached() {
        // Arrange
        CreatePersonalAccessTokenRequest request = new CreatePersonalAccessTokenRequest();
        request.setName("My API Token");

        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(tokenRepository.countByUserIdAndIsActiveTrue(1)).thenReturn(10L); // Max limit

        // Act & Assert
        assertThrows(IllegalStateException.class, () -> {
            tokenService.createToken(1, request);
        });
    }

    @Test
    void createToken_DuplicateName() {
        // Arrange
        CreatePersonalAccessTokenRequest request = new CreatePersonalAccessTokenRequest();
        request.setName("Existing Token");

        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(tokenRepository.countByUserIdAndIsActiveTrue(1)).thenReturn(2L);
        when(tokenRepository.existsByNameAndUserIdAndIsActiveTrue("Existing Token", 1)).thenReturn(true);

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            tokenService.createToken(1, request);
        });
    }

    @Test
    void getUserTokens_Success() {
        // Arrange
        List<PersonalAccessToken> tokens = Arrays.asList(testToken);
        when(tokenRepository.findByUserIdAndIsActiveTrueOrderByCreatedAtDesc(1)).thenReturn(tokens);

        // Act
        List<PersonalAccessTokenResponse> response = tokenService.getUserTokens(1);

        // Assert
        assertNotNull(response);
        assertEquals(1, response.size());
        assertEquals("Test Token", response.get(0).getName());
        assertNull(response.get(0).getFullToken()); // Full token should not be returned in list
    }

    @Test
    void revokeToken_Success() {
        // Arrange
        when(tokenRepository.findById(1L)).thenReturn(Optional.of(testToken));
        when(tokenRepository.save(any(PersonalAccessToken.class))).thenReturn(testToken);

        // Act
        assertDoesNotThrow(() -> {
            tokenService.revokeToken(1, 1L);
        });

        // Assert
        verify(tokenRepository).save(testToken);
        assertFalse(testToken.isActive());
    }

    @Test
    void revokeToken_TokenNotFound() {
        // Arrange
        when(tokenRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            tokenService.revokeToken(1, 999L);
        });
    }

    @Test
    void revokeToken_UnauthorizedUser() {
        // Arrange
        testToken.setUserId(2); // Different user
        when(tokenRepository.findById(1L)).thenReturn(Optional.of(testToken));

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            tokenService.revokeToken(1, 1L);
        });
    }

    @Test
    void authenticateWithToken_Success() {
        // Arrange
        String token = "tscp_1234567890abcdef";
        when(tokenRepository.findByTokenAndIsActiveTrue(token)).thenReturn(Optional.of(testToken));
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(tokenRepository.save(any(PersonalAccessToken.class))).thenReturn(testToken);

        // Act
        Optional<User> result = tokenService.authenticateWithToken(token);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(testUser.getEmail(), result.get().getEmail());
        verify(tokenRepository).save(testToken); // Verify last used timestamp is updated
    }

    @Test
    void authenticateWithToken_TokenNotFound() {
        // Arrange
        String token = "invalid_token";
        when(tokenRepository.findByTokenAndIsActiveTrue(token)).thenReturn(Optional.empty());

        // Act
        Optional<User> result = tokenService.authenticateWithToken(token);

        // Assert
        assertFalse(result.isPresent());
    }

    @Test
    void authenticateWithToken_ExpiredToken() {
        // Arrange
        String token = "tscp_1234567890abcdef";
        testToken.setExpiresAt(LocalDateTime.now().minusDays(1)); // Expired
        when(tokenRepository.findByTokenAndIsActiveTrue(token)).thenReturn(Optional.of(testToken));

        // Act
        Optional<User> result = tokenService.authenticateWithToken(token);

        // Assert
        assertFalse(result.isPresent());
    }

    @Test
    void authenticateWithToken_WithBearerPrefix() {
        // Arrange
        String tokenWithBearer = "Bearer tscp_1234567890abcdef";
        String actualToken = "tscp_1234567890abcdef";
        when(tokenRepository.findByTokenAndIsActiveTrue(actualToken)).thenReturn(Optional.of(testToken));
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(tokenRepository.save(any(PersonalAccessToken.class))).thenReturn(testToken);

        // Act
        Optional<User> result = tokenService.authenticateWithToken(tokenWithBearer);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(testUser.getEmail(), result.get().getEmail());
    }
}