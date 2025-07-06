-- Script para insertar reglamento único del sistema
-- Ejecutar en la base de datos MySQL/PostgreSQL

-- 1. Primero crear la tabla si no existe
CREATE TABLE IF NOT EXISTS reglamento (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    tipo VARCHAR(20),
    version VARCHAR(20),
    estado VARCHAR(20),
    ruta_archivo VARCHAR(500),
    tamaño_archivo BIGINT,
    autor VARCHAR(100),
    es_obligatorio BOOLEAN DEFAULT FALSE,
    contador_visualizaciones BIGINT DEFAULT 0,
    contador_descargas BIGINT DEFAULT 0,
    fecha_creacion DATETIME,
    fecha_modificacion DATETIME,
    metadatos TEXT
);

-- 2. Insertar el reglamento principal del sistema
INSERT INTO reglamento (
    titulo,
    descripcion,
    tipo,
    version,
    estado,
    ruta_archivo,
    tamaño_archivo,
    autor,
    es_obligatorio,
    contador_visualizaciones,
    contador_descargas,
    fecha_creacion,
    fecha_modificacion,
    metadatos
) VALUES (
    'Reglamento de Aulas Virtuales - TECSUP',
    'Reglamento oficial para el uso y reserva de aulas virtuales en la institución. Contiene las normas, procedimientos y sanciones aplicables.',
    'general',
    '1.0',
    'activo',
    '/uploads/reglamentos/reglamento_aulas_virtuales_2025.pdf',  -- Actualizar con la ruta real
    1048576,  -- Tamaño en bytes (1MB como ejemplo, actualizar con el tamaño real)
    'Administración TECSUP',
    TRUE,  -- Es obligatorio leer
    0,
    0,
    NOW(),
    NOW(),
    '{"categoria": "institucional", "vigencia": "2025", "aplicabilidad": "todas_sedes"}'
);

-- 3. Verificar que se insertó correctamente
SELECT 
    id,
    titulo,
    tipo,
    version,
    estado,
    ruta_archivo,
    autor,
    es_obligatorio,
    fecha_creacion
FROM reglamento 
WHERE tipo = 'general' AND estado = 'activo';

-- 4. Script para actualizar el reglamento si ya existe
-- (Usar solo si necesitas actualizar un reglamento existente)
/*
UPDATE reglamento 
SET 
    titulo = 'Reglamento de Aulas Virtuales - TECSUP (Actualizado)',
    descripcion = 'Reglamento oficial actualizado para el uso y reserva de aulas virtuales.',
    version = '1.1',
    ruta_archivo = '/uploads/reglamentos/reglamento_aulas_virtuales_2025_v2.pdf',
    tamaño_archivo = 1200000,  -- Nuevo tamaño
    fecha_modificacion = NOW(),
    metadatos = '{"categoria": "institucional", "vigencia": "2025", "version_actualizada": true}'
WHERE tipo = 'general' AND estado = 'activo';
*/
