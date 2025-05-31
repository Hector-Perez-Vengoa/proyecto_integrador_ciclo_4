package com.tecsup.back_springboot_srvt.security;

import com.tecsup.back_springboot_srvt.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Objects;

public class UserDetailsImpl implements UserDetails {
    
    private Integer id;
    private String username;
    private String email;
    private String password;
    private boolean active;
    private Collection<? extends GrantedAuthority> authorities;
    
    public UserDetailsImpl(Integer id, String username, String email, String password, 
                          boolean active, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.active = active;
        this.authorities = authorities;
    }
    
    public static UserDetailsImpl build(User user) {
        List<GrantedAuthority> authorities = List.of(
            new SimpleGrantedAuthority("ROLE_USER")
        );
        
        if (user.isStaff()) {
            authorities.add(new SimpleGrantedAuthority("ROLE_STAFF"));
        }
        
        if (user.isSuperuser()) {
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        }
        
        return new UserDetailsImpl(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getPassword(),
            user.isActive(),
            authorities
        );
    }
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }
    
    @Override
    public String getPassword() {
        return password;
    }
    
    @Override
    public String getUsername() {
        return username;
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    
    @Override
    public boolean isEnabled() {
        return active;
    }
      public Integer getId() {
        return id;
    }
    
    public String getEmail() {
        return email;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserDetailsImpl that = (UserDetailsImpl) o;
        return Objects.equals(id, that.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}