-- =====================================================================
-- SCRIPT PARA DIAGNOSTICAR Y CORREGIR PROBLEMA DE PERFIL
-- =====================================================================

-- PASO 1: Verificar usuarios existentes
SELECT id, username, first_name, last_name, email 
FROM auth_user 
ORDER BY id;

-- PASO 2: Verificar perfiles existentes
SELECT id, user_id, fecha_actualizacion 
FROM perfildb 
ORDER BY user_id;

-- PASO 3: Encontrar usuarios SIN perfil
SELECT u.id, u.username, u.first_name, u.last_name 
FROM auth_user u 
LEFT JOIN perfildb p ON u.id = p.user_id 
WHERE p.user_id IS NULL;

-- PASO 4: Crear perfiles para usuarios que no los tienen
INSERT INTO perfildb (user_id, fecha_actualizacion) 
SELECT u.id, NOW() 
FROM auth_user u 
LEFT JOIN perfildb p ON u.id = p.user_id 
WHERE p.user_id IS NULL;

-- PASO 5: Verificar que todos los usuarios tengan perfil
SELECT 
    u.id as user_id,
    u.username,
    u.email,
    p.id as perfil_id,
    CASE 
        WHEN p.id IS NOT NULL THEN 'SÍ TIENE PERFIL'
        ELSE 'NO TIENE PERFIL'
    END as estado_perfil
FROM auth_user u 
LEFT JOIN perfildb p ON u.id = p.user_id 
ORDER BY u.id;

-- PASO 6: Verificar carreras y cursos asociados a perfiles
SELECT 
    p.id as perfil_id,
    p.user_id,
    u.username,
    COUNT(pc.carrera_id) as num_carreras,
    COUNT(pcu.curso_id) as num_cursos
FROM perfildb p
JOIN auth_user u ON p.user_id = u.id
LEFT JOIN perfil_carreras pc ON p.id = pc.perfil_id
LEFT JOIN perfil_cursos pcu ON p.id = pcu.perfil_id
GROUP BY p.id, p.user_id, u.username
ORDER BY p.user_id;

-- =====================================================================
-- COMANDOS PARA ASIGNAR CARRERAS Y CURSOS A PERFILES SIN DATOS
-- =====================================================================

-- Si encuentras perfiles sin carreras, puedes asignar una carrera por defecto:
-- (Ajusta los IDs según tu base de datos)

-- Obtener IDs de carreras disponibles:
SELECT id, nombre FROM carreradb ORDER BY id;

-- Asignar carrera por defecto a perfiles sin carreras (ejemplo con carrera ID 1):
INSERT INTO perfil_carreras (perfil_id, carrera_id)
SELECT p.id, 1
FROM perfildb p
LEFT JOIN perfil_carreras pc ON p.id = pc.perfil_id
WHERE pc.perfil_id IS NULL;

-- Obtener IDs de cursos disponibles:
SELECT id, nombre FROM cursodb ORDER BY id;

-- Asignar algunos cursos por defecto a perfiles sin cursos (ejemplo con cursos 1, 2, 3):
INSERT INTO perfil_cursos (perfil_id, curso_id)
SELECT p.id, c.id
FROM perfildb p
CROSS JOIN (SELECT 1 as id UNION SELECT 2 UNION SELECT 3) c
LEFT JOIN perfil_cursos pc ON p.id = pc.perfil_id AND c.id = pc.curso_id
WHERE pc.perfil_id IS NULL;

-- =====================================================================
-- VERIFICACIÓN FINAL
-- =====================================================================

-- Verificar estado final de perfiles
SELECT 
    u.id as user_id,
    u.username,
    p.id as perfil_id,
    COUNT(DISTINCT pc.carrera_id) as carreras,
    COUNT(DISTINCT pcu.curso_id) as cursos
FROM auth_user u
JOIN perfildb p ON u.id = p.user_id
LEFT JOIN perfil_carreras pc ON p.id = pc.perfil_id
LEFT JOIN perfil_cursos pcu ON p.id = pcu.perfil_id
GROUP BY u.id, u.username, p.id
ORDER BY u.id;
