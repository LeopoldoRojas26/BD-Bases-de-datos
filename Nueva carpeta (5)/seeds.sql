-- =====================================================
-- Script de Datos (seeds.sql) - PostgreSQL
-- Sistema de Gestión 

-- =====================================================
-- MÓDULO 1: RECURSOS HUMANOS
-- =====================================================

-- ============================================================
--  TABLAS DE CATÁLOGO  
-- ============================================================

-- Puestos (tabla de catálogo - 10 registros)
INSERT INTO Puestos (nombre_puesto, nivel, salario_base, descripcion) VALUES
  ('Gerente General de Tienda', 'C-Level', 45000.00, 'Responsable total de operaciones de la tienda'),
  ('Gerente de RRHH',           'senior',  28000.00, 'Gestión de personal y nóminas'),
  ('Supervisor de Piso',        'senior',  22000.00, 'Supervisión de ventas y atención al cliente'),
  ('Cajero',                    'junior',  12000.00, 'Cobro y atención en cajas'),
  ('Almacenista',               'mid',     15000.00, 'Control de inventario y recepción de mercancía'),
  ('Empacador',                 'junior',  10000.00, 'Empaque de productos y apoyo general'),
  ('Guardia de Seguridad',      'mid',     14000.00, 'Vigilancia y seguridad de la tienda'),
  ('Encargado de Carnicería',   'mid',     18000.00, 'Manejo y venta de productos cárnicos'),
  ('Contador',                  'senior',  30000.00, 'Control contable y fiscal'),
  ('Encargado de Limpieza',     'junior',  11000.00, 'Mantenimiento y limpieza de instalaciones');

-- Turnos  (4 registros)
INSERT INTO Turnos (nombre_turno, hora_inicio, hora_fin, dias_laborales) VALUES
  ('Matutino',   '08:00', '16:00', 'Lun-Vie'),
  ('Vespertino', '14:00', '22:00', 'Lun-Vie'),
  ('Nocturno',   '22:00', '06:00', 'Lun-Sab'),
  ('Mixto',      '10:00', '19:00', 'Lun-Sab');

-- Departamentos  (sin id_jefe aún; se actualiza después de insertar empleados)
INSERT INTO Departamentos (nombre_departamento, ubicacion) VALUES
  ('Gerencia General',    'Área Administrativa - Piso 2'),
  ('Recursos Humanos',    'Área Administrativa - Piso 2'),
  ('Área de Ventas',      'Piso de Venta - Zona Central'),
  ('Finanzas y Caja',     'Área de Cajas - Planta Baja'),
  ('Almacén y Logística', 'Bodega Principal - Área Trasera');

-- Roles  (5 registros)
INSERT INTO Roles (nombre_rol, descripcion) VALUES
  ('Admin',      'Acceso total al sistema'),
  ('RRHH',       'Gestión de personal, nóminas y asistencias'),
  ('Supervisor', 'Consulta y aprobación de su equipo'),
  ('Empleado',   'Consulta de sus propios datos'),
  ('Auditor',    'Acceso de solo lectura a bitácoras');

-- Permisos del Sistema  (15 registros)
INSERT INTO PermisosSistema (nombre_permiso, modulo, descripcion) VALUES
  ('ver_empleados',       'RRHH',  'Consultar la lista de empleados'),
  ('editar_empleado',     'RRHH',  'Modificar datos de un empleado'),
  ('eliminar_empleado',   'RRHH',  'Dar de baja a un empleado'),
  ('ver_nomina',          'RRHH',  'Consultar recibos de nómina'),
  ('procesar_nomina',     'RRHH',  'Generar y cerrar períodos de nómina'),
  ('ver_asistencias',     'RRHH',  'Consultar registros de asistencia'),
  ('editar_asistencias',  'RRHH',  'Corregir registros de asistencia'),
  ('ver_contratos',       'RRHH',  'Consultar contratos laborales'),
  ('editar_contratos',    'RRHH',  'Crear o modificar contratos'),
  ('ver_incidencias',     'RRHH',  'Consultar incidencias'),
  ('gestionar_usuarios',  'Admin', 'Crear, editar y desactivar usuarios'),
  ('asignar_roles',       'Admin', 'Asignar o revocar roles'),
  ('ver_bitacora',        'Admin', 'Consultar el log de auditoría'),
  ('ver_sesiones',        'Admin', 'Consultar sesiones activas'),
  ('aprobar_permisos',    'RRHH',  'Aprobar o rechazar solicitudes de vacaciones/permisos');

-- Empleados (tabla transaccional - 10 registros)
INSERT INTO Empleados
  (nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo,
   curp, rfc, email, telefono,
   id_puesto, id_departamento, id_turno, fecha_ingreso, estatus)
VALUES
  ('Roberto','Gómez','Herrera',  '1978-04-12','M',
   'GOHR780412HJCMRB00','GOHR780412AB1','roberto.gomez@empresa.mx',   '3311001001', 1,1,1,'2010-01-15','activo'),
  ('Laura','Martínez','Pérez',   '1985-07-23','F',
   'MAPL850723MJCRRR01','MAPL850723CD2','laura.martinez@empresa.mx',  '3311001002', 2,2,1,'2013-03-01','activo'),
  ('Carlos','Ruiz','Sánchez',    '1990-11-05','M',
   'RUSC901105HJCZRL02','RUSC901105EF3','carlos.ruiz@empresa.mx',     '3311001003', 3,3,1,'2015-06-10','activo'),
  ('Ana','López','Vega',         '1992-02-18','F',
   'LOVA920218MJCPGN03','LOVA920218GH4','ana.lopez@empresa.mx',       '3311001004', 4,2,1,'2016-09-01','activo'),
  ('Miguel','Torres','Díaz',     '1988-08-30','M',
   'TODM880830HJCRRG04','TODM880830IJ5','miguel.torres@empresa.mx',   '3311001005', 5,3,2,'2017-01-20','activo'),
  ('Sofía','Ramírez','Cruz',     '1995-05-14','F',
   'RACS950514MJCMZF05','RACS950514KL6','sofia.ramirez@empresa.mx',   '3311001006', 6,3,2,'2019-03-15','activo'),
  ('Diego','Flores','Moreno',    '1987-12-01','M',
   'FLMD871201HJCRLG06','FLMD871201MN7','diego.flores@empresa.mx',    '3311001007', 7,3,1,'2018-07-01','activo'),
  ('Héctor','Mendoza','Alvarado','1980-03-07','M',
   'MEAH800307HJCNLC08','MEAH800307QR9','hector.mendoza@empresa.mx',  '3311001009', 9,4,1,'2012-05-15','activo'),
  ('Paola','Castillo','Núñez',   '1996-06-28','F',
   'CANP960628MJCSXL09','CANP960628ST0','paola.castillo@empresa.mx',  '3311001010',10,5,1,'2021-02-01','activo'),
  ('Valentina','Jiménez','Reyes','1993-09-22','F',
   'JERV930922MJCMYN07','JERV930922OP8','valentina.jimenez@empresa.mx','3311001008',8,3,4,'2020-01-10','activo');

-- Asignar jefes a departamentos
UPDATE Departamentos SET id_jefe = 1 WHERE id_departamento = 1;  -- Roberto -> Dirección
UPDATE Departamentos SET id_jefe = 2 WHERE id_departamento = 2;  -- Laura   -> RRHH
UPDATE Departamentos SET id_jefe = 3 WHERE id_departamento = 3;  -- Carlos  -> TI
UPDATE Departamentos SET id_jefe = 8 WHERE id_departamento = 4;  -- Héctor  -> Finanzas
UPDATE Departamentos SET id_jefe = 9 WHERE id_departamento = 5;  -- Paola   -> Atención

-- ============================================================
-- ASISTENCIAS  (50 registros)
-- ============================================================

