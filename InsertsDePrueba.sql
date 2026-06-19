-- =======================================================================================
-- PASO 1: BORRAR TODAS LAS TABLAS
-- =======================================================================================
-- Ejecuta este comando para borrar la base de datos completa.
-- ADVERTENCIA: Esto borrará absolutamente todo.
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- =======================================================================================
-- PASO 2: REINICIAR EL BACKEND
-- =======================================================================================
-- ¡MUY IMPORTANTE!
-- Antes de correr los INSERTs, ve a tu panel de Railway y REINICIA tu proyecto Backend.
-- Al encenderse, Spring Boot detectará que no hay tablas y las creará TODAS desde cero
-- limpias y perfectas. Una vez que termine de encender, corre el Paso 3.
-- =======================================================================================
-- PASO 3: INSERTAR DATOS INICIALES (SEED)
-- =======================================================================================
-- 1. Insertar Niveles (Ej: Primaria, Secundaria, Inicial)

INSERT INTO nivel (nombre) VALUES 
('Inicial'),
('Primaria'),
('Secundaria'),
('Bachiller');

-- 2. Insertar Grados (Ej: Primero, Segundo...)
INSERT INTO grado (nombre) VALUES 
('Primero'),
('Segundo'),
('Tercero'),
('Cuarto'),
('Quinto'),
('Sexto');

-- 3. Insertar Secciones
INSERT INTO seccion (nombre) VALUES 
('A'),
('B'),
('C'),
('D'),
('E');

-- 4. Insertar Turnos
INSERT INTO turno (nombre, hora_inicio, hora_fin) VALUES 
('Mañana', '07:30:00', '13:30:00'),
('Tarde', '13:30:00', '18:30:00');

-- 5. Insertar Cursos
INSERT INTO curso (nombre) VALUES 
('Matemáticas'), ('Comunicación'), ('Ciencias Naturales'), ('Historia'), 
('Educación Física'), ('Arte'), ('Inglés');

-- 6. Insertar Días de la Semana
INSERT INTO dia_semana (nombre) VALUES 
('Lunes'), ('Martes'), ('Miércoles'), ('Jueves'), ('Viernes');

-- 7. Insertar Estados (Para Pago y Matrícula)
INSERT INTO estado (nombre, tipo) VALUES 
('Pendiente', 'PAGO'),
('Pagado', 'PAGO'),
('Anulado', 'PAGO'),
('Pendiente', 'MATRICULA'),
('Activa', 'MATRICULA'),
('Retirada', 'MATRICULA');

-- 8. Insertar Año Escolar
INSERT INTO anio_escolar (nombre, fecha_inicio, fecha_fin, activo) VALUES 
('2026', '2026-03-01', '2026-12-15', true);

-- 6. Insertar Roles Base (Es vital para crear usuarios)
INSERT INTO rol (idrol, nombre) VALUES 
(1, 'Administrador'),
(2, 'Director'),
(3, 'Secretario'),
(4, 'Coordinador Académico'),
(5, 'Auxiliar');

-- 7. Insertar Usuarios
-- Usuarios Auxiliares (idrol = 5) para probar la vista de Aulas
-- Clave encriptada proporcionada: $2a$10$7himfwhQ98AIqGcQ3nKEMOSTiyK3wwtPNivmz8dnOr0cOs3m7TCum
INSERT INTO usuario (nombres, apellidos, username, clave, idrol) VALUES 
('Dayron Jesus', 'Cipriano', 'daycc11', '$2a$10$7himfwhQ98AIqGcQ3nKEMOSTiyK3wwtPNivmz8dnOr0cOs3m7TCum', 1);

-- 2. Insertamos 3 auxiliares de prueba buscando automáticamente el ID del rol 'Auxiliar'
INSERT INTO usuario (nombres, apellidos, username, clave, idrol) 
VALUES
('Juan', 'Pérez', 'jperez_aux', '$2a$10$7himfwhQ98AIqGcQ3nKEMOSTiyK3wwtPNivmz8dnOr0cOs3m7TCum', (SELECT idrol FROM rol WHERE nombre = 'Auxiliar' LIMIT 1)),
('María', 'López', 'mlopez_aux', '$2a$10$7himfwhQ98AIqGcQ3nKEMOSTiyK3wwtPNivmz8dnOr0cOs3m7TCum', (SELECT idrol FROM rol WHERE nombre = 'Auxiliar' LIMIT 1)),
('Carlos', 'Ramírez', 'cramirez_aux', '$2a$10$7himfwhQ98AIqGcQ3nKEMOSTiyK3wwtPNivmz8dnOr0cOs3m7TCum', (SELECT idrol FROM rol WHERE nombre = 'Auxiliar' LIMIT 1));

