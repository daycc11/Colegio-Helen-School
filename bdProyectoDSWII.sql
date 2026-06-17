-- =============================================================
-- Helen School - PostgreSQL
-- Ejecutar en Railway: Postgres → Data → pegar y ejecutar
-- Requisito: las tablas deben existir (Spring Boot ddl-auto=update)
-- =============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =============================================
-- ROLES
-- =============================================
INSERT INTO rol (nombre)
SELECT 'Auxiliar' WHERE NOT EXISTS (SELECT 1 FROM rol WHERE nombre = 'Auxiliar');

INSERT INTO rol (nombre)
SELECT 'Directora' WHERE NOT EXISTS (SELECT 1 FROM rol WHERE nombre = 'Directora');

-- =============================================
-- USUARIOS (clave encriptada con BCrypt vía pgcrypto)
-- =============================================
INSERT INTO usuario (nombres, apellidos, username, clave, idrol)
SELECT 'María', 'Rodríguez', 'mrodriguez', crypt('123456', gen_salt('bf', 10)), r.idrol
FROM rol r
WHERE r.nombre = 'Auxiliar'
  AND NOT EXISTS (SELECT 1 FROM usuario WHERE username = 'mrodriguez');

INSERT INTO usuario (nombres, apellidos, username, clave, idrol)
SELECT 'Luis', 'Gonzales', 'lgonzales', crypt('admin', gen_salt('bf', 10)), r.idrol
FROM rol r
WHERE r.nombre = 'Auxiliar'
  AND NOT EXISTS (SELECT 1 FROM usuario WHERE username = 'lgonzales');

INSERT INTO usuario (nombres, apellidos, username, clave, idrol)
SELECT 'Itzel', 'Vargas Flores', 'admin1', crypt('123456', gen_salt('bf', 10)), r.idrol
FROM rol r
WHERE r.nombre = 'Auxiliar'
  AND NOT EXISTS (SELECT 1 FROM usuario WHERE username = 'admin1');

INSERT INTO usuario (nombres, apellidos, username, clave, idrol)
SELECT 'Dayron', 'Dayron Cipriano', 'admin2', crypt('admin', gen_salt('bf', 10)), r.idrol
FROM rol r
WHERE r.nombre = 'Auxiliar'
  AND NOT EXISTS (SELECT 1 FROM usuario WHERE username = 'admin2');

-- =============================================
-- GRADOS
-- =============================================
INSERT INTO grado (nombre, seccion)
SELECT 'Primero de Secundaria', 'A' WHERE NOT EXISTS (SELECT 1 FROM grado WHERE nombre = 'Primero de Secundaria' AND seccion = 'A');

INSERT INTO grado (nombre, seccion)
SELECT 'Primero de Secundaria', 'B' WHERE NOT EXISTS (SELECT 1 FROM grado WHERE nombre = 'Primero de Secundaria' AND seccion = 'B');

INSERT INTO grado (nombre, seccion)
SELECT 'Segundo de Secundaria', 'A' WHERE NOT EXISTS (SELECT 1 FROM grado WHERE nombre = 'Segundo de Secundaria' AND seccion = 'A');

INSERT INTO grado (nombre, seccion)
SELECT 'Segundo de Secundaria', 'B' WHERE NOT EXISTS (SELECT 1 FROM grado WHERE nombre = 'Segundo de Secundaria' AND seccion = 'B');

INSERT INTO grado (nombre, seccion)
SELECT 'Tercero de Secundaria', 'A' WHERE NOT EXISTS (SELECT 1 FROM grado WHERE nombre = 'Tercero de Secundaria' AND seccion = 'A');

INSERT INTO grado (nombre, seccion)
SELECT 'Tercero de Secundaria', 'B' WHERE NOT EXISTS (SELECT 1 FROM grado WHERE nombre = 'Tercero de Secundaria' AND seccion = 'B');

-- =============================================
-- TUTORES
-- =============================================
INSERT INTO tutor (nombres, apellidos, dni, telefono, direccion, email, parentesco)
SELECT 'Carlos', 'Ramírez López', '45896321', '987654321', 'Av. Los Olivos 234', 'carlos.ramirez@example.com', 'Padre'
WHERE NOT EXISTS (SELECT 1 FROM tutor WHERE dni = '45896321');

INSERT INTO tutor (nombres, apellidos, dni, telefono, direccion, email, parentesco)
SELECT 'María', 'Fernández Torres', '75689124', '912345678', 'Jr. Las Flores 123', 'maria.fernandez@example.com', 'Madre'
WHERE NOT EXISTS (SELECT 1 FROM tutor WHERE dni = '75689124');

