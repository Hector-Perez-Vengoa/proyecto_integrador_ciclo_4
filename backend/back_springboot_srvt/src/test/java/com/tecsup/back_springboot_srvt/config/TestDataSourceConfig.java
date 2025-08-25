package com.tecsup.back_springboot_srvt.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;

import javax.sql.DataSource;

@TestConfiguration
@Profile("test")
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class TestDataSourceConfig {

    @Bean
    @Primary
    public JdbcTemplate testJdbcTemplate(DataSource dataSource) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        
        // Desactivar verificación de claves foráneas para tests
        try {
            jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 0");
        } catch (Exception e) {
            // Ignorar si no se puede ejecutar (H2 no soporta este comando)
            System.out.println("No se pudo desactivar foreign key checks: " + e.getMessage());
        }
        
        return jdbcTemplate;
    }
}
