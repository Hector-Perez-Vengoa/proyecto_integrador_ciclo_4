package com.tecsup.back_springboot_srvt.repository;

import com.tecsup.back_springboot_srvt.model.PersonalAccessToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PersonalAccessTokenRepository extends JpaRepository<PersonalAccessToken, Long> {
    
    /**
     * Find a valid token by token string
     */
    Optional<PersonalAccessToken> findByTokenAndIsActiveTrue(String token);
    
    /**
     * Find all active tokens for a user
     */
    List<PersonalAccessToken> findByUserIdAndIsActiveTrueOrderByCreatedAtDesc(Integer userId);
    
    /**
     * Find all tokens for a user (including inactive)
     */
    List<PersonalAccessToken> findByUserIdOrderByCreatedAtDesc(Integer userId);
    
    /**
     * Check if a token name exists for a user
     */
    boolean existsByNameAndUserIdAndIsActiveTrue(String name, Integer userId);
    
    /**
     * Count active tokens for a user
     */
    long countByUserIdAndIsActiveTrue(Integer userId);
    
    /**
     * Find expired tokens that should be cleaned up
     */
    @Query("SELECT pat FROM PersonalAccessToken pat WHERE pat.expiresAt IS NOT NULL AND pat.expiresAt < :now AND pat.isActive = true")
    List<PersonalAccessToken> findExpiredTokens(@Param("now") LocalDateTime now);
    
    /**
     * Revoke all tokens for a user
     */
    @Modifying
    @Query("UPDATE PersonalAccessToken pat SET pat.isActive = false, pat.updatedAt = :now WHERE pat.userId = :userId AND pat.isActive = true")
    int revokeAllTokensForUser(@Param("userId") Integer userId, @Param("now") LocalDateTime now);
    
    /**
     * Update last used timestamp for a token
     */
    @Modifying
    @Query("UPDATE PersonalAccessToken pat SET pat.lastUsedAt = :lastUsedAt, pat.updatedAt = :updatedAt WHERE pat.id = :id")
    int updateLastUsed(@Param("id") Long id, @Param("lastUsedAt") LocalDateTime lastUsedAt, @Param("updatedAt") LocalDateTime updatedAt);
    
    /**
     * Clean up expired tokens (permanent deletion)
     */
    @Modifying
    @Query("DELETE FROM PersonalAccessToken pat WHERE pat.expiresAt IS NOT NULL AND pat.expiresAt < :cutoffDate")
    int deleteExpiredTokens(@Param("cutoffDate") LocalDateTime cutoffDate);
}