-- 8. Insertar algunos Docentes
INSERT INTO docente (nombres, apellidos, dni, telefono, email, direccion) VALUES 
('Ana', 'García', '74125896', '999888777', 'ana@gmail.com', 'Lima'),
('Carlos', 'Mendoza', '85236974', '999666555', 'carlos@gmail.com', 'Lima'),
('Luis', 'Ramírez', '12345678', '999111222', 'luis@gmail.com', 'Lima'),
('Carmen', 'Paredes', '87654321', '999222333', 'carmen@gmail.com', 'Lima'),
('Jorge', 'Salas', '11223344', '999333444', 'jorge@gmail.com', 'Lima'),
('Patricia', 'Vásquez', '55667788', '999444555', 'patricia@gmail.com', 'Lima'),
('Ricardo', 'Flores', '99887766', '999555666', 'ricardo@gmail.com', 'Lima'),
('Elena', 'Gutiérrez', '44556677', '999777888', 'elena@gmail.com', 'Lima'),
('Raúl', 'Chávez', '22334455', '999888999', 'raul@gmail.com', 'Lima'),
('Sofía', 'Espinoza', '66778899', '999000111', 'sofia@gmail.com', 'Lima');

INSERT INTO grado_nivel_seccion (id_grado, id_nivel, id_seccion) VALUES 
-- Primaria (ID = 2)
(1, 2, 1), (1, 2, 2), -- 1ro A, 1ro B
(2, 2, 1), (2, 2, 2), -- 2do A, 2do B
(3, 2, 1), (3, 2, 2), -- 3ro A, 3ro B
(4, 2, 1), (4, 2, 2), -- 4to A, 4to B
(5, 2, 1), (5, 2, 2), -- 5to A, 5to B
(6, 2, 1), (6, 2, 2), -- 6to A, 6to B
-- Secundaria (ID = 3)
(1, 3, 1), (1, 3, 2), -- 1ro A, 1ro B
(2, 3, 1), (2, 3, 2), -- 2do A, 2do B
(3, 3, 1), (3, 3, 2), -- 3ro A, 3ro B
(4, 3, 1), (4, 3, 2), -- 4to A, 4to B
(5, 3, 1), (5, 3, 2); -- 5to A, 5to B

-- ==============================================================================
-- 5. AULAS (Alineadas estrictamente)
-- ==============================================================================
INSERT INTO aula (id, id_grado_nivel_seccion, id_turno, id_anio_escolar, id_auxiliar, capacidad, activo) VALUES
-- Primaria
(1, 1,  1, 1, 2, 30, true), (2, 2,  1, 1, 3, 30, true), (3, 3,  1, 1, 4, 30, true), 
(4, 4,  1, 1, 2, 30, true), (5, 5,  1, 1, 3, 30, true), (6, 6,  1, 1, 4, 30, true),
(7, 7,  1, 1, 2, 30, true), (8, 8,  1, 1, 3, 30, true), (9, 9,  1, 1, 4, 30, true), 
(10, 10, 1, 1, 2, 30, true), (11, 11, 1, 1, 3, 30, true), (12, 12, 1, 1, 4, 30, true),
-- Secundaria
(13, 13, 1, 1, 2, 35, true), (14, 14, 1, 1, 3, 35, true), (15, 15, 1, 1, 4, 35, true), 
(16, 16, 1, 1, 2, 35, true), (17, 17, 1, 1, 3, 35, true), (18, 18, 1, 1, 4, 35, true),
(19, 19, 1, 1, 2, 35, true), (20, 20, 1, 1, 3, 35, true), (21, 21, 1, 1, 4, 35, true), 
(22, 22, 1, 1, 2, 35, true);