INSERT INTO Asistencias (id_empleado, fecha, hora_entrada, hora_salida, estatus, observaciones) VALUES
  (1, '2025-04-01','08:02','16:05','presente', NULL),
  (2, '2025-04-01','07:58','16:00','presente', NULL),
  (3, '2025-04-01','08:15','16:10','retardo',  'Tráfico en vialidad'),
  (4, '2025-04-01','08:00','16:00','presente', NULL),
  (5, '2025-04-01','14:00','22:00','presente', NULL),
  (6, '2025-04-01','14:10','22:05','retardo',  NULL),
  (7, '2025-04-01','08:05','16:00','presente', NULL),
  (8, '2025-04-01',NULL,   NULL,   'falta',    'Sin aviso'),
  (9, '2025-04-01','08:00','16:00','presente', NULL),
  (10,'2025-04-01','08:30','16:00','retardo',  'Cita médica'),
  (1, '2025-04-02','08:00','16:00','presente', NULL),
  (2, '2025-04-02','08:00','16:00','presente', NULL),
  (3, '2025-04-02','08:00','16:00','presente', NULL),
  (4, '2025-04-02',NULL,   NULL,   'permiso',  'Permiso personal'),
  (5, '2025-04-02','14:00','22:00','presente', NULL),
  (6, '2025-04-02','14:00','22:00','presente', NULL),
  (7, '2025-04-02','08:00','16:00','presente', NULL),
  (8, '2025-04-02','08:05','16:00','presente', NULL),
  (9, '2025-04-02','08:00','16:00','presente', NULL),
  (10,'2025-04-02','08:00','16:00','presente', NULL),
  (1, '2025-04-03','08:00','16:00','presente', NULL),
  (2, '2025-04-03','08:00','16:00','presente', NULL),
  (3, '2025-04-03',NULL,   NULL,   'falta',    'Incapacidad médica'),
  (4, '2025-04-03','08:00','16:00','presente', NULL),
  (5, '2025-04-03','14:05','22:00','retardo',  NULL),
  (6, '2025-04-03','14:00','22:00','presente', NULL),
  (7, '2025-04-03','08:00','16:00','presente', NULL),
  (8, '2025-04-03','08:00','16:00','presente', NULL),
  (9, '2025-04-03','08:00','16:00','presente', NULL),
  (10,'2025-04-03','08:00','16:00','presente', NULL),
  (1, '2025-04-04','08:00','16:00','presente', NULL),
  (2, '2025-04-04','08:00','16:00','presente', NULL),
  (3, '2025-04-04','08:00','16:00','presente', NULL),
  (4, '2025-04-04','08:20','16:00','retardo',  'Problema de transporte'),
  (5, '2025-04-04','14:00','22:00','presente', NULL),
  (6, '2025-04-04','14:00','22:00','presente', NULL),
  (7, '2025-04-04',NULL,   NULL,   'permiso',  'Asunto familiar'),
  (8, '2025-04-04','08:00','16:00','presente', NULL),
  (9, '2025-04-04','08:00','16:00','presente', NULL),
  (10,'2025-04-04','08:00','16:00','presente', NULL),
  (1, '2025-04-05','08:00','16:00','presente', NULL),
  (2, '2025-04-05','08:00','16:00','presente', NULL),
  (3, '2025-04-05','08:00','16:00','presente', NULL),
  (4, '2025-04-05','08:00','16:00','presente', NULL),
  (5, '2025-04-05','14:00','22:00','presente', NULL),
  (6, '2025-04-05','14:00','22:00','presente', NULL),
  (7, '2025-04-05','08:00','16:00','presente', NULL),
  (8, '2025-04-05','08:00','16:00','presente', NULL),
  (9, '2025-04-05','08:00','16:00','presente', NULL),
  (10,'2025-04-05','08:00','16:00','presente', NULL),
  (1, '2025-04-07','08:00','16:00','presente', NULL),
  (2, '2025-04-07','08:00','16:00','presente', NULL),
  (3, '2025-04-07','08:00','16:00','presente', NULL),
  (5, '2025-04-07','14:00','22:00','presente', NULL),
  (6, '2025-04-07','14:00','22:00','presente', NULL),
  (7, '2025-04-07','08:00','16:00','presente', NULL),
  (1, '2025-04-08','08:00','16:00','presente', NULL),
  (2, '2025-04-08','08:00','16:00','presente', NULL),
  (4, '2025-04-08','08:00','16:00','presente', NULL),
  (5, '2025-04-08','14:00','22:00','presente', NULL),
  (8, '2025-04-08','08:00','16:00','presente', NULL);

-- ============================================================
-- NÓMINAS  (10 registros – un período por empleado activo)
-- ============================================================

INSERT INTO Nominas
  (id_empleado, periodo_inicio, periodo_fin, salario_bruto, deducciones, salario_neto, fecha_pago, metodo_pago)
VALUES
  (1, '2025-03-01','2025-03-31', 95000.00, 28500.00, 66500.00, '2025-04-01','transferencia'),
  (2, '2025-03-01','2025-03-31', 55000.00, 16500.00, 38500.00, '2025-04-01','transferencia'),
  (3, '2025-03-01','2025-03-31', 60000.00, 18000.00, 42000.00, '2025-04-01','transferencia'),
  (4, '2025-03-01','2025-03-31', 22000.00,  6600.00, 15400.00, '2025-04-01','transferencia'),
  (5, '2025-03-01','2025-03-31', 38000.00, 11400.00, 26600.00, '2025-04-01','transferencia'),
  (6, '2025-03-01','2025-03-31', 35000.00, 10500.00, 24500.00, '2025-04-01','transferencia'),
  (7, '2025-03-01','2025-03-31', 45000.00, 13500.00, 31500.00, '2025-04-01','transferencia'),
  (8, '2025-03-01','2025-03-31', 18000.00,  5400.00, 12600.00, '2025-04-01','transferencia'),
  (9, '2025-03-01','2025-03-31', 30000.00,  9000.00, 21000.00, '2025-04-01','transferencia'),
  (10,'2025-03-01','2025-03-31', 14000.00,  4200.00,  9800.00, '2025-04-01','transferencia');

-- ============================================================
-- INCIDENCIAS  (10 registros)
-- ============================================================

INSERT INTO Incidencias (id_empleado, tipo_incidencia, fecha, descripcion, impacto_nomina, id_nomina) VALUES
  (3, 'retardo',     '2025-04-01','Retardo por tráfico',           1, 3),
  (6, 'retardo',     '2025-04-01','Retardo sin justificación',     1, 6),
  (8, 'falta',       '2025-04-01','Falta injustificada',           1, 8),
  (10,'retardo',     '2025-04-01','Llegada tardía por cita médica',0, 10),
  (4, 'permiso',     '2025-04-02','Permiso personal autorizado',   0, 4),
  (5, 'retardo',     '2025-04-03','Retardo vespertino',            1, 5),
  (3, 'falta',       '2025-04-03','Incapacidad IMSS',              0, 3),
  (4, 'retardo',     '2025-04-04','Problema de transporte',        1, 4),
  (7, 'permiso',     '2025-04-04','Permiso asunto familiar',       0, 7),
  (1, 'horas extra', '2025-03-28','Cierre de mes fiscal',          1, 1);

-- ============================================================
-- CONTRATOS  (10 registros)
-- ============================================================

INSERT INTO Contratos
  (id_empleado, tipo_contrato, fecha_inicio, fecha_fin, salario_pactado, documento_url, estatus)
VALUES
  (1, 'Indefinido','2010-01-15', NULL,        95000.00, '/docs/contratos/001.pdf','activo'),
  (2, 'Indefinido','2013-03-01', NULL,        55000.00, '/docs/contratos/002.pdf','activo'),
  (3, 'Indefinido','2015-06-10', NULL,        60000.00, '/docs/contratos/003.pdf','activo'),
  (4, 'Indefinido','2016-09-01', NULL,        22000.00, '/docs/contratos/004.pdf','activo'),
  (5, 'Indefinido','2017-01-20', NULL,        38000.00, '/docs/contratos/005.pdf','activo'),
  (6, 'Indefinido','2019-03-15', NULL,        35000.00, '/docs/contratos/006.pdf','activo'),
  (7, 'Indefinido','2018-07-01', NULL,        45000.00, '/docs/contratos/007.pdf','activo'),
  (8, 'Temporal',  '2024-01-10','2025-01-10', 18000.00, '/docs/contratos/008.pdf','activo'),
  (9, 'Indefinido','2012-05-15', NULL,        30000.00, '/docs/contratos/009.pdf','activo'),
  (10,'Temporal',  '2025-02-01','2025-08-01', 14000.00, '/docs/contratos/010.pdf','activo');

-- ============================================================
-- VACACIONES / PERMISOS  (10 registros)
-- ============================================================

INSERT INTO VacacionesPermisos
  (id_empleado, tipo, fecha_inicio, fecha_fin, dias_solicitados, estatus_aprobacion, id_aprobador, motivo)
VALUES
  (4, 'permiso_con_goce', '2025-04-02','2025-04-02', 1,'aprobado', 2,'Permiso personal'),
  (7, 'permiso_con_goce', '2025-04-04','2025-04-04', 1,'aprobado', 3,'Asunto familiar'),
  (5, 'vacaciones',       '2025-05-05','2025-05-16',10,'aprobado', 3,'Vacaciones de mayo'),
  (6, 'vacaciones',       '2025-06-02','2025-06-13',10,'pendiente',3, NULL),
  (9, 'vacaciones',       '2025-07-07','2025-07-18',10,'aprobado', 2,'Vacaciones anuales'),
  (10,'permiso_sin_goce', '2025-04-15','2025-04-15', 1,'pendiente',2,'Trámite personal'),
  (2, 'vacaciones',       '2025-08-04','2025-08-15',10,'aprobado', 1,'Vacaciones gerencia'),
  (8, 'permiso_con_goce', '2025-04-10','2025-04-11', 2,'aprobado', 2,'Cita médica especialidad'),
  (3, 'permiso_con_goce', '2025-04-03','2025-04-03', 1,'aprobado', 3,'Incapacidad IMSS'),
  (1, 'vacaciones',       '2025-12-22','2025-12-31', 8,'aprobado', NULL,'Vacaciones navideñas');

-- ============================================================
-- USUARIOS  (8 registros)
-- ============================================================
INSERT INTO Usuarios (id_empleado, username, password_hash, email, estatus, fecha_creacion, ultimo_acceso) VALUES
  (1, 'rgomez',     '$2b$12$HASH_DIR001', 'rgomez@sistema.mx',     'activo',  '2010-01-15 09:00:00', '2025-04-08 08:05:00'),
  (2, 'lmartinez',  '$2b$12$HASH_RH002',  'lmartinez@sistema.mx',  'activo',  '2013-03-01 09:00:00', '2025-04-08 07:58:00'),
  (3, 'cruiz',      '$2b$12$HASH_TI003',  'cruiz@sistema.mx',      'activo',  '2015-06-10 09:00:00', '2025-04-08 08:00:00'),
  (4, 'alopez',     '$2b$12$HASH_AN004',  'alopez@sistema.mx',     'activo',  '2016-09-01 09:00:00', '2025-04-07 08:01:00'),
  (5, 'mtorres',    '$2b$12$HASH_DEV05', 'mtorres@sistema.mx',    'activo',  '2017-01-20 09:00:00', '2025-04-07 14:00:00'),
  (7, 'dflores',    '$2b$12$HASH_DBA07', 'dflores@sistema.mx',    'activo',  '2018-07-01 09:00:00', '2025-04-07 08:05:00'),
  (9, 'hmendoza',   '$2b$12$HASH_CON09', 'hmendoza@sistema.mx',   'activo',  '2012-05-15 09:00:00', '2025-04-08 08:00:00'),
  (NULL,'auditor1', '$2b$12$HASH_AUD01', 'auditor@consultora.mx', 'activo',  '2024-01-10 10:00:00', '2025-04-01 09:00:00');

