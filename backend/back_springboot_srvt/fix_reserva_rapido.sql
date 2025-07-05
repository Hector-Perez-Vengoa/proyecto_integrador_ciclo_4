-- =====================================================================
-- SCRIPT RÁPIDO: SOLO ARREGLAR RESERVADB PARA QUE FUNCIONE INMEDIATAMENTE
-- =====================================================================

-- EJECUTAR ESTOS COMANDOS UNO POR UNO:

-- 1. Desactivar restricciones temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- 2. Eliminar la columna profesor_id que está causando el problema
ALTER TABLE reservadb DROP COLUMN IF EXISTS profesor_id;

-- 3. Asegurar que user_id no sea nulo
ALTER TABLE reservadb MODIFY COLUMN user_id INT NOT NULL;

-- 4. Reactivar restricciones
SET FOREIGN_KEY_CHECKS = 1;

-- 5. Verificar la estructura de la tabla
DESCRIBE reservadb;

-- =====================================================================
-- ESTE SCRIPT RESUELVE EL ERROR INMEDIATO
-- DESPUÉS PUEDES EJECUTAR EL SCRIPT COMPLETO DE LIMPIEZA
-- =====================================================================