-- ==============================================================================
-- 6. CURSO DOCENTE
-- ==============================================================================
INSERT INTO curso_docente (id_curso_docente, id_curso, id_docente, id_nivel, horas, estado) VALUES
(1, 1, 1, 2, 4, 1),  -- 1: Ana García (Mate) Primaria
(2, 1, 1, 3, 5, 1),  -- 2: Ana García (Mate) Secundaria
(3, 2, 2, 2, 4, 1),  -- 3: Carlos Mendoza (Comu) Primaria
(4, 2, 2, 3, 5, 1),  -- 4: Carlos Mendoza (Comu) Secundaria
(5, 3, 3, 2, 3, 1),  -- 5: Luis Ramírez (CCNN) Primaria
(6, 3, 3, 3, 4, 1),  -- 6: Luis Ramírez (CCNN) Secundaria
(7, 4, 4, 3, 4, 1),  -- 7: Carmen Paredes (Hist) Secundaria
(8, 5, 5, 2, 2, 1),  -- 8: Jorge Salas (EF) Primaria
(9, 5, 5, 3, 2, 1),  -- 9: Jorge Salas (EF) Secundaria
(10, 6, 6, 2, 2, 1),  -- 10: Patricia Vásquez (Arte) Primaria
(11, 7, 7, 2, 3, 1),  -- 11: Ricardo Flores (Inglés) Primaria
(12, 7, 7, 3, 4, 1),  -- 12: Ricardo Flores (Inglés) Secundaria
(13, 4, 8, 2, 3, 1),  -- 13: Elena Gutiérrez (Hist) Primaria
(14, 6, 9, 3, 2, 1),  -- 14: Raúl Chávez (Arte) Secundaria
(15, 1, 10, 3, 5, 1); -- 15: Sofía Espinoza (Mate) Secundaria

-- ==============================================================================
-- 7. MÉTODOS DE PAGO
-- ==============================================================================
INSERT INTO metodo_pago (nombre) VALUES 
('Efectivo'), ('Transferencia Bancaria'), ('Tarjeta de Crédito / Débito'), ('Yape / Plin');