-- ============================================================
-- TABLA PUENTE  Rol_Permiso  (asignamos permisos a roles)
-- ============================================================

INSERT INTO Rol_Permiso (id_rol, id_permiso_sys) VALUES
  -- Admin tiene todos los permisos
  (1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),(1,12),(1,13),(1,14),(1,15),
  -- RRHH
  (2,1),(2,2),(2,4),(2,5),(2,6),(2,7),(2,8),(2,9),(2,10),(2,15),
  -- Supervisor
  (3,1),(3,4),(3,6),(3,10),(3,15),
  -- Empleado
  (4,1),(4,4),(4,6),
  -- Auditor
  (5,13),(5,14);

-- ============================================================
-- TABLA PUENTE  Usuario_Rol
-- ============================================================

INSERT INTO Usuario_Rol (id_usuario, id_rol, fecha_asignacion) VALUES
  (1,1,'2010-01-15'),  -- rgomez   -> Admin
  (2,2,'2013-03-01'),  -- lmartinez-> RRHH
  (3,3,'2015-06-10'),  -- cruiz    -> Supervisor
  (4,4,'2016-09-01'),  -- alopez   -> Empleado
  (4,2,'2020-01-01'),  -- alopez   también RRHH
  (5,4,'2017-01-20'),  -- mtorres  -> Empleado
  (7,4,'2018-07-01'),  -- dflores  -> Empleado
  (7,3,'2022-01-01'),  -- dflores  también Supervisor
  (8,5,'2024-01-10');  -- auditor1 -> Auditor

-- ============================================================
-- SESIONES  (8 registros)
-- ============================================================

INSERT INTO Sesiones
  (id_usuario, token_sesion, fecha_inicio, fecha_expiracion, fecha_cierre, ip_acceso, dispositivo, estatus)
VALUES
  (1,'tok_DIR_20250408_001','2025-04-08 08:05:00','2025-04-08 16:05:00', NULL,              '192.168.1.10','Chrome 124 / Windows 11','activa'),
  (2,'tok_RH_20250408_002', '2025-04-08 07:58:00','2025-04-08 15:58:00', NULL,              '192.168.1.11','Firefox 125 / macOS',    'activa'),
  (3,'tok_TI_20250408_003', '2025-04-08 08:00:00','2025-04-08 16:00:00', NULL,              '192.168.1.12','Chrome 124 / Ubuntu',    'activa'),
  (7,'tok_DBA_20250407_004','2025-04-07 08:05:00','2025-04-07 16:05:00','2025-04-07 16:03:00','192.168.1.15','Edge 124 / Windows 11', 'cerrada'),
  (8,'tok_AUD_20250401_006','2025-04-01 09:00:00','2025-04-01 17:00:00','2025-04-01 16:45:00','10.0.0.50', 'Safari 17 / macOS',      'cerrada'),
  (1,'tok_DIR_20250407_007','2025-04-07 08:00:00','2025-04-07 16:00:00','2025-04-07 16:00:00','192.168.1.10','Chrome 124 / Windows 11','cerrada'),
  (2,'tok_RH_20250407_008', '2025-04-07 08:00:00','2025-04-07 16:00:00','2025-04-07 15:50:00','192.168.1.11','Firefox 125 / macOS',   'cerrada'),
  (4,'tok_AN_20250407_009', '2025-04-07 08:01:00','2025-04-07 16:01:00','2025-04-07 16:00:00','192.168.1.13','Chrome 124 / Windows 10','cerrada');

-- ============================================================
-- BITÁCORA / LOG  (10 registros)
-- ============================================================

INSERT INTO BitacoraLog
  (id_usuario, accion, tabla_afectada, id_registro, datos_anteriores, datos_nuevos, fecha_hora, ip_origen)
VALUES
  (1,'INSERT','Empleados',    10, NULL,
   '{"nombre":"Paola","apellido":"Castillo","estatus":"activo"}',
   '2021-02-01 09:15:00','192.168.1.10'),
  (2,'UPDATE','Empleados',    10,
   '{"estatus":"activo"}','{"estatus":"activo"}',
   '2025-04-01 17:10:00','192.168.1.11'),
  (2,'INSERT','Contratos',    10, NULL,
   '{"tipo":"Temporal","estatus":"activo"}',
   '2025-02-01 17:12:00','192.168.1.11'),
  (1,'INSERT','Departamentos', 5, NULL,
   '{"nombre":"Atención al Cliente"}',
   '2021-01-05 10:00:00','192.168.1.10'),
  (3,'UPDATE','Asistencias',   3,
   '{"estatus":"presente"}','{"estatus":"retardo","observaciones":"Tráfico en vialidad"}',
   '2025-04-01 09:00:00','192.168.1.12'),
  (2,'INSERT','Nominas',       5, NULL,
   '{"id_empleado":5,"periodo":"2025-03","salario_bruto":38000}',
   '2025-04-01 10:00:00','192.168.1.11'),
  (2,'INSERT','VacacionesPermisos', 3, NULL,
   '{"id_empleado":5,"tipo":"vacaciones","dias":10}',
   '2025-04-02 09:30:00','192.168.1.11'),
  (2,'UPDATE','VacacionesPermisos', 3,
   '{"estatus_aprobacion":"pendiente"}','{"estatus_aprobacion":"aprobado"}',
   '2025-04-02 10:00:00','192.168.1.11'),
  (8,'SELECT','BitacoraLog',  NULL, NULL, NULL,
   '2025-04-01 09:05:00','10.0.0.50'),
  (3,'UPDATE','Puestos',       5,
   '{"salario_base":36000}','{"salario_base":38000}',
   '2025-01-15 11:00:00','192.168.1.12');


-- =====================================================
-- MÓDULO 2: SUCURSALES - DATOS COMPLETOS
-- =====================================================

-- ============================================================
-- TABLAS DE CATÁLOGO
-- ============================================================

-- Estados (tabla de catálogo - 10 registros)
INSERT INTO estado (nombre, abreviatura) VALUES
('Jalisco', 'JAL'),
('Nuevo León', 'NL'),
('Ciudad de México', 'CDMX'),
('Estado de México', 'EDOMEX'),
('Puebla', 'PUE'),
('Querétaro', 'QRO'),
('Guanajuato', 'GTO'),
('Yucatán', 'YUC'),
('Quintana Roo', 'QR'),
('Veracruz', 'VER');

-- Ciudades (tabla de catálogo - 10 registros, una por estado)
INSERT INTO ciudad (nombre, id_estado) VALUES
('Guadalajara', 1),
('Monterrey', 2),
('Cuauhtémoc', 3),
('Toluca', 4),
('Puebla de Zaragoza', 5),
('Santiago de Querétaro', 6),
('León', 7),
('Mérida', 8),
('Cancún', 9),
('Boca del Río', 10);

-- ============================================================
-- TABLAS TRANSACCIONALES
-- ============================================================

-- Direcciones (tabla transaccional - 50 registros)
INSERT INTO direccion (calle, numero, colonia, codigo_postal, id_ciudad) VALUES
('Av. Reforma', '100', 'Centro', '01000', 1),
('Calle Hidalgo', '101', 'Norte', '01001', 2),
('Boulevard Juárez', '102', 'Sur', '01002', 3),
('Av. Insurgentes', '103', 'Este', '01003', 4),
('Calle Madero', '104', 'Oeste', '01004', 5),
('Calzada Zaragoza', '105', 'Valle', '01005', 6),
('Av. Universidad', '106', 'Centro', '01006', 7),
('Calle 5 de Mayo', '107', 'Norte', '01007', 8),
('Boulevard Aeropuerto', '108', 'Sur', '01008', 9),
('Av. Tecnológico', '109', 'Este', '01009', 10),
('Calle Morelos', '110', 'Oeste', '01010', 1),
('Calzada de Tlalpan', '111', 'Valle', '01011', 2),
('Av. Constitución', '112', 'Centro', '01012', 3),
('Calle Allende', '113', 'Norte', '01013', 4),
('Boulevard Kukulcán', '114', 'Sur', '01014', 5),
('Av. López Mateos', '115', 'Este', '01015', 6),
('Calle Guerrero', '116', 'Oeste', '01016', 7),
('Calzada Independencia', '117', 'Valle', '01017', 8),
('Av. Américas', '118', 'Centro', '01018', 9),
('Calle Victoria', '119', 'Norte', '01019', 10),
('Boulevard Revolución', '120', 'Sur', '01020', 1),
('Av. Patria', '121', 'Este', '01021', 2),
('Calle Libertad', '122', 'Oeste', '01022', 3),
('Calzada Madero', '123', 'Valle', '01023', 4),
('Av. Vallarta', '124', 'Centro', '01024', 5),
('Calle Independencia', '125', 'Norte', '01025', 6),
('Boulevard Norte', '126', 'Sur', '01026', 7),
('Av. Central', '127', 'Este', '01027', 8),
('Calle Progreso', '128', 'Oeste', '01028', 9),
('Calzada del Valle', '129', 'Valle', '01029', 10),
('Av. Lázaro Cárdenas', '130', 'Centro', '01030', 1),
('Calle Mina', '131', 'Norte', '01031', 2),
('Boulevard Sur', '132', 'Sur', '01032', 3),
('Av. Principal', '133', 'Este', '01033', 4),
('Calle Aldama', '134', 'Oeste', '01034', 5),
('Calzada de los Héroes', '135', 'Valle', '01035', 6),
('Av. Las Torres', '136', 'Centro', '01036', 7),
('Calle Matamoros', '137', 'Norte', '01037', 8),
('Boulevard Atlixco', '138', 'Sur', '01038', 9),
('Av. del Parque', '139', 'Este', '01039', 10),
('Calle Galeana', '140', 'Oeste', '01040', 1),
('Calzada Zavaleta', '141', 'Valle', '01041', 2),
('Av. de las Rosas', '142', 'Centro', '01042', 3),
('Calle Ocampo', '143', 'Norte', '01043', 4),
('Boulevard Colosio', '144', 'Sur', '01044', 5),
('Av. Acueducto', '145', 'Este', '01045', 6),
('Calle Escobedo', '146', 'Oeste', '01046', 7),
('Calzada del Federalismo', '147', 'Valle', '01047', 8),
('Av. Circunvalación', '148', 'Centro', '01048', 9),
('Calle Rayón', '149', 'Norte', '01049', 10);