INSERT INTO tutor (nombres, apellidos, dni, telefono, direccion, email, parentesco)
SELECT 'José', 'Gonzales Vega', '65234189', '999888777', 'Calle Central 456', 'jose.gonzales@example.com', 'Tío'
WHERE NOT EXISTS (SELECT 1 FROM tutor WHERE dni = '65234189');

INSERT INTO tutor (nombres, apellidos, dni, telefono, direccion, email, parentesco)
SELECT 'Lucía', 'Martínez Ríos', '87456321', '955123456', 'Av. San Martín 890', 'lucia.martinez@example.com', 'Tía'
WHERE NOT EXISTS (SELECT 1 FROM tutor WHERE dni = '87456321');

INSERT INTO tutor (nombres, apellidos, dni, telefono, direccion, email, parentesco)
SELECT 'Pedro', 'Suárez Paredes', '78451236', '988112233', 'Pasaje Los Cedros 12', 'pedro.suarez@example.com', 'Hermano'
WHERE NOT EXISTS (SELECT 1 FROM tutor WHERE dni = '78451236');

INSERT INTO tutor (nombres, apellidos, dni, telefono, direccion, email, parentesco)
SELECT 'Rosa', 'Quispe Mamani', '91234567', '966778899', 'Av. Arequipa 345', 'rosa.quispe@example.com', 'Madre'
WHERE NOT EXISTS (SELECT 1 FROM tutor WHERE dni = '91234567');

INSERT INTO tutor (nombres, apellidos, dni, telefono, direccion, email, parentesco)
SELECT 'Hugo', 'Peralta Díaz', '82345678', '944556677', 'Jr. Cuzco 78', 'hugo.peralta@example.com', 'Padre'
WHERE NOT EXISTS (SELECT 1 FROM tutor WHERE dni = '82345678');

INSERT INTO tutor (nombres, apellidos, dni, telefono, direccion, email, parentesco)
SELECT 'Elena', 'Vásquez Cruz', '73456789', '933445566', 'Calle Lima 200', 'elena.vasquez@example.com', 'Madre'
WHERE NOT EXISTS (SELECT 1 FROM tutor WHERE dni = '73456789');

-- =============================================
-- ALUMNOS
-- =============================================
INSERT INTO alumno (nombres, apellidos, fecha_nacimiento, dni, id_tutor, id_grado, fecha_matricula, fecha_fin_matricula, metodo_pago, monto_pagado)
SELECT 'Andrés', 'Ramírez Soto', '2010-05-14', '12346778', t.id_tutor, g.id, '2025-03-03', '2025-12-20', 'Efectivo', 350.00
FROM tutor t, grado g
WHERE t.dni = '45896321' AND g.nombre = 'Primero de Secundaria' AND g.seccion = 'A'
  AND NOT EXISTS (SELECT 1 FROM alumno WHERE dni = '12346778');

INSERT INTO alumno (nombres, apellidos, fecha_nacimiento, dni, id_tutor, id_grado, fecha_matricula, fecha_fin_matricula, metodo_pago, monto_pagado)
SELECT 'Valeria', 'Fernández López', '2011-08-21', '23456789', t.id_tutor, g.id, '2025-03-03', '2025-12-20', 'Transferencia', 350.00
FROM tutor t, grado g
WHERE t.dni = '75689124' AND g.nombre = 'Primero de Secundaria' AND g.seccion = 'B'
  AND NOT EXISTS (SELECT 1 FROM alumno WHERE dni = '23456789');

INSERT INTO alumno (nombres, apellidos, fecha_nacimiento, dni, id_tutor, id_grado, fecha_matricula, fecha_fin_matricula, metodo_pago, monto_pagado)
SELECT 'Gabriel', 'Gonzales Torres', '2009-12-03', '34567890', t.id_tutor, g.id, '2025-03-04', '2025-12-20', 'Yape', 350.00
FROM tutor t, grado g
WHERE t.dni = '65234189' AND g.nombre = 'Segundo de Secundaria' AND g.seccion = 'A'
  AND NOT EXISTS (SELECT 1 FROM alumno WHERE dni = '34567890');

INSERT INTO alumno (nombres, apellidos, fecha_nacimiento, dni, id_tutor, id_grado, fecha_matricula, fecha_fin_matricula, metodo_pago, monto_pagado)
SELECT 'Sofía', 'Martínez Díaz', '2012-02-28', '45678901', t.id_tutor, g.id, '2025-03-04', '2025-12-20', 'Efectivo', 350.00
FROM tutor t, grado g
WHERE t.dni = '87456321' AND g.nombre = 'Primero de Secundaria' AND g.seccion = 'A'
  AND NOT EXISTS (SELECT 1 FROM alumno WHERE dni = '45678901');