-- ==============================================================================
-- 8. TUTORES Y ALUMNOS (40 REALES PERÚ)
-- ==============================================================================
-- Insertar 40 Tutores
INSERT INTO tutor (nombres, apellidos, dni, telefono, direccion, email, parentesco) VALUES
('Luis Miguel', 'Pérez Mendoza', '45871236', '987654321', 'Av. Brasil 1234, Jesús María', 'luis.perez.m@gmail.com', 'Padre'),
('Carmen Rosa', 'González Chávez', '41235698', '998877665', 'Jr. Huallaga 456, Cercado de Lima', 'carmeng.88@hotmail.com', 'Madre'),
('José Carlos', 'Rodríguez Silva', '42369874', '991122334', 'Calle Las Gaviotas 789, Surquillo', 'jcrodriguezs@yahoo.com', 'Padre'),
('María Elena', 'Flores Quispe', '40125896', '985632147', 'Av. Arequipa 3450, San Isidro', 'maria.flores.q@gmail.com', 'Madre'),
('Jorge Luis', 'García Vega', '43658974', '954781236', 'Av. La Marina 2040, San Miguel', 'jlgarcia.v@outlook.com', 'Padre'),
('Patricia', 'Sánchez Torres', '44123658', '998547123', 'Calle Los Pinos 123, Miraflores', 'patty.sanchez@gmail.com', 'Madre'),
('Carlos Alberto', 'Romero Castro', '46987412', '996325874', 'Jr. Amazonas 456, Breña', 'caromero.c@hotmail.com', 'Padre'),
('Ana Cecilia', 'Mendoza Vargas', '47852369', '941258746', 'Av. Colonial 1500, Callao', 'ana.mendoza.v@gmail.com', 'Madre'),
('Roberto', 'Díaz Navarro', '48521478', '932145876', 'Calle Las Camelias 789, Lince', 'roberto.diaz.n@yahoo.es', 'Padre'),
('Julia', 'Ortiz Reyes', '49632587', '987456321', 'Av. Benavides 2500, Surco', 'jortiz.reyes@gmail.com', 'Madre'),
('Víctor Manuel', 'Ramos Paredes', '41258963', '965874123', 'Jr. Zorritos 456, Cercado de Lima', 'vramos.paredes@hotmail.com', 'Padre'),
('Silvia', 'Cruz Delgado', '42587412', '954123698', 'Av. Javier Prado 4500, Surco', 'silvia.cruz.d@gmail.com', 'Madre'),
('Ricardo', 'Vargas Silva', '43698521', '941236587', 'Calle Los Cedros 123, La Molina', 'ricardo.vargas.s@outlook.com', 'Padre'),
('Mónica', 'Herrera Castro', '44785236', '998745123', 'Av. La Paz 789, San Miguel', 'mherrera.c@gmail.com', 'Madre'),
('Andrés', 'Silva Rojas', '45896321', '963258741', 'Jr. Puno 456, Cercado de Lima', 'andres.silva.r@yahoo.com', 'Padre'),
('Beatriz', 'Gómez Sánchez', '46123987', '951478236', 'Calle Las Palmas 789, Miraflores', 'bgomez.sanchez@gmail.com', 'Madre'),
('Fernando', 'Ruiz Ortiz', '47258147', '987123654', 'Av. Brasil 3000, Pueblo Libre', 'fruiz.ortiz@hotmail.com', 'Padre'),
('Alicia', 'Ortiz Mendoza', '48369258', '965478123', 'Jr. Washington 456, Cercado de Lima', 'alicia.ortiz.m@gmail.com', 'Madre'),
('Héctor', 'Campos Flores', '49471369', '941258963', 'Av. Faucett 1200, Callao', 'hcampos.flores@outlook.com', 'Padre'),
('Lorena', 'Delgado Cruz', '40582471', '998563214', 'Calle Los Eucaliptos 123, San Isidro', 'ldelgado.cruz@gmail.com', 'Madre'),
('Mario', 'Ríos Vargas', '41693582', '963147852', 'Av. Sucre 456, Pueblo Libre', 'mrios.vargas@yahoo.com', 'Padre'),
('Diana', 'Cruz Delgado', '42714693', '954789632', 'Jr. Carabaya 789, Cercado de Lima', 'diana.cruz.d@gmail.com', 'Madre'),
('Arturo', 'Vega Romero', '43825714', '987654123', 'Av. Salaverry 2000, Jesús María', 'avega.romero@hotmail.com', 'Padre'),
('Gloria', 'Paz Sánchez', '44936825', '965874321', 'Calle Las Fresas 123, La Molina', 'gloria.paz.s@gmail.com', 'Madre'),
('Gustavo', 'Suárez Gómez', '45147936', '941236987', 'Av. La Marina 3500, San Miguel', 'gsuarez.gomez@outlook.com', 'Padre'),
('Paola', 'Molina Ortiz', '46258147', '998745632', 'Jr. Camaná 456, Cercado de Lima', 'pmolina.ortiz@gmail.com', 'Madre'),
('Eduardo', 'Rojas Silva', '47369258', '963258147', 'Calle Los Robles 789, Surco', 'eduardo.rojas.s@yahoo.com', 'Padre'),
('Zoe', 'Soto Vargas', '48471369', '954123876', 'Av. Brasil 4000, Magdalena', 'zoe.soto.v@gmail.com', 'Madre'),
('Víctor', 'Aguilar Castro', '49582471', '987123456', 'Jr. Lampa 123, Cercado de Lima', 'vaguilar.castro@hotmail.com', 'Padre'),
('Renata', 'Soto Mendoza', '40693582', '965478912', 'Av. Universitaria 1500, San Miguel', 'renata.soto.m@gmail.com', 'Madre'),
('Joaquín', 'Navarro Flores', '41714693', '941258369', 'Calle Las Acacias 456, Miraflores', 'jnavarro.flores@outlook.com', 'Padre'),
('Inés', 'Cordero Cruz', '42825714', '998563147', 'Av. Venezuela 2000, Breña', 'icordero.cruz@gmail.com', 'Madre'),
('Samuel', 'Escobar Vega', '43936825', '963147258', 'Jr. Ucayali 789, Cercado de Lima', 'samuel.escobar.v@yahoo.com', 'Padre'),
('Elsa', 'Romero Paz', '45147825', '954789123', 'Calle Los Sauces 123, La Molina', 'elsa.romero.p@gmail.com', 'Madre'),
('Tomás', 'Lara Suárez', '46258936', '987654987', 'Av. Tacna 456, Cercado de Lima', 'tlara.suarez@hotmail.com', 'Padre'),
('Nadia', 'Miranda Molina', '47369147', '965874258', 'Jr. Cusco 123, Cercado de Lima', 'nadia.miranda.m@gmail.com', 'Madre'),
('Daniel', 'Salazar Rojas', '48471258', '941236147', 'Av. Arequipa 1500, Lince', 'dsalazar.rojas@outlook.com', 'Padre'),
('Sofía', 'Espinoza Soto', '49582369', '998745369', 'Calle Las Camelias 456, San Isidro', 'sofia.espinoza.s@gmail.com', 'Madre'),
('Raúl', 'Chávez Aguilar', '40693471', '963258123', 'Av. Brasil 1500, Pueblo Libre', 'rchavez.aguilar@yahoo.com', 'Padre'),
('Elena', 'Gutiérrez Navarro', '41714582', '954123258', 'Jr. Amazonas 789, Breña', 'elena.gutierrez.n@gmail.com', 'Madre');