-- Sucursales (tabla de catálogo - 10 registros)
INSERT INTO sucursal (nombre, telefono, id_direccion, activo) VALUES
('Sucursal Central GDL', '555-100-0001', 1, TRUE),
('Sucursal Norte ZAP', '555-100-0002', 2, TRUE),
('Sucursal Valle MTY', '555-100-0003', 3, TRUE),
('Sucursal San Pedro SPG', '555-100-0004', 4, TRUE),
('Sucursal Reforma CDMX', '555-100-0005', 5, TRUE),
('Sucursal Polanco CDMX', '555-100-0006', 6, TRUE),
('Sucursal Centro TOL', '555-100-0007', 7, TRUE),
('Sucursal Industrial NAU', '555-100-0008', 8, TRUE),
('Sucursal Angelópolis PUE', '555-100-0009', 9, TRUE),
('Sucursal Histórica PUE', '555-100-0010', 10, TRUE);

-- Almacenes (tabla transaccional - 50 registros)
INSERT INTO almacen (nombre, id_sucursal, capacidad, activo) VALUES
('Almacén A1', 1, 1500, TRUE),
('Almacén A2', 1, 2000, TRUE),
('Almacén A3', 1, 2500, TRUE),
('Almacén A4', 1, 3000, TRUE),
('Almacén A5', 1, 3500, TRUE),
('Almacén B1', 2, 1200, TRUE),
('Almacén B2', 2, 1800, TRUE),
('Almacén B3', 2, 2200, TRUE),
('Almacén B4', 2, 2800, TRUE),
('Almacén B5', 2, 3100, TRUE),
('Almacén C1', 3, 4000, TRUE),
('Almacén C2', 3, 1000, TRUE),
('Almacén C3', 3, 1600, TRUE),
('Almacén C4', 3, 2100, TRUE),
('Almacén C5', 3, 2600, TRUE),
('Almacén D1', 4, 3200, TRUE),
('Almacén D2', 4, 3800, TRUE),
('Almacén D3', 4, 1400, TRUE),
('Almacén D4', 4, 1900, TRUE),
('Almacén D5', 4, 2400, TRUE),
('Almacén E1', 5, 2900, TRUE),
('Almacén E2', 5, 3400, TRUE),
('Almacén E3', 5, 1100, TRUE),
('Almacén E4', 5, 1700, TRUE),
('Almacén E5', 5, 2300, TRUE),
('Almacén F1', 6, 2700, TRUE),
('Almacén F2', 6, 3300, TRUE),
('Almacén F3', 6, 3900, TRUE),
('Almacén F4', 6, 1300, TRUE),
('Almacén F5', 6, 1850, TRUE),
('Almacén G1', 7, 2450, TRUE),
('Almacén G2', 7, 2950, TRUE),
('Almacén G3', 7, 3450, TRUE),
('Almacén G4', 7, 4100, TRUE),
('Almacén G5', 7, 1250, TRUE),
('Almacén H1', 8, 1750, TRUE),
('Almacén H2', 8, 2250, TRUE),
('Almacén H3', 8, 2750, TRUE),
('Almacén H4', 8, 3250, TRUE),
('Almacén H5', 8, 3750, TRUE),
('Almacén I1', 9, 1350, TRUE),
('Almacén I2', 9, 1950, TRUE),
('Almacén I3', 9, 2550, TRUE),
('Almacén I4', 9, 3050, TRUE),
('Almacén I5', 9, 3600, TRUE),
('Almacén J1', 10, 1450, TRUE),
('Almacén J2', 10, 2050, TRUE),
('Almacén J3', 10, 2650, TRUE),
('Almacén J4', 10, 3150, TRUE),
('Almacén J5', 10, 4200, TRUE);


-- =====================================================
-- MÓDULO 3: PRODUCTOS E INVENTARIO - DATOS COMPLETOS
-- =====================================================

-- Categorías de productos (tabla de catálogo - 10 registros)
INSERT INTO categoria_producto (nombre, descripcion, activo) VALUES
('Abarrotes', 'Productos de despensa básica', TRUE),
('Lácteos y Refrigerados', 'Leche, quesos, yogurt y derivados', TRUE),
('Panadería y Tortillería', 'Pan, tortillas y productos de panadería', TRUE),
('Carnes y Embutidos', 'Productos cárnicos frescos y procesados', TRUE),
('Frutas y Verduras', 'Productos frescos de temporada', TRUE),
('Bebidas', 'Refrescos, jugos y bebidas alcohólicas', TRUE),
('Limpieza del Hogar', 'Detergentes, jabones y productos de limpieza', TRUE),
('Cuidado Personal', 'Higiene y cuidado personal', TRUE),
('Botanas y Dulces', 'Snacks, frituras y confitería', TRUE),
('Congelados', 'Alimentos congelados y helados', TRUE);

-- Productos (tabla de catálogo - 10 registros)
INSERT INTO producto (id_categoria, nombre, descripcion, precio, codigo_barras, activo) VALUES
(1, 'Arroz Blanco 1kg', 'Arroz grano largo primera calidad', 22.50, '7501001234001', TRUE),
(2, 'Leche Entera 1L', 'Leche pasteurizada entera', 24.90, '7501001234002', TRUE),
(3, 'Pan Blanco Grande', 'Pan de caja blanco 680g', 38.00, '7501001234003', TRUE),
(4, 'Pechuga de Pollo 1kg', 'Pechuga de pollo fresca sin hueso', 89.00, '7501001234004', TRUE),
(5, 'Manzana Red Delicious 1kg', 'Manzana fresca importada', 45.00, '7501001234005', TRUE),
(6, 'Coca-Cola 2L', 'Refresco de cola 2 litros', 32.50, '7501001234006', TRUE),
(7, 'Detergente en Polvo 1kg', 'Detergente para ropa multiusos', 48.00, '7501001234007', TRUE),
(8, 'Jabón de Tocador 3 pzas', 'Jabón antibacterial pack 3 unidades', 28.50, '7501001234008', TRUE),
(9, 'Papas Fritas 150g', 'Papas fritas sabor original', 18.00, '7501001234009', TRUE),
(10, 'Helado de Vainilla 1L', 'Helado cremoso sabor vainilla', 65.00, '7501001234010', TRUE);

-- Inventario (tabla transaccional - 10 registros)
INSERT INTO inventario (id_producto, stock_actual, stock_minimo, stock_maximo, ultima_actualizacion) VALUES
(1, 500, 100, 1000, '2025-01-15 08:00:00'),
(2, 800, 200, 1500, '2025-01-15 08:00:00'),
(3, 350, 80, 600, '2025-01-15 08:00:00'),
(4, 120, 30, 250, '2025-01-15 08:00:00'),
(5, 200, 50, 400, '2025-01-15 08:00:00'),
(6, 600, 150, 1200, '2025-01-15 08:00:00'),
(7, 400, 100, 800, '2025-01-15 08:00:00'),
(8, 900, 250, 1800, '2025-01-15 08:00:00'),
(9, 1500, 400, 3000, '2025-01-15 08:00:00'),
(10, 180, 40, 350, '2025-01-15 08:00:00');

-- Tipos de movimiento (tabla de catálogo - 5 registros)
INSERT INTO tipo_movimiento (nombre, descripcion) VALUES
('Entrada por compra', 'Entrada de mercancía por compra a proveedor'),
('Salida por venta', 'Salida de producto por venta a cliente'),
('Ajuste inventario', 'Ajuste manual de inventario'),
('Devolución proveedor', 'Devolución de producto a proveedor'),
('Devolución cliente', 'Entrada por devolución de cliente');