INSERT INTO alumno (nombres, apellidos, fecha_nacimiento, dni, id_tutor, id_grado, fecha_matricula, fecha_fin_matricula, metodo_pago, monto_pagado)
SELECT 'Diego', 'Suárez Ramos', '2010-10-10', '56789012', t.id_tutor, g.id, '2025-03-05', '2025-12-20', 'Plin', 350.00
FROM tutor t, grado g
WHERE t.dni = '78451236' AND g.nombre = 'Primero de Secundaria' AND g.seccion = 'B'
  AND NOT EXISTS (SELECT 1 FROM alumno WHERE dni = '56789012');

INSERT INTO alumno (nombres, apellidos, fecha_nacimiento, dni, id_tutor, id_grado, fecha_matricula, fecha_fin_matricula, metodo_pago, monto_pagado)
SELECT 'Carlos', 'Ramírez Pérez', '2008-05-12', '12345678', t.id_tutor, g.id, '2025-03-05', '2025-12-20', 'Tarjeta de débito', 350.00
FROM tutor t, grado g
WHERE t.dni = '45896321' AND g.nombre = 'Primero de Secundaria' AND g.seccion = 'A'
  AND NOT EXISTS (SELECT 1 FROM alumno WHERE dni = '12345678');

INSERT INTO alumno (nombres, apellidos, fecha_nacimiento, dni, id_tutor, id_grado, fecha_matricula, fecha_fin_matricula, metodo_pago, monto_pagado)
SELECT 'María', 'López Torres', '2007-11-23', '87654321', t.id_tutor, g.id, '2025-03-06', '2025-12-20', 'Efectivo', 350.00
FROM tutor t, grado g
WHERE t.dni = '75689124' AND g.nombre = 'Primero de Secundaria' AND g.seccion = 'B'
  AND NOT EXISTS (SELECT 1 FROM alumno WHERE dni = '87654321');

INSERT INTO alumno (nombres, apellidos, fecha_nacimiento, dni, id_tutor, id_grado, fecha_matricula, fecha_fin_matricula, metodo_pago, monto_pagado)
SELECT 'Juan', 'Gómez Díaz', '2009-01-15', '45678912', t.id_tutor, g.id, '2025-03-06', '2025-12-20', 'Transferencia', 350.00
FROM tutor t, grado g
WHERE t.dni = '45896321' AND g.nombre = 'Primero de Secundaria' AND g.seccion = 'A'
  AND NOT EXISTS (SELECT 1 FROM alumno WHERE dni = '45678912');

INSERT INTO alumno (nombres, apellidos, fecha_nacimiento, dni, id_tutor, id_grado, fecha_matricula, fecha_fin_matricula, metodo_pago, monto_pagado)
SELECT 'Lucía', 'Martínez Vega', '2008-07-19', '65432198', t.id_tutor, g.id, '2025-03-07', '2025-12-20', 'Yape', 350.00
FROM tutor t, grado g
WHERE t.dni = '65234189' AND g.nombre = 'Primero de Secundaria' AND g.seccion = 'B'
  AND NOT EXISTS (SELECT 1 FROM alumno WHERE dni = '65432198');

INSERT INTO alumno (nombres, apellidos, fecha_nacimiento, dni, id_tutor, id_grado, fecha_matricula, fecha_fin_matricula, metodo_pago, monto_pagado)
SELECT 'Fernanda', 'Quispe Huanca', '2009-04-22', '71234567', t.id_tutor, g.id, '2025-03-07', '2025-12-20', 'Efectivo', 350.00
FROM tutor t, grado g
WHERE t.dni = '91234567' AND g.nombre = 'Segundo de Secundaria' AND g.seccion = 'A'
  AND NOT EXISTS (SELECT 1 FROM alumno WHERE dni = '71234567');

INSERT INTO alumno (nombres, apellidos, fecha_nacimiento, dni, id_tutor, id_grado, fecha_matricula, fecha_fin_matricula, metodo_pago, monto_pagado)
SELECT 'Sebastián', 'Peralta Mendoza', '2008-09-11', '81234567', t.id_tutor, g.id, '2025-03-10', '2025-12-20', 'Plin', 350.00
FROM tutor t, grado g
WHERE t.dni = '82345678' AND g.nombre = 'Segundo de Secundaria' AND g.seccion = 'B'
  AND NOT EXISTS (SELECT 1 FROM alumno WHERE dni = '81234567');

INSERT INTO alumno (nombres, apellidos, fecha_nacimiento, dni, id_tutor, id_grado, fecha_matricula, fecha_fin_matricula, metodo_pago, monto_pagado)
SELECT 'Camila', 'Vásquez Ríos', '2010-12-30', '72345678', t.id_tutor, g.id, '2025-03-10', '2025-12-20', 'Tarjeta de crédito', 350.00
FROM tutor t, grado g
WHERE t.dni = '73456789' AND g.nombre = 'Tercero de Secundaria' AND g.seccion = 'A'
  AND NOT EXISTS (SELECT 1 FROM alumno WHERE dni = '72345678');

