-- =====================================================
-- SISTEMA DE GESTIÓN
-- =====================================================
-- MÓDULO 1: RECURSOS HUMANOS
-- =====================================================
-- 1. Puestos  (catálogo)
CREATE TABLE Puestos (
    id_puesto       INTEGER         GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_puesto   VARCHAR(100)    NOT NULL,
    nivel           VARCHAR(50)     NULL,
    salario_base    NUMERIC(10,2)   NOT NULL CHECK (salario_base > 0),
    descripcion     TEXT            NULL
);

-- 2. Departamentos  (catálogo – autoreferencia resuelta después)
CREATE TABLE Departamentos (
    id_departamento     INTEGER         GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_departamento VARCHAR(100)    NOT NULL,
    id_jefe             INTEGER         NULL,   -- FK a Empleados, se agrega abajo
    ubicacion           VARCHAR(100)    NULL
);

-- 3. Turnos  (catálogo)
CREATE TABLE Turnos (
    id_turno        INTEGER         GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_turno    VARCHAR(50)     NOT NULL,
    hora_inicio     TIME            NOT NULL,
    hora_fin        TIME            NOT NULL,
    dias_laborales  VARCHAR(50)     NOT NULL,
    -- Validación: hora_fin debe ser posterior a hora_inicio
    CONSTRAINT chk_turno_horas CHECK (hora_fin > hora_inicio)
);