-- Movimientos de inventario (tabla transaccional - 50 registros)
INSERT INTO movimiento_inventario (id_producto, id_tipo_movimiento, cantidad, fecha_movimiento, referencia, usuario_registro) VALUES
(1, 1, 10, '2024-01-20 10:30:00', 'Orden Compra #1', 'Carlos Ruiz'),
(4, 1, 5, '2024-01-20 10:35:00', 'Orden Compra #1', 'Carlos Ruiz'),
(10, 1, 5, '2024-01-20 10:40:00', 'Orden Compra #1', 'Carlos Ruiz'),
(2, 1, 100, '2024-01-25 14:20:00', 'Orden Compra #2', 'Carlos Ruiz'),
(3, 1, 10, '2024-01-25 14:25:00', 'Orden Compra #2', 'Carlos Ruiz'),
(5, 1, 15, '2024-01-28 11:00:00', 'Orden Compra #3', 'Carlos Ruiz'),
(1, 1, 10, '2024-02-08 09:00:00', 'Orden Compra #4', 'Carlos Ruiz'),
(6, 1, 30, '2024-02-12 16:30:00', 'Orden Compra #5', 'Carlos Ruiz'),
(7, 1, 50, '2024-02-12 16:35:00', 'Orden Compra #5', 'Carlos Ruiz'),
(8, 1, 8, '2024-02-18 12:00:00', 'Orden Compra #6', 'Carlos Ruiz'),
(9, 1, 5, '2024-02-22 14:00:00', 'Orden Compra #7', 'Carlos Ruiz'),
(1, 1, 4, '2024-02-28 09:30:00', 'Orden Compra #8', 'Carlos Ruiz'),
(1, 1, 7, '2024-03-08 10:30:00', 'Orden Compra #9', 'Carlos Ruiz'),
(4, 1, 8, '2024-03-08 10:35:00', 'Orden Compra #9', 'Carlos Ruiz'),
(2, 1, 80, '2024-03-12 15:45:00', 'Orden Compra #10', 'Carlos Ruiz'),
(3, 1, 10, '2024-03-12 15:50:00', 'Orden Compra #10', 'Carlos Ruiz'),
(1, 2, 2, '2024-04-01 11:00:00', 'Venta #1', 'Paola Castillo'),
(2, 2, 1, '2024-04-01 11:05:00', 'Venta #1', 'Paola Castillo'),
(3, 2, 3, '2024-04-01 11:10:00', 'Venta #1', 'Paola Castillo'),
(4, 2, 1, '2024-04-01 11:15:00', 'Venta #1', 'Paola Castillo'),
(5, 2, 2, '2024-04-01 11:20:00', 'Venta #1', 'Paola Castillo'),
(1, 2, 1, '2024-04-02 10:00:00', 'Venta #2', 'Paola Castillo'),
(6, 2, 2, '2024-04-02 10:05:00', 'Venta #2', 'Paola Castillo'),
(7, 2, 1, '2024-04-02 10:10:00', 'Venta #2', 'Paola Castillo'),
(8, 2, 3, '2024-04-02 10:15:00', 'Venta #2', 'Paola Castillo'),
(9, 2, 1, '2024-04-02 10:20:00', 'Venta #2', 'Paola Castillo'),
(2, 2, 2, '2024-04-03 09:00:00', 'Venta #3', 'Paola Castillo'),
(5, 2, 1, '2024-04-03 09:05:00', 'Venta #3', 'Paola Castillo'),
(3, 2, 3, '2024-04-04 08:30:00', 'Venta #4', 'Paola Castillo'),
(6, 2, 2, '2024-04-04 08:35:00', 'Venta #4', 'Paola Castillo'),
(1, 2, 1, '2024-04-05 15:00:00', 'Venta #5', 'Paola Castillo'),
(7, 2, 2, '2024-04-05 15:05:00', 'Venta #5', 'Paola Castillo'),
(4, 2, 1, '2024-04-06 12:00:00', 'Venta #6', 'Paola Castillo'),
(8, 2, 2, '2024-04-06 12:05:00', 'Venta #6', 'Paola Castillo'),
(9, 2, 1, '2024-04-07 13:30:00', 'Venta #7', 'Paola Castillo'),
(10, 2, 2, '2024-04-07 13:35:00', 'Venta #7', 'Paola Castillo'),
(2, 2, 1, '2024-04-08 16:00:00', 'Venta #8', 'Paola Castillo'),
(3, 2, 2, '2024-04-08 16:05:00', 'Venta #8', 'Paola Castillo'),
(5, 3, 2, '2024-04-09 10:00:00', 'Ajuste inventario', 'Carlos Ruiz'),
(7, 3, 5, '2024-04-09 10:15:00', 'Ajuste inventario', 'Carlos Ruiz'),
(1, 3, 1, '2024-04-10 11:00:00', 'Ajuste inventario', 'Carlos Ruiz'),
(2, 3, 3, '2024-04-10 11:15:00', 'Ajuste inventario', 'Carlos Ruiz'),
(8, 5, 1, '2024-04-11 14:00:00', 'Devolución Venta #6', 'Paola Castillo'),
(3, 5, 1, '2024-04-12 09:30:00', 'Devolución Venta #3', 'Paola Castillo'),
(6, 2, 3, '2024-04-13 11:45:00', 'Venta #10', 'Paola Castillo'),
(4, 2, 2, '2024-04-14 10:20:00', 'Venta #11', 'Paola Castillo'),
(1, 2, 1, '2024-04-15 15:30:00', 'Venta #12', 'Paola Castillo'),
(9, 2, 2, '2024-04-16 13:00:00', 'Venta #13', 'Paola Castillo'),
(5, 2, 1, '2024-04-17 12:15:00', 'Venta #14', 'Paola Castillo'),
(10, 2, 3, '2024-04-18 14:45:00', 'Venta #15', 'Paola Castillo');

-- Mermas (tabla transaccional - 50 registros)
INSERT INTO merma (id_producto, cantidad, motivo, fecha_merma, usuario_registro) VALUES
(1, 1, 'Producto con defecto de fábrica', '2024-01-25', 'Carlos Ruiz'),
(2, 5, 'Daño en empaque durante almacenamiento', '2024-01-26', 'Carlos Ruiz'),
(3, 2, 'Caducidad de garantía', '2024-01-28', 'Carlos Ruiz'),
(4, 1, 'Pantalla dañada en transporte', '2024-02-03', 'Carlos Ruiz'),
(5, 3, 'Lente defectuoso', '2024-02-05', 'Carlos Ruiz'),
(6, 1, 'Disco no reconocido', '2024-02-10', 'Carlos Ruiz'),
(7, 10, 'Memorias dañadas por humedad', '2024-02-12', 'Carlos Ruiz'),
(8, 1, 'Problema de conectividad', '2024-02-15', 'Carlos Ruiz'),
(9, 1, 'Atasco de papel recurrente', '2024-02-18', 'Carlos Ruiz'),
(10, 2, 'No enciende', '2024-02-20', 'Carlos Ruiz'),
(1, 1, 'Teclado defectuoso', '2024-02-25', 'Carlos Ruiz'),
(2, 3, 'Botones no funcionan', '2024-02-28', 'Carlos Ruiz'),
(3, 1, 'Teclas se atascan', '2024-03-02', 'Carlos Ruiz'),
(4, 1, 'Píxeles muertos', '2024-03-05', 'Carlos Ruiz'),
(5, 2, 'Audio distorsionado', '2024-03-08', 'Carlos Ruiz'),
(6, 1, 'Ruido extraño en lectura', '2024-03-10', 'Carlos Ruiz'),
(7, 8, 'No son detectadas', '2024-03-12', 'Carlos Ruiz'),
(8, 1, 'Una orejera no funciona', '2024-03-15', 'Carlos Ruiz'),
(9, 1, 'Fusor dañado', '2024-03-18', 'Carlos Ruiz'),
(10, 1, 'Antena rota', '2024-03-20', 'Carlos Ruiz'),
(1, 1, 'Batería no carga', '2024-03-22', 'Carlos Ruiz'),
(2, 2, 'Sensor óptico falla', '2024-03-25', 'Carlos Ruiz'),
(3, 1, 'RGB no funciona', '2024-03-28', 'Carlos Ruiz'),
(4, 1, 'Conector HDMI dañado', '2024-04-01', 'Carlos Ruiz'),
(5, 1, 'Micrófono no graba', '2024-04-03', 'Carlos Ruiz'),
(6, 2, 'Golpe en carcasa', '2024-04-05', 'Carlos Ruiz'),
(7, 5, 'Corrupta al formatear', '2024-04-08', 'Carlos Ruiz'),
(8, 1, 'Cancelación de ruido fallando', '2024-04-10', 'Carlos Ruiz'),
(9, 1, 'Tóner derramado', '2024-04-12', 'Carlos Ruiz'),
(10, 1, 'Firmware corrupto', '2024-04-15', 'Carlos Ruiz'),
(1, 1, 'Sobrecalentamiento', '2024-04-18', 'Carlos Ruiz'),
(2, 4, 'Desgaste de patines', '2024-04-20', 'Carlos Ruiz'),
(3, 1, 'Switch defectuoso', '2024-04-22', 'Carlos Ruiz'),
(4, 1, 'Botones de ajuste no funcionan', '2024-04-25', 'Carlos Ruiz'),
(5, 2, 'Cable USB dañado', '2024-04-28', 'Carlos Ruiz'),
(6, 1, 'Motor del disco falla', '2024-05-01', 'Carlos Ruiz'),
(7, 6, 'Chip controlador quemado', '2024-05-03', 'Carlos Ruiz'),
(8, 1, 'Batería inflada', '2024-05-05', 'Carlos Ruiz'),
(9, 1, 'Rodillo desgastado', '2024-05-08', 'Carlos Ruiz'),
(10, 1, 'Puerto WAN no funciona', '2024-05-10', 'Carlos Ruiz'),
(1, 1, 'Ventilador ruidoso', '2024-05-12', 'Carlos Ruiz'),
(2, 3, 'Clic doble aleatorio', '2024-05-15', 'Carlos Ruiz'),
(3, 1, 'LED no enciende', '2024-05-18', 'Carlos Ruiz'),
(4, 1, 'Base no ajusta altura', '2024-05-20', 'Carlos Ruiz'),
(5, 1, 'Enfoque automático fallando', '2024-05-22', 'Carlos Ruiz'),
(6, 1, 'Sector del disco dañado', '2024-05-25', 'Carlos Ruiz'),
(7, 7, 'Error de escritura', '2024-05-28', 'Carlos Ruiz'),
(8, 1, 'Almohadillas desgastadas', '2024-05-30', 'Carlos Ruiz'),
(9, 1, 'Scanner no responde', '2024-06-01', 'Carlos Ruiz'),
(10, 2, 'LEDs indicadores apagados', '2024-06-03', 'Carlos Ruiz');



