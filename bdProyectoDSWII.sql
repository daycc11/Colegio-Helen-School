CREATE IF NOT EXIT DATABASE Helen_School;
USE Helen_School;

-- =============================================
-- ROLES Y USUARIOS
-- =============================================
INSERT INTO rol (nombre) VALUES ('Auxiliar'), ('Directora');

INSERT INTO usuario (nombres, apellidos, username, clave, idrol) VALUES
('Itzel', 'Vargas Flores', 'admin1', '123456', 1),
('Dayron',  'Dayron Cipriano', 'admin2',  'admin',  1);

-- =============================================
-- GRADOS
-- =============================================
INSERT INTO grado (nombre, seccion) VALUES
('Primero de Secundaria',  'A'),
('Primero de Secundaria',  'B'),
('Segundo de Secundaria',  'A'),
('Segundo de Secundaria',  'B'),
('Tercero de Secundaria',  'A'),
('Tercero de Secundaria',  'B');

-- =============================================
-- TUTORES
-- =============================================
INSERT INTO tutor (nombres, apellidos, dni, telefono, direccion, email, parentesco) VALUES
('Carlos',  'Ramírez López',    '45896321', '987654321', 'Av. Los Olivos 234',       'carlos.ramirez@example.com',    'Padre'),
('María',   'Fernández Torres', '75689124', '912345678', 'Jr. Las Flores 123',       'maria.fernandez@example.com',   'Madre'),
('José',    'Gonzales Vega',    '65234189', '999888777', 'Calle Central 456',        'jose.gonzales@example.com',     'Tío'),
('Lucía',   'Martínez Ríos',   '87456321', '955123456', 'Av. San Martín 890',        'lucia.martinez@example.com',    'Tía'),
('Pedro',   'Suárez Paredes',   '78451236', '988112233', 'Pasaje Los Cedros 12',     'pedro.suarez@example.com',      'Hermano'),
('Rosa',    'Quispe Mamani',    '91234567', '966778899', 'Av. Arequipa 345',         'rosa.quispe@example.com',       'Madre'),
('Hugo',    'Peralta Díaz',     '82345678', '944556677', 'Jr. Cuzco 78',             'hugo.peralta@example.com',      'Padre'),
('Elena',   'Vásquez Cruz',     '73456789', '933445566', 'Calle Lima 200',           'elena.vasquez@example.com',     'Madre');

-- =============================================
-- ALUMNOS + DATOS DE MATRÍCULA
-- =============================================
INSERT INTO alumno (nombres, apellidos, fecha_nacimiento, dni, id_tutor, id_grado,
                    fecha_matricula, fecha_fin_matricula, metodo_pago, monto_pagado)
VALUES
('Andrés',    'Ramírez Soto',      '2010-05-14', '12346778', 1, 1, '2025-03-03', '2025-12-20', 'Efectivo',           350.00),
('Valeria',   'Fernández López',   '2011-08-21', '23456789', 2, 2, '2025-03-03', '2025-12-20', 'Transferencia',      350.00),
('Gabriel',   'Gonzales Torres',   '2009-12-03', '34567890', 3, 3, '2025-03-04', '2025-12-20', 'Yape',               350.00),
('Sofía',     'Martínez Díaz',     '2012-02-28', '45678901', 4, 1, '2025-03-04', '2025-12-20', 'Efectivo',           350.00),
('Diego',     'Suárez Ramos',      '2010-10-10', '56789012', 5, 2, '2025-03-05', '2025-12-20', 'Plin',               350.00),
('Carlos',    'Ramírez Pérez',     '2008-05-12', '12345678', 1, 1, '2025-03-05', '2025-12-20', 'Tarjeta de débito',  350.00),
('María',     'López Torres',      '2007-11-23', '87654321', 2, 2, '2025-03-06', '2025-12-20', 'Efectivo',           350.00),
('Juan',      'Gómez Díaz',        '2009-01-15', '45678912', 1, 1, '2025-03-06', '2025-12-20', 'Transferencia',      350.00),
('Lucía',     'Martínez Vega',     '2008-07-19', '65432198', 3, 2, '2025-03-07', '2025-12-20', 'Yape',               350.00),
('Fernanda',  'Quispe Huanca',     '2009-04-22', '71234567', 6, 3, '2025-03-07', '2025-12-20', 'Efectivo',           350.00),
('Sebastián', 'Peralta Mendoza',   '2008-09-11', '81234567', 7, 4, '2025-03-10', '2025-12-20', 'Plin',               350.00),
('Camila',    'Vásquez Ríos',      '2010-12-30', '72345678', 8, 5, '2025-03-10', '2025-12-20', 'Tarjeta de crédito', 350.00),
('Mateo',     'Flores Paredes',    '2007-06-18', '83456789', 6, 6, '2025-03-11', '2025-12-20', 'Efectivo',           350.00),
('Isabella',  'Torres Campos',     '2011-03-05', '74567890', 7, 3, '2025-03-11', '2025-12-20', 'Yape',               350.00),
('Nicolás',   'Cruz Espinoza',     '2008-11-27', '85678901', 8, 4, '2025-03-12', '2025-12-20', 'Transferencia',      350.00);

-- =============================================
-- DOCENTES
-- =============================================
INSERT INTO docente (nombres, apellidos, dni, telefono, email, especialidad, direccion) VALUES
('Ana',    'García Ríos',     '11223344', '987001122', 'ana.garcia@helenSchool.edu.pe',    'Matemáticas',        'Av. Los Pinos 101'),
('Carlos', 'Mendoza López',   '22334455', '987002233', 'c.mendoza@helenSchool.edu.pe',     'Comunicación',       'Jr. Las Magnolias 55'),
('Rosa',   'Vargas Chávez',   '33445566', '987003344', 'r.vargas@helenSchool.edu.pe',      'Ciencias Naturales', 'Calle San Borja 234'),
('Miguel', 'Torres Huanca',   '44556677', '987004455', 'm.torres@helenSchool.edu.pe',      'Historia y Geografía','Av. Grau 789'),
('Lucía',  'Quispe Ramos',    '55667788', '987005566', 'l.quispe@helenSchool.edu.pe',      'Inglés',             'Pasaje Los Cedros 12'),
('Jorge',  'Salinas Pachas',  '66778899', '987006677', 'j.salinas@helenSchool.edu.pe',     'Educación Física',   'Av. República 456'),
('Carmen', 'Huanca Flores',   '77889900', '987007788', 'c.huanca@helenSchool.edu.pe',      'Arte y Cultura',     'Jr. Amazonas 321');