-- Insertar 40 Alumnos (Mismo orden, por ende tutor 1 -> alumno 1)
INSERT INTO alumno (nombres, apellidos, fecha_nacimiento, dni, id_tutor) VALUES
('Mateo Alejandro', 'Pérez Silva', '2016-05-12', '76543210', 1), ('Valentina Rosa', 'González Pérez', '2015-08-20', '77654321', 2),
('Sebastián José', 'Rodríguez Gómez', '2014-11-05', '78765432', 3), ('Luciana Elena', 'Flores Martínez', '2017-02-14', '79876543', 4),
('Diego Luis', 'García López', '2016-07-30', '70987654', 5), ('Camila Patricia', 'Sánchez Ruiz', '2015-09-18', '71098765', 6),
('Nicolás Alberto', 'Romero Cruz', '2014-12-03', '72109876', 7), ('Ariana Cecilia', 'Mendoza Torres', '2017-04-25', '73210987', 8),
('Gabriel Roberto', 'Díaz Vargas', '2016-10-10', '74321098', 9), ('Valeria Julia', 'Ortiz Castro', '2015-01-22', '75432109', 10),
('Thiago Manuel', 'Ramos Rojas', '2014-06-15', '76543219', 11), ('Isabella Silvia', 'Cruz Sánchez', '2017-08-08', '77654320', 12),
('Joaquín Ricardo', 'Vargas Ortiz', '2016-11-28', '78765431', 13), ('Daniela Mónica', 'Herrera Mendoza', '2015-03-12', '79876542', 14),
('Adrián Andrés', 'Silva Flores', '2014-07-19', '70987653', 15), ('Sofía Beatriz', 'Gómez Cruz', '2017-09-05', '71098764', 16),
('Bruno Fernando', 'Ruiz Vargas', '2016-12-20', '72109875', 17), ('Emma Alicia', 'Ortiz Romero', '2015-04-02', '73210986', 18),
('Lucas Héctor', 'Campos Sánchez', '2014-08-14', '74321097', 19), ('Mía Lorena', 'Delgado Gómez', '2017-10-25', '75432108', 20),
('Facundo Mario', 'Ríos Castro', '2011-05-18', '76543218', 21), ('Martina Diana', 'Cruz Vargas', '2010-09-30', '77654329', 22),
('Bautista Arturo', 'Vega Rojas', '2009-12-12', '78765430', 23), ('Victoria Gloria', 'Paz Mendoza', '2012-02-24', '79876541', 24),
('Simón Gustavo', 'Suárez Ortiz', '2011-06-08', '70987652', 25), ('Emilia Paola', 'Molina Flores', '2010-10-15', '71098763', 26),
('David Eduardo', 'Rojas Cruz', '2009-01-28', '72109874', 27), ('Zoe', 'Soto Gómez', '2012-04-10', '73210985', 28),
('Tomás Víctor', 'Aguilar Romero', '2011-07-22', '74321096', 29), ('Renata', 'Soto Sánchez', '2010-11-03', '75432107', 30),
('Daniel Joaquín', 'Navarro Castro', '2009-03-16', '76543217', 31), ('Alma Inés', 'Cordero Vargas', '2012-08-05', '77654328', 32),
('Samuel', 'Escobar Rojas', '2011-10-20', '78765439', 33), ('Elsa', 'Romero Mendoza', '2010-01-14', '79876540', 34),
('Julieta', 'Lara Ortiz', '2009-05-26', '70987651', 35), ('Nadia', 'Miranda Flores', '2012-09-08', '71098762', 36),
('Felipe Daniel', 'Salazar Cruz', '2011-12-01', '72109873', 37), ('Sofía', 'Espinoza Gómez', '2010-04-12', '73210984', 38),
('Raúl', 'Chávez Romero', '2009-08-25', '74321095', 39), ('Elena', 'Gutiérrez Sánchez', '2012-11-06', '75432106', 40);