-- =====================================================
-- MÓDULO 4: COMPRAS
-- =====================================================

-- Insertar proveedores (tabla de catálogo - 10 registros)
INSERT INTO proveedor (nombre_proveedor, telefono, correo, estado) VALUES
('Grupo Bimbo SA de CV', '5555-2890', 'ventas@grupobimbo.com', 'activo'),
('Coca-Cola FEMSA', '8181-4455', 'pedidos@coca-cola.com.mx', 'activo'),
('Sigma Alimentos', '3336-7788', 'ventas@sigma-alimentos.com', 'activo'),
('Procter & Gamble México', '5555-9922', 'comercial@pg.com', 'activo'),
('Lala Productos Lácteos', '4422-3366', 'ventas@grupolala.com', 'activo'),
('Nestlé México SA', '5555-1133', 'pedidos@nestle.com.mx', 'activo'),
('Unilever de México', '6644-5577', 'comercial@unilever.com', 'activo'),
('Barcel (Grupo Bimbo)', '5555-8844', 'ventas@barcel.com.mx', 'activo'),
('PepsiCo Alimentos México', '5555-2211', 'pedidos@pepsico.com.mx', 'activo'),
('Soriana Abastecimiento', '4771-6699', 'mayoreo@soriana.com', 'activo');

-- Insertar órdenes de compra (tabla transaccional - 50 registros)
INSERT INTO orden_compra (id_proveedor, fecha_orden, total_orden, estado_orden, fecha_entrega) VALUES
(1, '2024-01-15', 87500.00, 'recibida', '2024-01-20'),
(2, '2024-01-18', 45600.00, 'recibida', '2024-01-25'),
(3, '2024-01-22', 39400.00, 'recibida', '2024-01-28'),
(4, '2024-02-01', 125000.00, 'recibida', '2024-02-08'),
(5, '2024-02-05', 37500.00, 'recibida', '2024-02-12'),
(6, '2024-02-10', 56600.00, 'enviada', '2024-02-18'),
(7, '2024-02-14', 22000.00, 'enviada', '2024-02-22'),
(8, '2024-02-20', 51000.00, 'enviada', '2024-02-28'),
(9, '2024-03-01', 113100.00, 'recibida', '2024-03-08'),
(10, '2024-03-05', 38000.00, 'recibida', '2024-03-12'),
(1, '2024-03-10', 74500.00, 'enviada', '2024-03-18'),
(2, '2024-03-15', 56000.00, 'pendiente', '2024-03-25'),
(3, '2024-03-18', 65800.00, 'pendiente', '2024-03-28'),
(4, '2024-03-22', 80000.00, 'pendiente', NULL),
(5, '2024-03-25', 38400.00, 'pendiente', NULL),
(6, '2024-03-28', 82500.00, 'pendiente', NULL),
(7, '2024-04-01', 61750.00, 'pendiente', NULL),
(8, '2024-04-03', 112800.00, 'pendiente', NULL),
(9, '2024-04-05', 84000.00, 'pendiente', NULL),
(10, '2024-04-08', 55000.00, 'pendiente', NULL),
(1, '2024-04-10', 53000.00, 'pendiente', NULL),
(2, '2024-04-12', 68900.00, 'pendiente', NULL),
(3, '2024-04-15', 39400.00, 'pendiente', NULL),
(4, '2024-04-18', 45150.00, 'pendiente', NULL),
(5, '2024-04-20', 52000.00, 'pendiente', NULL),
(6, '2024-04-22', 80100.00, 'pendiente', NULL),
(7, '2024-04-25', 68000.00, 'pendiente', NULL),
(8, '2024-04-27', 62750.00, 'pendiente', NULL),
(9, '2024-04-30', 42000.00, 'pendiente', NULL),
(10, '2024-05-02', 77000.00, 'pendiente', NULL),
(1, '2024-05-05', 48300.00, 'pendiente', NULL),
(2, '2024-05-08', 37000.00, 'pendiente', NULL),
(3, '2024-05-10', 62500.00, 'pendiente', NULL),
(4, '2024-05-12', 92800.00, 'pendiente', NULL),
(5, '2024-05-15', 33250.00, 'pendiente', NULL),
(6, '2024-05-18', 58950.00, 'pendiente', NULL),
(7, '2024-05-20', 31200.00, 'pendiente', NULL),
(8, '2024-05-22', 83600.00, 'pendiente', NULL),
(9, '2024-05-25', 53900.00, 'pendiente', NULL),
(10, '2024-05-28', 93500.00, 'pendiente', NULL),
(1, '2024-05-30', 41300.00, 'pendiente', NULL),
(2, '2024-06-01', 38900.00, 'pendiente', NULL),
(3, '2024-06-03', 71400.00, 'pendiente', NULL),
(4, '2024-06-05', 97500.00, 'pendiente', NULL),
(5, '2024-06-08', 44900.00, 'pendiente', NULL),
(6, '2024-06-10', 33700.00, 'pendiente', NULL),
(7, '2024-06-12', 62300.00, 'pendiente', NULL),
(8, '2024-06-15', 85600.00, 'pendiente', NULL),
(9, '2024-06-18', 76500.00, 'pendiente', NULL),
(10, '2024-06-20', 51200.00, 'pendiente', NULL);

-- Insertar detalles de órdenes de compra (tabla transaccional - 50 registros)
INSERT INTO detalle_orden_compra (id_orden_compra, id_producto, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 5, 12500.00, 62500.00),
(1, 4, 5, 3200.00, 16000.00),
(1, 10, 5, 1200.00, 6000.00),
(1, 7, 20, 180.00, 3600.00),
(2, 2, 100, 250.00, 25000.00),
(2, 3, 10, 1800.00, 18000.00),
(2, 7, 20, 180.00, 3600.00),
(3, 5, 15, 1500.00, 22500.00),
(3, 2, 80, 250.00, 20000.00),
(4, 1, 10, 12500.00, 125000.00),
(5, 6, 30, 950.00, 28500.00),
(5, 7, 50, 180.00, 9000.00),
(6, 8, 8, 5800.00, 46400.00),
(6, 10, 10, 1200.00, 12000.00),
(7, 9, 5, 3500.00, 17500.00),
(7, 2, 25, 180.00, 4500.00),
(8, 1, 4, 12500.00, 50000.00),
(8, 10, 1, 1000.00, 1000.00),
(9, 1, 7, 12500.00, 87500.00),
(9, 4, 8, 3200.00, 25600.00),
(10, 2, 80, 250.00, 20000.00),
(10, 3, 10, 1800.00, 18000.00),
(11, 3, 20, 1800.00, 36000.00),
(11, 5, 20, 1500.00, 30000.00),
(11, 8, 1, 5800.00, 5800.00),
(12, 6, 40, 950.00, 38000.00),
(12, 3, 10, 1800.00, 18000.00),
(13, 8, 9, 5800.00, 52200.00),
(13, 7, 80, 180.00, 14400.00),
(14, 1, 5, 12500.00, 62500.00),
(14, 9, 5, 3500.00, 17500.00),
(15, 7, 100, 180.00, 18000.00),
(15, 2, 100, 250.00, 25000.00),
(16, 8, 10, 5800.00, 58000.00),
(16, 2, 120, 250.00, 30000.00),
(17, 6, 45, 950.00, 42750.00),
(17, 3, 10, 1800.00, 18000.00),
(18, 1, 9, 12500.00, 112500.00),
(18, 7, 2, 180.00, 360.00),
(19, 4, 20, 3200.00, 64000.00),
(19, 2, 100, 250.00, 25000.00),
(20, 6, 50, 950.00, 47500.00),
(20, 5, 5, 1500.00, 7500.00),
(21, 1, 4, 12500.00, 50000.00),
(21, 7, 20, 180.00, 3600.00),
(22, 8, 10, 5800.00, 58000.00),
(22, 10, 10, 1200.00, 12000.00),
(23, 3, 18, 1800.00, 32400.00),
(23, 5, 5, 1500.00, 7500.00),
(24, 3, 20, 1800.00, 36000.00),
(24, 5, 5, 1500.00, 7500.00);

