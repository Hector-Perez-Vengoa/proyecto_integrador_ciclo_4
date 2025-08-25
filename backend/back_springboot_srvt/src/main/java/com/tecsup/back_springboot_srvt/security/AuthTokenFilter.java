// filepath: c:\Users\Luis\Tecsup\Proyecto Integrador 2025\proyecto_integrador_ciclo_4\backend\back_springboot_srvt\src\main\java\com\tecsup\back_springboot_srvt\security\AuthTokenFilter.java
package com.tecsup.back_springboot_srvt.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import com.tecsup.back_springboot_srvt.service.UserDetailsServiceImpl;
import com.tecsup.back_springboot_srvt.service.PersonalAccessTokenService;
import com.tecsup.back_springboot_srvt.model.User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

public class AuthTokenFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;
    
    @Autowired
    private PersonalAccessTokenService personalAccessTokenService;

    private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        return path.startsWith("/api/auth/") || 
               path.startsWith("/api/test/") || 
               path.startsWith("/api/public/") ||
               path.equals("/error") ||
               path.startsWith("/actuator/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String authToken = parseAuthToken(request);
            
            if (authToken != null) {
                // Try JWT authentication first
                if (authenticateWithJWT(authToken)) {
                    // JWT authentication successful
                } else {
                    // Try Personal Access Token authentication
                    authenticateWithPAT(authToken, request);
                }
            }
        } catch (Exception e) {
            logger.error("No se puede establecer la autenticación del usuario: {}", e);
        }

        filterChain.doFilter(request, response);
    }
    
    /**
     * Attempt authentication using JWT token
     */
    private boolean authenticateWithJWT(String token) {
        try {
            if (jwtUtils.validateJwtToken(token)) {
                String username = jwtUtils.getUserNameFromJwtToken(token);
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
                
                return true;
            }
        } catch (Exception e) {
            logger.debug("JWT authentication failed: {}", e.getMessage());
        }
        return false;
    }
    
    /**
     * Attempt authentication using Personal Access Token
     */
    private boolean authenticateWithPAT(String token, HttpServletRequest request) {
        try {
            Optional<User> userOpt = personalAccessTokenService.authenticateWithToken(token);
            
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
                
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                SecurityContextHolder.getContext().setAuthentication(authentication);
                
                logger.debug("Personal Access Token authentication successful for user: {}", user.getEmail());
                return true;
            }
        } catch (Exception e) {
            logger.debug("Personal Access Token authentication failed: {}", e.getMessage());
        }
        return false;
    }

    private String parseAuthToken(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }

        return null;
    }
}