-- ==============================================================================
-- 9. PAGOS (40 Pagos - Estructura Nueva)
-- ==============================================================================
INSERT INTO pago (monto, fecha_emision, fecha_vencimiento, fecha_pago, id_estado, id_metodo_pago) VALUES
(350.00, '2026-02-15', '2026-03-01', '2026-02-20', 2, 4), (350.00, '2026-02-15', '2026-03-01', '2026-02-22', 2, 2),
(350.00, '2026-02-15', '2026-03-01', '2026-02-25', 2, 3), (350.00, '2026-02-15', '2026-03-01', '2026-02-28', 2, 1),
(350.00, '2026-02-20', '2026-03-06', '2026-03-01', 2, 4), (350.00, '2026-02-20', '2026-03-06', NULL, 1, NULL),
(350.00, '2026-02-20', '2026-03-06', NULL, 1, NULL), (350.00, '2026-02-20', '2026-03-06', '2026-03-02', 2, 2),
(350.00, '2026-02-25', '2026-03-11', '2026-03-05', 2, 3), (350.00, '2026-02-25', '2026-03-11', '2026-03-06', 2, 1),
(350.00, '2026-02-25', '2026-03-11', NULL, 1, NULL), (350.00, '2026-02-25', '2026-03-11', '2026-03-08', 2, 4),
(350.00, '2026-03-01', '2026-03-15', '2026-03-10', 2, 2), (350.00, '2026-03-01', '2026-03-15', NULL, 1, NULL),
(350.00, '2026-03-01', '2026-03-15', '2026-03-12', 2, 3), (350.00, '2026-03-01', '2026-03-15', '2026-03-14', 2, 1),
(350.00, '2026-03-05', '2026-03-19', NULL, 1, NULL), (350.00, '2026-03-05', '2026-03-19', '2026-03-15', 2, 4),
(350.00, '2026-03-05', '2026-03-19', '2026-03-16', 2, 2), (350.00, '2026-03-05', '2026-03-19', '2026-03-18', 2, 3),
(350.00, '2026-02-15', '2026-03-01', '2026-02-18', 2, 1), (350.00, '2026-02-15', '2026-03-01', '2026-02-20', 2, 4),
(350.00, '2026-02-15', '2026-03-01', '2026-02-21', 2, 2), (350.00, '2026-02-15', '2026-03-01', '2026-02-28', 2, 3),
(350.00, '2026-02-20', '2026-03-06', '2026-02-25', 2, 1), (350.00, '2026-02-20', '2026-03-06', NULL, 1, NULL),
(350.00, '2026-02-20', '2026-03-06', NULL, 1, NULL), (350.00, '2026-02-20', '2026-03-06', '2026-03-01', 2, 4),
(350.00, '2026-02-25', '2026-03-11', '2026-02-28', 2, 2), (350.00, '2026-02-25', '2026-03-11', '2026-03-03', 2, 3),
(350.00, '2026-02-25', '2026-03-11', NULL, 1, NULL), (350.00, '2026-02-25', '2026-03-11', '2026-03-05', 2, 1),
(350.00, '2026-03-01', '2026-03-15', '2026-03-05', 2, 4), (350.00, '2026-03-01', '2026-03-15', NULL, 1, NULL),
(350.00, '2026-03-01', '2026-03-15', '2026-03-10', 2, 2), (350.00, '2026-03-01', '2026-03-15', '2026-03-11', 2, 3),
(350.00, '2026-03-05', '2026-03-19', NULL, 1, NULL), (350.00, '2026-03-05', '2026-03-19', '2026-03-10', 2, 1),
(350.00, '2026-03-05', '2026-03-19', '2026-03-12', 2, 4), (350.00, '2026-03-05', '2026-03-19', '2026-03-14', 2, 2);