-- 4. Empleados  (transaccional-maestra)
CREATE TABLE Empleados (
    id_empleado         INTEGER         GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre              VARCHAR(100)    NOT NULL,
    apellido_paterno    VARCHAR(60)     NOT NULL,
    apellido_materno    VARCHAR(60)     NULL,
    fecha_nacimiento    DATE            NOT NULL,
    sexo                CHAR(1)         NOT NULL
                            CHECK (sexo IN ('M','F')),
    -- CORRECCIÓN: CURP debe seguir el formato oficial mexicano
    -- 4 letras + 6 dígitos (fecha) + H/M + 2 letras (estado) + 3 letras + 1 alfanumérico + 1 dígito
    curp                VARCHAR(18)     NOT NULL UNIQUE
                            CHECK (curp ~ '^[A-Z]{4}\d{6}[HM][A-Z]{2}[A-Z]{3}[A-Z0-9]\d$'),
    -- CORRECCIÓN: RFC debe seguir el formato oficial mexicano
    -- 3-4 letras/& + 6 dígitos (fecha) + 3 caracteres alfanuméricos de homoclave
    rfc                 VARCHAR(13)     NOT NULL UNIQUE
                            CHECK (rfc ~ '^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$'),
    -- CORRECCIÓN: Email debe tener formato válido (algo@algo.algo)
    email               VARCHAR(120)    NOT NULL UNIQUE
                            CHECK (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
    -- CORRECCIÓN: Teléfono solo puede contener dígitos, espacios, guiones, paréntesis y +
    telefono            VARCHAR(15)     NULL
                            CHECK (telefono IS NULL OR telefono ~ '^\+?[\d\s\-\(\)]{7,15}$'),
    id_puesto           INTEGER         NOT NULL REFERENCES Puestos(id_puesto),
    id_departamento     INTEGER         NOT NULL REFERENCES Departamentos(id_departamento),
    id_turno            INTEGER         NOT NULL REFERENCES Turnos(id_turno),
    fecha_ingreso       DATE            NOT NULL,
    estatus             VARCHAR(20)     NOT NULL DEFAULT 'activo'
                            CHECK (estatus IN ('activo','baja','suspendido'))
);

-- Autoreferencia: jefe del departamento
ALTER TABLE Departamentos
    ADD CONSTRAINT fk_depto_jefe
    FOREIGN KEY (id_jefe) REFERENCES Empleados(id_empleado)
    DEFERRABLE INITIALLY DEFERRED;

-- 5. Asistencias  (transaccional)
CREATE TABLE Asistencias (
    id_asistencia   INTEGER         GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_empleado     INTEGER         NOT NULL REFERENCES Empleados(id_empleado),
    fecha           DATE            NOT NULL,
    hora_entrada    TIME            NULL,
    hora_salida     TIME            NULL,
    estatus         VARCHAR(20)     NOT NULL
                        CHECK (estatus IN ('presente','falta','retardo','permiso')),
    observaciones   TEXT            NULL,
    -- Validación: hora_salida debe ser posterior a hora_entrada cuando ambas están presentes
    CONSTRAINT chk_asistencia_horas
        CHECK (hora_salida IS NULL OR hora_entrada IS NULL OR hora_salida > hora_entrada)
);

-- 6. Nóminas  (transaccional)
CREATE TABLE Nominas (
    id_nomina       INTEGER         GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_empleado     INTEGER         NOT NULL REFERENCES Empleados(id_empleado),
    periodo_inicio  DATE            NOT NULL,
    periodo_fin     DATE            NOT NULL,
    salario_bruto   NUMERIC(10,2)   NOT NULL CHECK (salario_bruto >= 0),
    deducciones     NUMERIC(10,2)   NOT NULL CHECK (deducciones >= 0),
    salario_neto    NUMERIC(10,2)   NOT NULL CHECK (salario_neto >= 0),
    fecha_pago      DATE            NOT NULL,
    metodo_pago     VARCHAR(30)     NOT NULL
                        CHECK (metodo_pago IN ('transferencia','cheque','efectivo')),
    CONSTRAINT chk_periodo CHECK (periodo_fin >= periodo_inicio),
    CONSTRAINT chk_neto    CHECK (salario_neto = salario_bruto - deducciones)
);

-- 7. Incidencias  (transaccional)
CREATE TABLE Incidencias (
    id_incidencia   INTEGER         GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_empleado     INTEGER         NOT NULL REFERENCES Empleados(id_empleado),
    tipo_incidencia VARCHAR(50)     NOT NULL,
    fecha           DATE            NOT NULL,
    descripcion     TEXT            NULL,
    impacto_nomina  SMALLINT        NOT NULL DEFAULT 1
                        CHECK (impacto_nomina IN (0,1)),
    id_nomina       INTEGER         NULL REFERENCES Nominas(id_nomina)
);

-- 8. Contratos  (transaccional)
CREATE TABLE Contratos (
    id_contrato     INTEGER         GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_empleado     INTEGER         NOT NULL REFERENCES Empleados(id_empleado),
    tipo_contrato   VARCHAR(50)     NOT NULL
                        CHECK (tipo_contrato IN ('Indefinido','Temporal','Por obra')),
    fecha_inicio    DATE            NOT NULL,
    fecha_fin       DATE            NULL,
    salario_pactado NUMERIC(10,2)   NOT NULL CHECK (salario_pactado > 0),
    -- CORRECCIÓN: URL del documento debe iniciar con http:// o https://
    documento_url   VARCHAR(255)    NULL
                        CHECK (documento_url IS NULL OR documento_url ~ '^https?://.+'),
    estatus         VARCHAR(20)     NOT NULL DEFAULT 'activo'
                        CHECK (estatus IN ('activo','vencido','rescindido')),
    -- Validación: fecha_fin debe ser posterior a fecha_inicio si se especifica
    CONSTRAINT chk_contrato_fechas
        CHECK (fecha_fin IS NULL OR fecha_fin > fecha_inicio)
);

-- 9. Vacaciones / Permisos  (transaccional)
CREATE TABLE VacacionesPermisos (
    id_permiso          INTEGER         GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_empleado         INTEGER         NOT NULL REFERENCES Empleados(id_empleado),
    tipo                VARCHAR(30)     NOT NULL
                            CHECK (tipo IN ('vacaciones','permiso_con_goce','permiso_sin_goce')),
    fecha_inicio        DATE            NOT NULL,
    fecha_fin           DATE            NOT NULL,
    dias_solicitados    INTEGER         NOT NULL CHECK (dias_solicitados > 0),
    estatus_aprobacion  VARCHAR(20)     NOT NULL DEFAULT 'pendiente'
                            CHECK (estatus_aprobacion IN ('pendiente','aprobado','rechazado')),
    id_aprobador        INTEGER         NULL REFERENCES Empleados(id_empleado),
    motivo              TEXT            NULL,
    CONSTRAINT chk_fechas_permiso CHECK (fecha_fin >= fecha_inicio)
);

-- ============================================================
--  MÓDULO: ADMINISTRATIVO
-- ============================================================

-- 10. Roles  (catálogo)
CREATE TABLE Roles (
    id_rol      INTEGER         GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_rol  VARCHAR(60)     NOT NULL UNIQUE,
    descripcion TEXT            NULL
);

-- 11. Permisos del Sistema  (catálogo)
CREATE TABLE PermisosSistema (
    id_permiso_sys  INTEGER         GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_permiso  VARCHAR(80)     NOT NULL UNIQUE,
    modulo          VARCHAR(60)     NOT NULL,
    descripcion     TEXT            NULL
);

-- 12. Tabla puente Rol_Permiso  (N:M entre Roles y PermisosSistema)
CREATE TABLE Rol_Permiso (
    id_rol_permiso  INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_rol          INTEGER NOT NULL REFERENCES Roles(id_rol),
    id_permiso_sys  INTEGER NOT NULL REFERENCES PermisosSistema(id_permiso_sys),
    CONSTRAINT uq_rol_permiso UNIQUE (id_rol, id_permiso_sys)
);

-- 13. Usuarios  (transaccional-maestra)
CREATE TABLE Usuarios (
    id_usuario      INTEGER         GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_empleado     INTEGER         NULL REFERENCES Empleados(id_empleado),
    -- CORRECCIÓN: username solo permite letras, números, puntos, guiones y guiones bajos
    username        VARCHAR(60)     NOT NULL UNIQUE
                        CHECK (username ~ '^[a-zA-Z0-9._\-]{3,60}$'),
    password_hash   VARCHAR(255)    NOT NULL,
    -- CORRECCIÓN: Email debe tener formato válido
    email           VARCHAR(120)    NOT NULL UNIQUE
                        CHECK (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
    estatus         VARCHAR(20)     NOT NULL DEFAULT 'activo'
                        CHECK (estatus IN ('activo','bloqueado','inactivo')),
    fecha_creacion  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso   TIMESTAMP       NULL
);

-- 14. Tabla puente Usuario_Rol  (N:M entre Usuarios y Roles)
CREATE TABLE Usuario_Rol (
    id_usuario_rol  INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario      INTEGER NOT NULL REFERENCES Usuarios(id_usuario),
    id_rol          INTEGER NOT NULL REFERENCES Roles(id_rol),
    fecha_asignacion DATE   NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT uq_usuario_rol UNIQUE (id_usuario, id_rol)
);

-- 15. Bitácora / Log del Sistema  (transaccional)
CREATE TABLE BitacoraLog (
    id_log          BIGINT          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario      INTEGER         NOT NULL REFERENCES Usuarios(id_usuario),
    accion          VARCHAR(100)    NOT NULL,
    tabla_afectada  VARCHAR(60)     NULL,
    id_registro     INTEGER         NULL,
    datos_anteriores TEXT           NULL,
    datos_nuevos     TEXT           NULL,
    fecha_hora      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- CORRECCIÓN: IP debe tener formato IPv4 o IPv6 válido
    ip_origen       VARCHAR(45)     NULL
                        CHECK (ip_origen IS NULL OR
                               ip_origen ~ '^\d{1,3}(\.\d{1,3}){3}$' OR
                               ip_origen ~ '^[0-9a-fA-F:]+$')
);

-- 16. Sesiones / Accesos  (transaccional)
CREATE TABLE Sesiones (
    id_sesion           INTEGER         GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario          INTEGER         NOT NULL REFERENCES Usuarios(id_usuario),
    token_sesion        VARCHAR(255)    NOT NULL UNIQUE,
    fecha_inicio        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion    TIMESTAMP       NOT NULL,
    fecha_cierre        TIMESTAMP       NULL,
    -- CORRECCIÓN: IP debe tener formato IPv4 o IPv6 válido
    ip_acceso           VARCHAR(45)     NULL
                            CHECK (ip_acceso IS NULL OR
                                   ip_acceso ~ '^\d{1,3}(\.\d{1,3}){3}$' OR
                                   ip_acceso ~ '^[0-9a-fA-F:]+$'),
    dispositivo         VARCHAR(100)    NULL,
    estatus             VARCHAR(20)     NOT NULL DEFAULT 'activa'
                            CHECK (estatus IN ('activa','cerrada','expirada')),
    CONSTRAINT chk_expiracion CHECK (fecha_expiracion > fecha_inicio)
);

-- =====================================================
-- MÓDULO 2: SUCURSALES
-- =====================================================

-- Tabla de catálogo: Estados
CREATE TABLE estado (
    id_estado   INTEGER     GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    -- CORRECCIÓN: abreviatura solo letras mayúsculas
    abreviatura VARCHAR(10)
                    CHECK (abreviatura IS NULL OR abreviatura ~ '^[A-ZÁÉÍÓÚÑ]{2,10}$'),

    CONSTRAINT uq_estado_nombre      UNIQUE (nombre),
    CONSTRAINT uq_estado_abreviatura UNIQUE (abreviatura)
);

-- Tabla de catálogo: Ciudades
CREATE TABLE ciudad (
    id_ciudad INTEGER      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre    VARCHAR(100) NOT NULL,
    id_estado INTEGER      NOT NULL,

    CONSTRAINT fk_ciudad_estado FOREIGN KEY (id_estado)
        REFERENCES estado (id_estado)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT uq_ciudad_nombre_estado UNIQUE (nombre, id_estado)
);

-- Tabla transaccional: Direcciones
CREATE TABLE direccion (
    id_direccion  INTEGER      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    calle         VARCHAR(150) NOT NULL,
    -- CORRECCIÓN: número puede contener dígitos, letras y guiones (ej: "123-A", "S/N")
    numero        VARCHAR(20)  NOT NULL
                      CHECK (numero ~ '^[A-Za-z0-9\/\-\s]{1,20}$'),
    colonia       VARCHAR(100),
    -- Validación ya existente: código postal solo dígitos de 4 a 10 caracteres
    codigo_postal VARCHAR(10)
                      CHECK (codigo_postal ~ '^\d{4,10}$'),
    id_ciudad     INTEGER      NOT NULL,

    CONSTRAINT fk_direccion_ciudad FOREIGN KEY (id_ciudad)
        REFERENCES ciudad (id_ciudad)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- Tabla de catálogo: Sucursales
CREATE TABLE sucursal (
    id_sucursal  INTEGER      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre       VARCHAR(150) NOT NULL,
    -- Validación ya existente: teléfono con formato internacional
    telefono     VARCHAR(20)
                     CHECK (telefono IS NULL OR telefono ~ '^\+?[\d\s\-\(\)]{7,20}$'),
    id_direccion INTEGER,
    activo       BOOLEAN      NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_sucursal_direccion FOREIGN KEY (id_direccion)
        REFERENCES direccion (id_direccion)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT uq_sucursal_nombre UNIQUE (nombre)
);

-- Tabla transaccional: Almacenes
CREATE TABLE almacen (
    id_almacen  INTEGER      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    id_sucursal INTEGER      NOT NULL,
    capacidad   INTEGER,
    activo      BOOLEAN      NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_almacen_sucursal FOREIGN KEY (id_sucursal)
        REFERENCES sucursal (id_sucursal)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT uq_almacen_nombre_sucursal UNIQUE (nombre, id_sucursal),
    CONSTRAINT chk_almacen_capacidad
        CHECK (capacidad IS NULL OR capacidad > 0)
);

-- =====================================================
-- MÓDULO 3: PRODUCTOS E INVENTARIO
-- =====================================================

-- Tabla de catálogo: Categorías de productos
CREATE TABLE categoria_producto (
    id_categoria INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE
);

-- Tabla de catálogo: Productos
CREATE TABLE producto (
    id_producto INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_categoria INTEGER NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio NUMERIC(10,2) NOT NULL CHECK(precio > 0),
    -- CORRECCIÓN: código de barras solo dígitos, entre 8 y 14 caracteres (EAN-8, EAN-13, UPC-A)
    codigo_barras VARCHAR(50) UNIQUE
                      CHECK (codigo_barras IS NULL OR codigo_barras ~ '^\d{8,14}$'),
    activo BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_producto_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES categoria_producto(id_categoria)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- Tabla transaccional: Control de inventario
CREATE TABLE inventario (
    id_inventario INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_producto INTEGER NOT NULL,
    stock_actual INTEGER NOT NULL CHECK(stock_actual >= 0),
    stock_minimo INTEGER NOT NULL CHECK(stock_minimo >= 0),
    stock_maximo INTEGER NOT NULL CHECK(stock_maximo >= 0),
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_inventario_producto
        FOREIGN KEY (id_producto)
        REFERENCES producto(id_producto)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    -- Validación: stock_maximo debe ser mayor o igual al stock_minimo
    CONSTRAINT chk_stock_rangos
        CHECK (stock_maximo >= stock_minimo)
);

-- Tabla de catálogo: Tipos de movimiento
CREATE TABLE tipo_movimiento (
    id_tipo_movimiento INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT
);

-- Tabla transaccional: Movimientos de inventario
CREATE TABLE movimiento_inventario (
    id_movimiento INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_producto INTEGER NOT NULL,
    id_tipo_movimiento INTEGER NOT NULL,
    cantidad INTEGER NOT NULL CHECK(cantidad > 0),
    fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    referencia VARCHAR(150),
    usuario_registro VARCHAR(100) NOT NULL,
    CONSTRAINT fk_mov_producto
        FOREIGN KEY (id_producto)
        REFERENCES producto(id_producto)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_mov_tipo
        FOREIGN KEY (id_tipo_movimiento)
        REFERENCES tipo_movimiento(id_tipo_movimiento)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- Tabla transaccional: Mermas de inventario
CREATE TABLE merma (
    id_merma INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_producto INTEGER NOT NULL,
    cantidad INTEGER NOT NULL CHECK(cantidad > 0),
    motivo TEXT,
    fecha_merma DATE NOT NULL,
    usuario_registro VARCHAR(100) NOT NULL,
    CONSTRAINT fk_merma_producto
        FOREIGN KEY (id_producto)
        REFERENCES producto(id_producto)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- =====================================================
-- MÓDULO 3: COMPRAS
-- =====================================================

-- Tabla de catálogo: Proveedores
CREATE TABLE proveedor (
    id_proveedor INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_proveedor VARCHAR(150) NOT NULL,
    -- CORRECCIÓN: teléfono solo dígitos, espacios, guiones, paréntesis y +
    telefono VARCHAR(20)
                 CHECK (telefono IS NULL OR telefono ~ '^\+?[\d\s\-\(\)]{7,20}$'),
    -- CORRECCIÓN: correo debe tener formato válido
    correo VARCHAR(150) UNIQUE
               CHECK (correo IS NULL OR correo ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
    estado VARCHAR(20) NOT NULL DEFAULT 'activo',
    CONSTRAINT chk_estado_proveedor CHECK (estado IN ('activo', 'inactivo'))
);

-- Tabla transaccional: Órdenes de compra
CREATE TABLE orden_compra (
    id_orden_compra INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_proveedor INTEGER NOT NULL,
    fecha_orden DATE NOT NULL DEFAULT CURRENT_DATE,
    total_orden NUMERIC(10,2) NOT NULL,
    estado_orden VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    fecha_entrega DATE,
    CONSTRAINT fk_proveedor
        FOREIGN KEY (id_proveedor)
        REFERENCES proveedor(id_proveedor)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT chk_total_orden CHECK (total_orden >= 0),
    CONSTRAINT chk_estado_orden CHECK (estado_orden IN ('pendiente', 'enviada', 'recibida', 'cancelada')),
    CONSTRAINT chk_fecha_entrega CHECK (fecha_entrega IS NULL OR fecha_entrega >= fecha_orden)
);

-- Tabla transaccional: Detalle de órdenes de compra
CREATE TABLE detalle_orden_compra (
    id_detalle_orden INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_orden_compra INTEGER NOT NULL,
    id_producto INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario NUMERIC(10,2) NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL,
    CONSTRAINT fk_orden_compra
        FOREIGN KEY (id_orden_compra)
        REFERENCES orden_compra(id_orden_compra)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_detalle_producto
        FOREIGN KEY (id_producto)
        REFERENCES producto(id_producto)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT chk_cantidad CHECK (cantidad > 0),
    CONSTRAINT chk_precio_unitario CHECK (precio_unitario >= 0),
    CONSTRAINT chk_subtotal CHECK (subtotal >= 0),
    CONSTRAINT chk_subtotal_calculado CHECK (subtotal = cantidad * precio_unitario)
);

-- Tabla transaccional: Recepción de mercancía
CREATE TABLE recepcion_mercancia (
    id_recepcion INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_orden_compra INTEGER NOT NULL,
    fecha_recepcion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    recibido_por VARCHAR(100) NOT NULL,
    estado_recepcion VARCHAR(20) NOT NULL DEFAULT 'completa',
    observaciones TEXT,
    CONSTRAINT fk_orden_compra_recepcion
        FOREIGN KEY (id_orden_compra)
        REFERENCES orden_compra(id_orden_compra)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT chk_estado_recepcion CHECK (estado_recepcion IN ('completa', 'parcial', 'pendiente', 'rechazada'))
);

-- =====================================================
-- MÓDULO 4: VENTAS
-- =====================================================

-- Tabla de catálogo: Clientes
CREATE TABLE cliente (
    id_cliente INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    -- CORRECCIÓN: correo debe tener formato válido
    correo VARCHAR(150)
               CHECK (correo IS NULL OR correo ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
    -- CORRECCIÓN: teléfono solo dígitos, espacios, guiones, paréntesis y +
    telefono VARCHAR(20)
                 CHECK (telefono IS NULL OR telefono ~ '^\+?[\d\s\-\(\)]{7,20}$'),
    fecha_registro DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Tabla de catálogo: Métodos de pago
CREATE TABLE metodo_pago (
    id_metodo_pago INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT
);

-- Tabla transaccional: Ventas
CREATE TABLE venta (
    id_venta INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
    id_cliente INTEGER NOT NULL,
    id_empleado INTEGER NOT NULL,
    CONSTRAINT fk_venta_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES cliente(id_cliente)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_venta_empleado
        FOREIGN KEY (id_empleado)
        REFERENCES Empleados(id_empleado)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- Tabla transaccional: Detalle de ventas
CREATE TABLE detalle_venta (
    id_detalle INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_venta INTEGER NOT NULL,
    id_producto INTEGER NOT NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC(10,2) NOT NULL CHECK (precio_unitario >= 0),
    CONSTRAINT fk_detalle_venta
        FOREIGN KEY (id_venta)
        REFERENCES venta(id_venta)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_venta_producto
        FOREIGN KEY (id_producto)
        REFERENCES producto(id_producto)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- Tabla transaccional: Pagos
CREATE TABLE pago (
    id_pago INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_venta INTEGER NOT NULL,
    id_metodo_pago INTEGER NOT NULL,
    monto NUMERIC(10,2) NOT NULL CHECK (monto > 0),
    fecha_pago TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pago_venta
        FOREIGN KEY (id_venta)
        REFERENCES venta(id_venta)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_pago_metodo
        FOREIGN KEY (id_metodo_pago)
        REFERENCES metodo_pago(id_metodo_pago)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- Tabla transaccional: Facturas
CREATE TABLE factura (
    id_factura INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_venta INTEGER NOT NULL UNIQUE,
    fecha_emision DATE NOT NULL DEFAULT CURRENT_DATE,
    total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
    CONSTRAINT fk_factura_venta
        FOREIGN KEY (id_venta)
        REFERENCES venta(id_venta)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- Tabla transaccional: Devoluciones
CREATE TABLE devolucion (
    id_devolucion INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_venta INTEGER NOT NULL,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    motivo TEXT,
    CONSTRAINT fk_devolucion_venta
        FOREIGN KEY (id_venta)
        REFERENCES venta(id_venta)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);