-- Insertar recepciones de mercancía (tabla transaccional - 50 registros)
INSERT INTO recepcion_mercancia (id_orden_compra, fecha_recepcion, recibido_por, estado_recepcion, observaciones) VALUES
(1, '2024-01-20 09:30:00', 'Juan Pérez', 'completa', 'Todos los productos recibidos en perfectas condiciones'),
(2, '2024-01-25 14:15:00', 'María García', 'completa', 'Mercancía completa y empaque adecuado'),
(3, '2024-01-28 10:45:00', 'Carlos López', 'parcial', 'Faltan 5 webcams, se reprogramará entrega'),
(4, '2024-02-08 08:20:00', 'Ana Martínez', 'completa', 'Entrega completa, productos sellados'),
(5, '2024-02-12 16:00:00', 'Pedro Rodríguez', 'completa', 'Sin observaciones'),
(6, '2024-02-18 11:30:00', 'Laura Sánchez', 'parcial', 'Recibidos 6 de 8 audífonos solicitados'),
(7, '2024-02-22 13:45:00', 'Miguel Hernández', 'completa', 'Productos en perfecto estado'),
(8, '2024-02-28 09:15:00', 'Sofia Torres', 'completa', 'Entrega según especificaciones'),
(9, '2024-03-08 10:00:00', 'Diego Ramírez', 'completa', 'Recepción sin incidencias'),
(10, '2024-03-12 15:30:00', 'Carmen Flores', 'completa', 'Todo conforme a la orden'),
(11, '2024-03-18 12:00:00', 'Roberto Vargas', 'pendiente', 'Mercancía aún no ha llegado'),
(1, '2024-01-21 10:00:00', 'Juan Pérez', 'completa', 'Segunda recepción de productos adicionales'),
(12, '2024-03-25 11:20:00', 'Ana Martínez', 'pendiente', 'Esperando confirmación de envío'),
(13, '2024-03-28 14:30:00', 'Carlos López', 'pendiente', 'Proveedor notificó retraso de 2 días'),
(14, '2024-04-02 09:00:00', 'María García', 'pendiente', 'En tránsito, llegada estimada 5 de abril'),
(15, '2024-04-05 10:15:00', 'Pedro Rodríguez', 'pendiente', 'Pendiente de programar recepción'),
(16, '2024-04-08 13:45:00', 'Laura Sánchez', 'pendiente', 'Contactando con transportista'),
(2, '2024-01-26 08:30:00', 'Diego Ramírez', 'completa', 'Recepción adicional sin problemas'),
(3, '2024-01-29 15:20:00', 'Sofia Torres', 'completa', 'Completada la entrega parcial anterior'),
(4, '2024-02-09 11:00:00', 'Carmen Flores', 'completa', 'Segunda entrega verificada'),
(5, '2024-02-13 09:45:00', 'Roberto Vargas', 'completa', 'Productos adicionales recibidos'),
(17, '2024-04-10 10:30:00', 'Juan Pérez', 'pendiente', 'Programada para mañana'),
(18, '2024-04-12 14:00:00', 'María García', 'pendiente', 'Esperando documentación aduanal'),
(19, '2024-04-15 08:45:00', 'Carlos López', 'pendiente', 'Retraso por falta de inventario'),
(20, '2024-04-18 11:30:00', 'Ana Martínez', 'pendiente', 'Programada recepción'),
(6, '2024-02-19 13:00:00', 'Pedro Rodríguez', 'completa', 'Audífonos faltantes recibidos'),
(7, '2024-02-23 10:20:00', 'Laura Sánchez', 'completa', 'Confirmación de recepción completa'),
(8, '2024-02-29 15:45:00', 'Miguel Hernández', 'completa', 'Todo en orden'),
(9, '2024-03-09 09:30:00', 'Sofia Torres', 'completa', 'Recepción verificada'),
(10, '2024-03-13 14:15:00', 'Diego Ramírez', 'completa', 'Sin novedades'),
(21, '2024-04-20 12:00:00', 'Carmen Flores', 'pendiente', 'En almacén del proveedor'),
(22, '2024-04-22 10:45:00', 'Roberto Vargas', 'pendiente', 'Preparando envío'),
(23, '2024-04-25 13:20:00', 'Juan Pérez', 'pendiente', 'Esperando disponibilidad de producto'),
(24, '2024-04-28 09:15:00', 'María García', 'pendiente', 'Confirmación de stock pendiente'),
(25, '2024-05-01 11:30:00', 'Carlos López', 'pendiente', 'Procesando orden'),
(11, '2024-03-19 08:00:00', 'Ana Martínez', 'completa', 'Recibida finalmente'),
(12, '2024-03-26 14:30:00', 'Pedro Rodríguez', 'parcial', 'Faltan 3 items, resto OK'),
(13, '2024-03-29 10:00:00', 'Laura Sánchez', 'completa', 'Entrega completa realizada'),
(26, '2024-05-03 15:00:00', 'Miguel Hernández', 'pendiente', 'Programada para próxima semana'),
(27, '2024-05-06 09:45:00', 'Sofia Torres', 'pendiente', 'En proceso de empaque'),
(28, '2024-05-08 12:30:00', 'Diego Ramírez', 'pendiente', 'Esperando confirmación'),
(29, '2024-05-10 10:15:00', 'Carmen Flores', 'pendiente', 'Pendiente de envío'),
(30, '2024-05-12 14:00:00', 'Roberto Vargas', 'pendiente', 'En tránsito'),
(14, '2024-04-03 11:45:00', 'Juan Pérez', 'parcial', 'Recibida parcialmente, falta completar'),
(15, '2024-04-06 13:30:00', 'María García', 'completa', 'Orden completada'),
(16, '2024-04-09 09:20:00', 'Carlos López', 'completa', 'Recepción sin problemas'),
(17, '2024-04-11 15:15:00', 'Ana Martínez', 'completa', 'Todo conforme'),
(18, '2024-04-13 10:50:00', 'Pedro Rodríguez', 'completa', 'Productos verificados'),
(19, '2024-04-16 12:40:00', 'Laura Sánchez', 'completa', 'Sin observaciones'),
(20, '2024-04-19 08:25:00', 'Miguel Hernández', 'completa', 'Recepción exitosa');


-- =====================================================
-- MÓDULO 5: VENTAS
-- =====================================================

	--Tablas  de catálogo.
	
	INSERT INTO metodo_pago (nombre, descripcion) VALUES
	('Efectivo', 'Pago en efectivo'),
	('Tarjeta de crédito', 'Pago con tarjeta de crédito'),
	('Tarjeta de débito', 'Pago con tarjeta de débito'),
	('Transferencia', 'Transferencia bancaria'),
	('PayPal', 'Pago en línea'),
	('Cheque', 'Pago con cheque'),
	('Vales', 'Pago con vales'),
	('Crédito tienda', 'Pago a crédito'),
	('Bitcoin', 'Criptomoneda'),
	('Otro', 'Método alternativo');
	
INSERT INTO cliente (nombre, correo, telefono, fecha_registro) VALUES
('Juan Perez', 'juan.perez@gmail.com', '3312345678', CURRENT_DATE),
('Maria Lopez', 'maria.lopez@gmail.com', '3323456789', CURRENT_DATE),
('Carlos Ruiz', 'carlos.ruiz@hotmail.com', '3334567890', CURRENT_DATE),
('Ana Torres', 'ana.torres@outlook.com', '3345678901', CURRENT_DATE),
('Luis Gomez', 'luis.gomez@gmail.com', '3356789012', CURRENT_DATE),
('Sofia Diaz', 'sofia.diaz@gmail.com', '3367890123', CURRENT_DATE),
('Pedro Sanchez', 'pedro.sanchez@hotmail.com', '3378901234', CURRENT_DATE),
('Laura Martinez', 'laura.martinez@gmail.com', '3389012345', CURRENT_DATE),
('Diego Herrera', 'diego.herrera@gmail.com', '3390123456', CURRENT_DATE),
('Elena Castro', 'elena.castro@outlook.com', '3311122233', CURRENT_DATE);
	
	--tablas transaccionales.
	INSERT INTO venta (fecha, total, id_cliente, id_empleado) VALUES

(NOW(), 500, 1, 1),
(NOW(), 300, 2, 1),
(NOW(), 450, 3, 2),
(NOW(), 600, 1, 2),
(NOW(), 700, 2, 3),


(NOW(), 200, 4, 3),
(NOW(), 350, 5, 4),
(NOW(), 800, 6, 4),
(NOW(), 150, 7, 5),
(NOW(), 900, 8, 5),


(NOW(), 120, 9, 6),
(NOW(), 220, 10, 7),
(NOW(), 330, 1, 8),
(NOW(), 410, 2, 9),
(NOW(), 510, 3, 10),
(NOW(), 620, 4, 1),
(NOW(), 720, 5, 2),


(NOW(), 820, 3, 3),
(NOW(), 920, 4, 4),
(NOW(), 150, 5, 5),
(NOW(), 260, 6, 6),
(NOW(), 370, 7, 7),
(NOW(), 480, 8, 8),
(NOW(), 590, 9, 9),
(NOW(), 610, 10, 10),


(NOW(), 230, 1, 1),
(NOW(), 340, 2, 2),
(NOW(), 450, 3, 3),
(NOW(), 560, 4, 4),
(NOW(), 670, 5, 5),


(NOW(), 780, 1, 6),
(NOW(), 890, 2, 7),
(NOW(), 135, 3, 8),


