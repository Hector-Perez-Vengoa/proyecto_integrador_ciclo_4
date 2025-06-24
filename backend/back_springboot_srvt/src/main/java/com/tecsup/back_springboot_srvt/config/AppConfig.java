package com.tecsup.back_springboot_srvt.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.web.client.RestTemplate;

import java.util.concurrent.Executor;

@Configuration
@EnableAsync
public class AppConfig {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
    
    /**
     * Configuración del pool de threads para tareas asíncronas
     * Usado principalmente para el envío de notificaciones por email
     */
    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2); // Número mínimo de threads
        executor.setMaxPoolSize(5);  // Número máximo de threads
        executor.setQueueCapacity(100); // Capacidad de la cola de tareas
        executor.setThreadNamePrefix("AsyncEmail-"); // Prefijo para nombres de threads
        executor.setWaitForTasksToCompleteOnShutdown(true); // Esperar tareas al cerrar
        executor.setAwaitTerminationSeconds(60); // Tiempo máximo de espera al cerrar
        executor.initialize();
        return executor;
    }
}