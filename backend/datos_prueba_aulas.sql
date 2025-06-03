-- ========================================
-- SCRIPT DE DATOS DE PRUEBA PARA AULAS VIRTUALES
-- Sistema de Reserva de Aulas Virtuales TECSUP
-- ========================================

-- IMPORTANTE: Ejecuta este script en tu base de datos MySQL de XAMPP
-- Asegúrate de que tu base de datos esté seleccionada antes de ejecutar

-- ========================================
-- 1. INSERTAR DEPARTAMENTOS
-- ========================================
INSERT IGNORE INTO departamentodb (id, nombre, descripcion, fecha_creacion) VALUES
(1, 'Ingeniería de Sistemas', 'Departamento de tecnologías de información y sistemas', '2024-01-15'),
(2, 'Ingeniería Industrial', 'Departamento de procesos industriales y manufactura', '2024-01-15'),
(3, 'Ingeniería Mecánica', 'Departamento de diseño y manufactura mecánica', '2024-01-15'),
(4, 'Ingeniería Electrónica', 'Departamento de sistemas electrónicos y telecomunicaciones', '2024-01-15'),
(5, 'Administración', 'Departamento de ciencias administrativas y gestión', '2024-01-15');

-- ========================================
-- 2. INSERTAR CARRERAS
-- ========================================
INSERT IGNORE INTO carreradb (id, nombre, codigo, descripcion, departamento_id) VALUES
(1, 'Computación e Informática', 'COI', 'Carrera de desarrollo de software y sistemas informáticos', 1),
(2, 'Diseño y Desarrollo de Software', 'DDS', 'Carrera especializada en desarrollo de aplicaciones', 1),
(3, 'Redes y Comunicaciones', 'RYC', 'Carrera de infraestructura de redes y telecomunicaciones', 1),
(4, 'Producción y Gestión Industrial', 'PGI', 'Carrera de optimización de procesos industriales', 2),
(5, 'Mecánica de Producción', 'MEP', 'Carrera de manufactura y diseño mecánico', 3),
(6, 'Electrónica y Automatización', 'EAU', 'Carrera de sistemas electrónicos automatizados', 4),
(7, 'Administración de Empresas', 'ADE', 'Carrera de gestión empresarial y negocios', 5);

-- ========================================
-- 3. INSERTAR CURSOS
-- ========================================
INSERT IGNORE INTO cursodb (id, nombre, descripcion, duracion, fecha, carrera_id, fecha_creacion) VALUES
(1, 'Programación Orientada a Objetos', 'Curso de fundamentos de POO con Java y Python', 80, '2024-03-01', 1, '2024-02-15'),
(2, 'Base de Datos', 'Diseño e implementación de bases de datos relacionales', 72, '2024-03-01', 1, '2024-02-15'),
(3, 'Desarrollo Web Frontend', 'React, Vue.js y tecnologías modernas de frontend', 90, '2024-03-15', 2, '2024-02-20'),
(4, 'Desarrollo Web Backend', 'Node.js, Django y desarrollo de APIs REST', 85, '2024-03-15', 2, '2024-02-20'),
(5, 'Configuración de Redes', 'Implementación y administración de redes empresariales', 75, '2024-04-01', 3, '2024-03-01'),
(6, 'Seguridad Informática', 'Ciberseguridad y protección de sistemas', 60, '2024-04-01', 3, '2024-03-01'),
(7, 'Gestión de Calidad', 'Sistemas de calidad en procesos industriales', 65, '2024-04-15', 4, '2024-03-15'),
(8, 'Lean Manufacturing', 'Optimización de procesos productivos', 70, '2024-04-15', 4, '2024-03-15'),
(9, 'Diseño Mecánico CAD', 'Diseño asistido por computadora con SolidWorks', 80, '2024-05-01', 5, '2024-04-01'),
(10, 'Automatización Industrial', 'PLC y sistemas de control automatizado', 75, '2024-05-01', 6, '2024-04-01'),
(11, 'Gestión Empresarial', 'Fundamentos de administración y liderazgo', 60, '2024-05-15', 7, '2024-04-15'),
(12, 'Marketing Digital', 'Estrategias de marketing en medios digitales', 55, '2024-05-15', 7, '2024-04-15');