(NOW(), 245, 4, 9),
(NOW(), 355, 5, 10),
(NOW(), 465, 6, 1),
(NOW(), 575, 7, 2),
(NOW(), 685, 8, 3),
(NOW(), 795, 9, 4),
(NOW(), 905, 10, 5),
(NOW(), 150, 1, 6),
(NOW(), 260, 2, 7),
(NOW(), 370, 3, 8),
(NOW(), 480, 4, 9),
(NOW(), 590, 5, 10),
(NOW(), 610, 6, 1),
(NOW(), 720, 7, 2),
(NOW(), 830, 8, 3),
(NOW(), 940, 9, 4),
(NOW(), 550, 10, 5);
	
	INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario) VALUES
	(1, 1, 2, 50),
	(2, 2, 1, 100),
	(3, 3, 3, 30),
	(4, 4, 1, 200),
	(5, 5, 2, 60),
	(6, 6, 2, 80),
	(7, 7, 1, 120),
	(8, 8, 3, 40),
	(9, 9, 1, 90),
	(10, 10, 2, 70),

	(11, 1, 1, 50),
	(12, 2, 2, 100),
	(13, 3, 1, 30),
	(14, 4, 3, 200),
	(15, 5, 1, 60),
	(16, 6, 2, 80),
	(17, 7, 1, 120),
	(18, 8, 2, 40),
	(19, 9, 1, 90),
	(20, 10, 2, 70),

	(21, 1, 2, 50),
	(22, 2, 1, 100),
	(23, 3, 2, 30),
	(24, 4, 1, 200),
	(25, 5, 2, 60),
	(26, 6, 1, 80),
	(27, 7, 2, 120),
	(28, 8, 1, 40),
	(29, 9, 2, 90),
	(30, 10, 1, 70),

	(31, 1, 2, 50),
	(32, 2, 2, 100),
	(33, 3, 1, 30),
	(34, 4, 2, 200),
	(35, 5, 1, 60),
	(36, 6, 2, 80),
	(37, 7, 1, 120),
	(38, 8, 2, 40),
	(39, 9, 1, 90),
	(40, 10, 2, 70),

	(41, 1, 1, 50),
	(42, 2, 2, 100),
	(43, 3, 1, 30),
	(44, 4, 1, 200),
	(45, 5, 2, 60),
	(46, 6, 1, 80),
	(47, 7, 2, 120),
	(48, 8, 1, 40),
	(49, 9, 2, 90),
	(50, 10, 1, 70);
	
	
	INSERT INTO pago (id_venta, id_metodo_pago, monto, fecha_pago) VALUES
	(1, 1, 500, NOW()),
	(2, 2, 300, NOW()),
	(3, 3, 450, NOW()),
	(4, 1, 600, NOW()),
	(5, 2, 700, NOW()),
	(6, 3, 200, NOW()),
	(7, 1, 350, NOW()),
	(8, 2, 800, NOW()),
	(9, 3, 150, NOW()),
	(10, 1, 900, NOW()),
	(11, 2, 520, NOW()),
	(12, 3, 310, NOW()),
	(13, 1, 470, NOW()),
	(14, 2, 610, NOW()),
	(15, 3, 720, NOW()),
	(16, 1, 250, NOW()),
	(17, 2, 360, NOW()),
	(18, 3, 820, NOW()),
	(19, 1, 180, NOW()),
	(20, 2, 910, NOW()),
	
	(21, 3, 400, NOW()),
	(22, 1, 330, NOW()),
	(23, 2, 450, NOW()),
	(24, 3, 610, NOW()),
	(25, 1, 700, NOW()),
	(26, 2, 260, NOW()),
	(27, 3, 370, NOW()),
	(28, 1, 840, NOW()),
	(29, 2, 190, NOW()),
	(30, 3, 920, NOW()),
	
	(31, 1, 430, NOW()),
	(32, 2, 350, NOW()),
	(33, 3, 460, NOW()),
	(34, 1, 620, NOW()),
	(35, 2, 730, NOW()),
	(36, 3, 270, NOW()),
	(37, 1, 380, NOW()),
	(38, 2, 850, NOW()),
	(39, 3, 200, NOW()),
	(40, 1, 930, NOW()),
	
	(41, 2, 440, NOW()),
	(42, 3, 360, NOW()),
	(43, 1, 470, NOW()),
	(44, 2, 630, NOW()),
	(45, 3, 740, NOW()),
	(46, 1, 280, NOW()),
	(47, 2, 390, NOW()),
	(48, 3, 860, NOW()),
	(49, 1, 210, NOW()),
	(50, 2, 940, NOW());
	
	INSERT INTO factura (id_venta, fecha_emision, total) VALUES
	(1, CURRENT_DATE, 500),
	(2, CURRENT_DATE, 300),
	(3, CURRENT_DATE, 450),
	(4, CURRENT_DATE, 600),
	(5, CURRENT_DATE, 700),
	(6, CURRENT_DATE, 200),
	(7, CURRENT_DATE, 350),
	(8, CURRENT_DATE, 800),
	(9, CURRENT_DATE, 150),
	(10, CURRENT_DATE, 900),
	(11, CURRENT_DATE, 520),
	(12, CURRENT_DATE, 310),
	(13, CURRENT_DATE, 470),
	(14, CURRENT_DATE, 610),
	(15, CURRENT_DATE, 720),
	(16, CURRENT_DATE, 250),
	(17, CURRENT_DATE, 360),
	(18, CURRENT_DATE, 820),
	(19, CURRENT_DATE, 180),
	(20, CURRENT_DATE, 910),
	(21, CURRENT_DATE, 400),
	(22, CURRENT_DATE, 330),
	(23, CURRENT_DATE, 450),
	(24, CURRENT_DATE, 610),
	(25, CURRENT_DATE, 700),
	(26, CURRENT_DATE, 260),
	(27, CURRENT_DATE, 370),
	(28, CURRENT_DATE, 840),
	(29, CURRENT_DATE, 190),
	(30, CURRENT_DATE, 920),
	(31, CURRENT_DATE, 430),
	(32, CURRENT_DATE, 350),
	(33, CURRENT_DATE, 460),
	(34, CURRENT_DATE, 620),
	(35, CURRENT_DATE, 730),
	(36, CURRENT_DATE, 270),
	(37, CURRENT_DATE, 380),
	(38, CURRENT_DATE, 850),
	(39, CURRENT_DATE, 200),
	(40, CURRENT_DATE, 930),
	(41, CURRENT_DATE, 440),
	(42, CURRENT_DATE, 360),
	(43, CURRENT_DATE, 470),
	(44, CURRENT_DATE, 630),
	(45, CURRENT_DATE, 740),
	(46, CURRENT_DATE, 280),
	(47, CURRENT_DATE, 390),
	(48, CURRENT_DATE, 860),
	(49, CURRENT_DATE, 210),
	(50, CURRENT_DATE, 940);
	
	INSERT INTO devolucion (id_venta, fecha, motivo) VALUES
(1, CURRENT_DATE, 'Producto defectuoso'),
(2, CURRENT_DATE, 'No era lo esperado'),
(3, CURRENT_DATE, 'Error de talla'),
(4, CURRENT_DATE, 'Llegó dañado'),
(5, CURRENT_DATE, 'Cambio de opinión'),
(6, CURRENT_DATE, 'Producto incorrecto'),
(7, CURRENT_DATE, 'Falla de fábrica'),
(8, CURRENT_DATE, 'No coincide con la descripción'),
(9, CURRENT_DATE, 'Entrega tardía'),
(10, CURRENT_DATE, 'Empaque en mal estado'),
(11, CURRENT_DATE, 'Color diferente al mostrado'),
(12, CURRENT_DATE, 'Producto con rayones'),
(13, CURRENT_DATE, 'No funciona correctamente'),
(14, CURRENT_DATE, 'Tamaño incorrecto'),
(15, CURRENT_DATE, 'Calidad inferior a la esperada'),
(16, CURRENT_DATE, 'Falta un accesorio'),
(17, CURRENT_DATE, 'Producto usado'),
(18, CURRENT_DATE, 'No es compatible'),
(19, CURRENT_DATE, 'Precio más bajo en otro lugar'),
(20, CURRENT_DATE, 'Ya no lo necesito'),
(21, CURRENT_DATE, 'Material de mala calidad'),
(22, CURRENT_DATE, 'Producto roto'),
(23, CURRENT_DATE, 'Error en la orden'),
(24, CURRENT_DATE, 'Duplicado'),
(25, CURRENT_DATE, 'No cumple expectativas'),
(26, CURRENT_DATE, 'Defecto de fabricación'),
(27, CURRENT_DATE, 'No sirve para el propósito'),
(28, CURRENT_DATE, 'Demasiado grande'),
(29, CURRENT_DATE, 'Demasiado pequeño'),
(30, CURRENT_DATE, 'Color desteñido'),
(31, CURRENT_DATE, 'Producto vencido'),
(32, CURRENT_DATE, 'Empaque abierto'),
(33, CURRENT_DATE, 'No es original'),
(34, CURRENT_DATE, 'Mal olor'),
(35, CURRENT_DATE, 'Textura extraña'),
(36, CURRENT_DATE, 'No enciende'),
(37, CURRENT_DATE, 'Hace ruido extraño'),
(38, CURRENT_DATE, 'Se sobrecalienta'),
(39, CURRENT_DATE, 'Batería no funciona'),
(40, CURRENT_DATE, 'Pantalla dañada'),
(41, CURRENT_DATE, 'Cable defectuoso'),
(42, CURRENT_DATE, 'Botones atascados'),
(43, CURRENT_DATE, 'Conectividad deficiente'),
(44, CURRENT_DATE, 'Garantía expirada'),
(45, CURRENT_DATE, 'Modelo obsoleto'),
(46, CURRENT_DATE, 'Incompatible con sistema'),
(47, CURRENT_DATE, 'Instrucciones en otro idioma'),
(48, CURRENT_DATE, 'Piezas faltantes'),
(49, CURRENT_DATE, 'Sellado de seguridad roto'),
(50, CURRENT_DATE, 'Cliente insatisfecho');
