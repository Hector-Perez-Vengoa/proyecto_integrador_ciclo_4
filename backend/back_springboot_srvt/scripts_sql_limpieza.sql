-- =====================================================================
-- SCRIPT DE LIMPIEZA: ELIMINAR REFERENCIAS A PROFESOR Y USAR SOLO USER
-- =====================================================================

-- PASO 1: Hacer backup de datos importantes (EJECUTAR PRIMERO)
-- =====================================================================

-- Crear tabla temporal para backup de reservas importantes
CREATE TABLE IF NOT EXISTS reservadb_backup AS 
SELECT * FROM reservadb WHERE fecha_reserva >= CURDATE();

-- PASO 2: Eliminar restricciones de clave foránea relacionadas con profesor_id
-- =====================================================================

-- Primero, verificar y eliminar constraints de foreign key
SET FOREIGN_KEY_CHECKS = 0;

-- Eliminar constraint de profesor_id en reservadb si existe
ALTER TABLE reservadb DROP FOREIGN KEY IF EXISTS reservadb_ibfk_profesor;
ALTER TABLE reservadb DROP FOREIGN KEY IF EXISTS fk_reserva_profesor;
ALTER TABLE reservadb DROP FOREIGN KEY IF EXISTS reservadb_profesor_id_foreign;

-- PASO 3: Modificar estructura de la tabla reservadb
-- =====================================================================

-- Eliminar la columna profesor_id (si existe)
ALTER TABLE reservadb DROP COLUMN IF EXISTS profesor_id;

-- Asegurar que user_id sea NOT NULL (ya que ahora es la referencia principal)
ALTER TABLE reservadb MODIFY COLUMN user_id INT NOT NULL;

-- Agregar clave foránea para user_id hacia auth_user si no existe
ALTER TABLE reservadb 
ADD CONSTRAINT fk_reserva_user 
FOREIGN KEY (user_id) REFERENCES auth_user(id) 
ON DELETE CASCADE ON UPDATE CASCADE;

-- PASO 4: Limpiar datos huérfanos en reservadb
-- =====================================================================

-- Eliminar reservas que no tienen user_id válido
DELETE FROM reservadb 
WHERE user_id IS NULL 
   OR user_id NOT IN (SELECT id FROM auth_user);

-- PASO 5: Eliminar tabla profesordb y referencias relacionadas
-- =====================================================================

-- Eliminar datos de perfil que referencian a profesores que ya no existen
DELETE FROM perfil_carreras 
WHERE perfil_id IN (
    SELECT id FROM perfildb 
    WHERE user_id NOT IN (SELECT id FROM auth_user)
);

DELETE FROM perfil_cursos 
WHERE perfil_id IN (
    SELECT id FROM perfildb 
    WHERE user_id NOT IN (SELECT id FROM auth_user)
);

-- Limpiar perfiles huérfanos
DELETE FROM perfildb 
WHERE user_id NOT IN (SELECT id FROM auth_user);

-- Finalmente, eliminar la tabla profesordb
DROP TABLE IF EXISTS profesordb;

-- PASO 6: Optimizar y limpiar índices
-- =====================================================================

-- Eliminar índices relacionados con profesor_id si existen
ALTER TABLE reservadb DROP INDEX IF EXISTS idx_profesor_id;
ALTER TABLE reservadb DROP INDEX IF EXISTS profesor_id;

-- Crear/optimizar índices para user_id
CREATE INDEX IF NOT EXISTS idx_reserva_user_id ON reservadb(user_id);
CREATE INDEX IF NOT EXISTS idx_reserva_fecha ON reservadb(fecha_reserva);
CREATE INDEX IF NOT EXISTS idx_reserva_aula ON reservadb(aula_virtual_id);

-- PASO 7: Activar restricciones de clave foránea
-- =====================================================================

SET FOREIGN_KEY_CHECKS = 1;

-- PASO 8: Verificar la limpieza (OPCIONAL - PARA VERIFICAR)
-- =====================================================================

-- Verificar que no queden referencias a profesor_id
SELECT TABLE_NAME, COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
  AND COLUMN_NAME LIKE '%profesor%';

-- Verificar que todas las reservas tienen user_id válido
SELECT COUNT(*) as reservas_validas
FROM reservadb r
INNER JOIN auth_user u ON r.user_id = u.id;

-- Verificar que todos los perfiles tienen user_id válido
SELECT COUNT(*) as perfiles_validos
FROM perfildb p
INNER JOIN auth_user u ON p.user_id = u.id;

-- =====================================================================
-- COMANDOS DE VERIFICACIÓN FINAL
-- =====================================================================

SHOW CREATE TABLE reservadb;
DESCRIBE reservadb;

-- =====================================================================
-- NOTAS IMPORTANTES:
-- 1. HACER BACKUP COMPLETO DE LA BASE DE DATOS ANTES DE EJECUTAR
-- 2. EJECUTAR EN AMBIENTE DE DESARROLLO PRIMERO
-- 3. VERIFICAR QUE EL BACKEND FUNCIONE CORRECTAMENTE DESPUÉS
-- 4. LA TABLA reservadb_backup CONTIENE RESPALDO DE RESERVAS FUTURAS
-- =====================================================================