-- ========================================
-- 4. INSERTAR 10 AULAS VIRTUALES
-- ========================================
INSERT IGNORE INTO aula_virtualdb (id, codigo, descripcion, estado) VALUES
(1, 'A1', 'Aula Virtual Principal - Capacidad para 30 estudiantes con pizarra digital interactiva', 'disponible'),
(2, 'A2', 'Aula Virtual de Programación - Equipada con software de desarrollo', 'disponible'),
(3, 'A3', 'Aula Virtual de Diseño - Estaciones con software CAD y de diseño gráfico', 'disponible'),
(4, 'A4', 'Aula Virtual de Redes - Laboratorio virtual de configuración de redes', 'disponible'),
(5, 'A5', 'Aula Virtual Multimedia - Sistema audiovisual avanzado para presentaciones', 'disponible'),
(6, 'A6', 'Aula Virtual de Proyectos - Espacio colaborativo para trabajo en equipo', 'en_mantenimiento'),
(7, 'A7', 'Aula Virtual de Conferencias - Capacidad para 50 estudiantes', 'disponible'),
(8, 'A8', 'Aula Virtual de Simulación - Entornos virtuales para prácticas', 'disponible'),
(9, 'A9', 'Aula Virtual de Laboratorio - Experimentos virtuales y simulaciones', 'disponible'),
(10, 'B1', 'Aula Virtual Avanzada - Tecnología de realidad virtual y aumentada', 'disponible');

-- ========================================
-- 5. INSERTAR USUARIOS PROFESORES (tabla auth_user de Django)
-- ========================================
-- NOTA: Estos son usuarios de ejemplo, en producción deberías usar el comando createsuperuser de Django
INSERT IGNORE INTO auth_user (id, username, email, first_name, last_name, is_staff, is_active, date_joined, password) VALUES
(1, 'jperez', 'jperez@tecsup.edu.pe', 'Juan Carlos', 'Pérez González', 1, 1, '2024-01-15 09:00:00', 'pbkdf2_sha256$600000$dummy$hash'),
(2, 'mrodriguez', 'mrodriguez@tecsup.edu.pe', 'María Elena', 'Rodríguez Silva', 1, 1, '2024-01-16 09:00:00', 'pbkdf2_sha256$600000$dummy$hash'),
(3, 'cgarcia', 'cgarcia@tecsup.edu.pe', 'Carlos Alberto', 'García Mendoza', 1, 1, '2024-01-17 09:00:00', 'pbkdf2_sha256$600000$dummy$hash'),
(4, 'alopez', 'alopez@tecsup.edu.pe', 'Ana Lucía', 'López Vargas', 1, 1, '2024-01-18 09:00:00', 'pbkdf2_sha256$600000$dummy$hash'),
(5, 'rmartinez', 'rmartinez@tecsup.edu.pe', 'Roberto', 'Martínez Huamán', 1, 1, '2024-01-19 09:00:00', 'pbkdf2_sha256$600000$dummy$hash'),
(6, 'lsanchez', 'lsanchez@tecsup.edu.pe', 'Luis Fernando', 'Sánchez Torres', 1, 1, '2024-01-20 09:00:00', 'pbkdf2_sha256$600000$dummy$hash'),
(7, 'cvalenzuela', 'cvalenzuela@tecsup.edu.pe', 'Carmen Rosa', 'Valenzuela Ríos', 1, 1, '2024-01-21 09:00:00', 'pbkdf2_sha256$600000$dummy$hash'),
(8, 'dmorales', 'dmorales@tecsup.edu.pe', 'Daniel Eduardo', 'Morales Castro', 1, 1, '2024-01-22 09:00:00', 'pbkdf2_sha256$600000$dummy$hash');

-- ========================================
-- 6. INSERTAR PROFESORES
-- ========================================
INSERT IGNORE INTO profesordb (id, user_id, codigo, nombres, apellidos, correo, departamento_id, fecha_creacion) VALUES
(1, 1, 'PROF001', 'Juan Carlos', 'Pérez González', 'jperez@tecsup.edu.pe', 1, '2024-01-15'),
(2, 2, 'PROF002', 'María Elena', 'Rodríguez Silva', 'mrodriguez@tecsup.edu.pe', 1, '2024-01-16'),
(3, 3, 'PROF003', 'Carlos Alberto', 'García Mendoza', 'cgarcia@tecsup.edu.pe', 2, '2024-01-17'),
(4, 4, 'PROF004', 'Ana Lucía', 'López Vargas', 'alopez@tecsup.edu.pe', 3, '2024-01-18'),
(5, 5, 'PROF005', 'Roberto', 'Martínez Huamán', 'rmartinez@tecsup.edu.pe', 4, '2024-01-19'),
(6, 6, 'PROF006', 'Luis Fernando', 'Sánchez Torres', 'lsanchez@tecsup.edu.pe', 4, '2024-01-20'),
(7, 7, 'PROF007', 'Carmen Rosa', 'Valenzuela Ríos', 'cvalenzuela@tecsup.edu.pe', 5, '2024-01-21'),
(8, 8, 'PROF008', 'Daniel Eduardo', 'Morales Castro', 'dmorales@tecsup.edu.pe', 1, '2024-01-22');