INSERT INTO alumno (nombres, apellidos, fecha_nacimiento, dni, id_tutor, id_grado, fecha_matricula, fecha_fin_matricula, metodo_pago, monto_pagado)
SELECT 'Mateo', 'Flores Paredes', '2007-06-18', '83456789', t.id_tutor, g.id, '2025-03-11', '2025-12-20', 'Efectivo', 350.00
FROM tutor t, grado g
WHERE t.dni = '91234567' AND g.nombre = 'Tercero de Secundaria' AND g.seccion = 'B'
  AND NOT EXISTS (SELECT 1 FROM alumno WHERE dni = '83456789');

INSERT INTO alumno (nombres, apellidos, fecha_nacimiento, dni, id_tutor, id_grado, fecha_matricula, fecha_fin_matricula, metodo_pago, monto_pagado)
SELECT 'Isabella', 'Torres Campos', '2011-03-05', '74567890', t.id_tutor, g.id, '2025-03-11', '2025-12-20', 'Yape', 350.00
FROM tutor t, grado g
WHERE t.dni = '82345678' AND g.nombre = 'Segundo de Secundaria' AND g.seccion = 'A'
  AND NOT EXISTS (SELECT 1 FROM alumno WHERE dni = '74567890');

INSERT INTO alumno (nombres, apellidos, fecha_nacimiento, dni, id_tutor, id_grado, fecha_matricula, fecha_fin_matricula, metodo_pago, monto_pagado)
SELECT 'Nicolás', 'Cruz Espinoza', '2008-11-27', '85678901', t.id_tutor, g.id, '2025-03-12', '2025-12-20', 'Transferencia', 350.00
FROM tutor t, grado g
WHERE t.dni = '73456789' AND g.nombre = 'Segundo de Secundaria' AND g.seccion = 'B'
  AND NOT EXISTS (SELECT 1 FROM alumno WHERE dni = '85678901');

-- =============================================
-- DOCENTES
-- =============================================
INSERT INTO docente (nombres, apellidos, dni, telefono, email, especialidad, direccion)
SELECT 'Ana', 'García Ríos', '11223344', '987001122', 'ana.garcia@helenSchool.edu.pe', 'Matemáticas', 'Av. Los Pinos 101'
WHERE NOT EXISTS (SELECT 1 FROM docente WHERE dni = '11223344');

INSERT INTO docente (nombres, apellidos, dni, telefono, email, especialidad, direccion)
SELECT 'Carlos', 'Mendoza López', '22334455', '987002233', 'c.mendoza@helenSchool.edu.pe', 'Comunicación', 'Jr. Las Magnolias 55'
WHERE NOT EXISTS (SELECT 1 FROM docente WHERE dni = '22334455');

INSERT INTO docente (nombres, apellidos, dni, telefono, email, especialidad, direccion)
SELECT 'Rosa', 'Vargas Chávez', '33445566', '987003344', 'r.vargas@helenSchool.edu.pe', 'Ciencias Naturales', 'Calle San Borja 234'
WHERE NOT EXISTS (SELECT 1 FROM docente WHERE dni = '33445566');

INSERT INTO docente (nombres, apellidos, dni, telefono, email, especialidad, direccion)
SELECT 'Miguel', 'Torres Huanca', '44556677', '987004455', 'm.torres@helenSchool.edu.pe', 'Historia y Geografía', 'Av. Grau 789'
WHERE NOT EXISTS (SELECT 1 FROM docente WHERE dni = '44556677');

INSERT INTO docente (nombres, apellidos, dni, telefono, email, especialidad, direccion)
SELECT 'Lucía', 'Quispe Ramos', '55667788', '987005566', 'l.quispe@helenSchool.edu.pe', 'Inglés', 'Pasaje Los Cedros 12'
WHERE NOT EXISTS (SELECT 1 FROM docente WHERE dni = '55667788');

INSERT INTO docente (nombres, apellidos, dni, telefono, email, especialidad, direccion)
SELECT 'Jorge', 'Salinas Pachas', '66778899', '987006677', 'j.salinas@helenSchool.edu.pe', 'Educación Física', 'Av. República 456'
WHERE NOT EXISTS (SELECT 1 FROM docente WHERE dni = '66778899');

INSERT INTO docente (nombres, apellidos, dni, telefono, email, especialidad, direccion)
SELECT 'Carmen', 'Huanca Flores', '77889900', '987007788', 'c.huanca@helenSchool.edu.pe', 'Arte y Cultura', 'Jr. Amazonas 321'
WHERE NOT EXISTS (SELECT 1 FROM docente WHERE dni = '77889900');