-- ==============================================================================
-- 10. MATRÍCULAS (40 Matrículas)
-- ==============================================================================
INSERT INTO matricula (id_alumno, id_aula, id_pago, id_estado) VALUES
(1, 1, 1, 5), (2, 1, 2, 5), (3, 2, 3, 5), (4, 2, 4, 5), (5, 3, 5, 5), (6, 3, 6, 4), (7, 4, 7, 4), (8, 4, 8, 5), (9, 5, 9, 5), (10, 5, 10, 5),
(11, 6, 11, 4), (12, 6, 12, 5), (13, 7, 13, 5), (14, 7, 14, 4), (15, 8, 15, 5), (16, 8, 16, 5), (17, 9, 17, 4), (18, 9, 18, 5), (19, 10, 19, 5), (20, 10, 20, 5),
(21, 13, 21, 5), (22, 13, 22, 5), (23, 14, 23, 5), (24, 14, 24, 5), (25, 15, 25, 5), (26, 15, 26, 4), (27, 16, 27, 4), (28, 16, 28, 5), (29, 17, 29, 5), (30, 17, 30, 5),
(31, 18, 31, 4), (32, 18, 32, 5), (33, 19, 33, 5), (34, 19, 34, 4), (35, 20, 35, 5), (36, 20, 36, 5), (37, 21, 37, 4), (38, 21, 38, 5), (39, 22, 39, 5), (40, 22, 40, 5);


-- ==============================================================================
-- 11. HORARIOS (66 Horarios)
-- ==============================================================================
INSERT INTO horario (id_aula, id_curso_docente, id_dia_semana, hora_inicio, hora_fin) VALUES
(1, 1, 1, '07:30', '10:29'), (1, 3, 2, '07:30', '10:29'), (1, 5, 3, '07:30', '10:29'), (2, 3, 1, '07:30', '10:29'), (2, 1, 2, '07:30', '10:29'), (2, 11, 3, '07:30', '10:29'),
(3, 5, 1, '07:30', '10:29'), (3, 11, 2, '07:30', '10:29'), (3, 1, 3, '07:30', '10:29'), (4, 11, 1, '07:30', '10:29'), (4, 5, 2, '07:30', '10:29'), (4, 3, 3, '07:30', '10:29'),
(5, 1, 1, '07:30', '10:29'), (5, 3, 2, '07:30', '10:29'), (5, 8, 3, '07:30', '10:29'), (6, 3, 1, '07:30', '10:29'), (6, 8, 2, '07:30', '10:29'), (6, 1, 3, '07:30', '10:29'),
(7, 8, 1, '07:30', '10:29'), (7, 10, 2, '07:30', '10:29'), (7, 3, 3, '07:30', '10:29'), (8, 10, 1, '07:30', '10:29'), (8, 1, 2, '07:30', '10:29'), (8, 8, 3, '07:30', '10:29'),
(9, 13, 1, '07:30', '10:29'), (9, 11, 2, '07:30', '10:29'), (9, 10, 3, '07:30', '10:29'), (10, 11, 1, '07:30', '10:29'), (10, 13, 2, '07:30', '10:29'), (10, 1, 3, '07:30', '10:29'),
(11, 1, 1, '07:30', '10:29'), (11, 3, 2, '07:30', '10:29'), (11, 13, 3, '07:30', '10:29'), (12, 3, 1, '07:30', '10:29'), (12, 1, 2, '07:30', '10:29'), (12, 11, 3, '07:30', '10:29'),
(13, 2, 1, '07:30', '10:29'), (13, 4, 2, '07:30', '10:29'), (13, 6, 3, '07:30', '10:29'), (14, 4, 1, '07:30', '10:29'), (14, 2, 2, '07:30', '10:29'), (14, 12, 3, '07:30', '10:29'),
(15, 6, 1, '07:30', '10:29'), (15, 12, 2, '07:30', '10:29'), (15, 2, 3, '07:30', '10:29'), (16, 12, 1, '07:30', '10:29'), (16, 6, 2, '07:30', '10:29'), (16, 4, 3, '07:30', '10:29'),
(17, 7, 1, '07:30', '10:29'), (17, 9, 2, '07:30', '10:29'), (17, 14, 3, '07:30', '10:29'), (18, 9, 1, '07:30', '10:29'), (18, 7, 2, '07:30', '10:29'), (18, 12, 3, '07:30', '10:29'),
(19, 14, 1, '07:30', '10:29'), (19, 15, 2, '07:30', '10:29'), (19, 7, 3, '07:30', '10:29'), (20, 15, 1, '07:30', '10:29'), (20, 14, 2, '07:30', '10:29'), (20, 9, 3, '07:30', '10:29'),
(21, 2, 1, '07:30', '10:29'), (21, 4, 2, '07:30', '10:29'), (21, 15, 3, '07:30', '10:29'), (22, 4, 1, '07:30', '10:29'), (22, 2, 2, '07:30', '10:29'), (22, 12, 3, '07:30', '10:29');