-- ========================================
-- 7. RELACIONAR PROFESORES CON CARRERAS (tabla many-to-many)
-- ========================================
INSERT IGNORE INTO profesordb_carreras (id, profesordb_id, carreradb_id) VALUES
(1, 1, 1), (2, 1, 2),  -- Juan Pérez: COI y DDS
(3, 2, 2), (4, 2, 3),  -- María Rodríguez: DDS y RYC
(5, 3, 4),             -- Carlos García: PGI
(6, 4, 5),             -- Ana López: MEP
(7, 5, 6),             -- Roberto Martínez: EAU
(8, 6, 6), (9, 6, 4),  -- Luis Sánchez: EAU y PGI
(10, 7, 7),            -- Carmen Valenzuela: ADE
(11, 8, 1), (12, 8, 3); -- Daniel Morales: COI y RYC

-- ========================================
-- 8. RELACIONAR PROFESORES CON CURSOS (tabla many-to-many)
-- ========================================
INSERT IGNORE INTO profesordb_cursos (id, profesordb_id, cursodb_id) VALUES
(1, 1, 1), (2, 1, 2),   -- Juan Pérez: POO y Base de Datos
(3, 2, 3), (4, 2, 4),   -- María Rodríguez: Frontend y Backend
(5, 3, 7), (6, 3, 8),   -- Carlos García: Gestión Calidad y Lean
(7, 4, 9),              -- Ana López: Diseño CAD
(8, 5, 10),             -- Roberto Martínez: Automatización
(9, 6, 10), (10, 6, 7), -- Luis Sánchez: Automatización y Gestión Calidad
(11, 7, 11), (12, 7, 12), -- Carmen Valenzuela: Gestión y Marketing
(13, 8, 5), (14, 8, 6);   -- Daniel Morales: Redes y Seguridad

-- ========================================
-- 9. INSERTAR RESERVAS DE EJEMPLO
-- ========================================
INSERT IGNORE INTO reservadb (id, profesor_id, aula_virtual_id, curso_id, hora_inicio, hora_fin, fecha_reserva, motivo, estado, fecha_creacion) VALUES
(1, 1, 1, 1, '08:00:00', '10:00:00', '2024-06-04', 'Clase de POO - Herencia y Polimorfismo', 'reservado', '2024-06-03'),
(2, 2, 2, 3, '10:30:00', '12:30:00', '2024-06-04', 'Desarrollo Frontend con React', 'reservado', '2024-06-03'),
(3, 3, 5, 7, '14:00:00', '16:00:00', '2024-06-04', 'Presentación Sistemas de Calidad', 'reservado', '2024-06-03'),
(4, 1, 3, 2, '08:00:00', '10:00:00', '2024-06-05', 'Laboratorio de Base de Datos', 'reservado', '2024-06-03'),
(5, 4, 7, 9, '16:00:00', '18:00:00', '2024-06-05', 'Diseño CAD - Proyecto Final', 'reservado', '2024-06-03'),
(6, 8, 4, 5, '08:30:00', '10:30:00', '2024-06-06', 'Configuración de Routers y Switches', 'reservado', '2024-06-03'),
(7, 5, 9, 10, '13:00:00', '15:00:00', '2024-06-06', 'Programación de PLCs', 'reservado', '2024-06-03'),
(8, 7, 10, 11, '09:00:00', '11:00:00', '2024-06-07', 'Workshop de Liderazgo Empresarial', 'reservado', '2024-06-03'),
(9, 2, 8, 4, '15:30:00', '17:30:00', '2024-06-07', 'Desarrollo de APIs REST', 'reservado', '2024-06-03'),
(10, 6, 1, 10, '11:00:00', '13:00:00', '2024-06-10', 'Simulación de Procesos Automatizados', 'disponible', '2024-06-03');

-- ========================================
-- VERIFICACIÓN DE DATOS INSERTADOS
-- ========================================
-- Puedes ejecutar estas consultas para verificar que los datos se insertaron correctamente:

-- SELECT COUNT(*) as total_aulas FROM aula_virtualdb;
-- SELECT codigo, descripcion, estado FROM aula_virtualdb ORDER BY codigo;
-- SELECT p.nombres, p.apellidos, d.nombre as departamento FROM profesordb p JOIN departamentodb d ON p.departamento_id = d.id;
-- SELECT r.fecha_reserva, p.nombres, p.apellidos, a.codigo, c.nombre FROM reservadb r 
--   JOIN profesordb p ON r.profesor_id = p.id 
--   JOIN aula_virtualdb a ON r.aula_virtual_id = a.id 
--   JOIN cursodb c ON r.curso_id = c.id 
--   ORDER BY r.fecha_reserva;

-- ========================================
-- NOTAS IMPORTANTES:
-- ========================================
-- 1. Los passwords son dummy, en producción usa createsuperuser de Django
-- 2. Las fechas están configuradas para junio 2024, ajusta según necesites
-- 3. El aula A6 está en mantenimiento como ejemplo de estados
-- 4. Hay reservas tanto activas como disponibles para pruebas
-- 6. Todos los nombres de tabla están en minúsculas para coincidir con tu esquema
-- ========================================
