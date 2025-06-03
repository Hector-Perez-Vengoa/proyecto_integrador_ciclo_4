-- Script SQL para crear datos iniciales de Aulas Virtuales
-- Este script debe ejecutarse en MySQL después de crear la base de datos

USE proyecto_integrador;

-- Crear la tabla si no existe (este comando será ejecutado por Hibernate automáticamente)
-- CREATE TABLE IF NOT EXISTS aula_virtual (
--     id BIGINT AUTO_INCREMENT PRIMARY KEY,
--     codigo VARCHAR(50) UNIQUE NOT NULL,
--     profesor INT,
--     curso INT,
--     estado VARCHAR(20) NOT NULL DEFAULT 'disponible',
--     hora_inicio TIME,
--     hora_fin TIME,
--     fecha_reserva DATE,
--     motivo_reserva TEXT,
--     fecha_creacion DATE NOT NULL DEFAULT (CURRENT_DATE)
-- );

-- Insertar datos de ejemplo
INSERT IGNORE INTO aula_virtual (codigo, estado, fecha_creacion) VALUES
('AV-001', 'disponible', CURDATE()),
('AV-002', 'disponible', CURDATE()),
('AV-003', 'ocupada', CURDATE()),
('AV-004', 'disponible', CURDATE()),
('AV-005', 'mantenimiento', CURDATE()),
('AV-006', 'disponible', CURDATE()),
('AV-007', 'disponible', CURDATE()),
('AV-008', 'ocupada', CURDATE()),
('AV-009', 'disponible', CURDATE()),
('AV-010', 'disponible', CURDATE());

-- Agregar algunas reservas de ejemplo
UPDATE aula_virtual SET 
    profesor = 1, 
    curso = 101, 
    hora_inicio = '08:00:00', 
    hora_fin = '10:00:00', 
    fecha_reserva = CURDATE(), 
    motivo_reserva = 'Clase de Programación Web'
WHERE codigo = 'AV-003';

UPDATE aula_virtual SET 
    profesor = 2, 
    curso = 102, 
    hora_inicio = '14:00:00', 
    hora_fin = '16:00:00', 
    fecha_reserva = CURDATE(), 
    motivo_reserva = 'Laboratorio de Base de Datos'
WHERE codigo = 'AV-008';

UPDATE aula_virtual SET 
    motivo_reserva = 'Mantenimiento programado de equipos'
WHERE codigo = 'AV-005';
