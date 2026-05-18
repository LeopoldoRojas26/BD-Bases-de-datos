const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./config/database');

// Importar rutas
const productosRoutes = require('./routes/productos');
const ventasRoutes = require('./routes/ventas');
const empleadosRoutes = require('./routes/empleados');
const clientesRoutes = require('./routes/clientes');
const proveedoresRoutes = require('./routes/proveedores');
const inventarioRoutes = require('./routes/inventario');
const metodosPagoRoutes = require('./routes/metodosPago');
const detalleVentaRoutes = require('./routes/detalleVenta');
const pagosRoutes = require('./routes/pagos');
const facturaRoutes = require('./routes/factura');
const devolucionRoutes = require('./routes/devolucion');
const sucursalesRoutes = require('./routes/sucursales');
const usuariosRoutes = require('./routes/usuarios');
const rolesRoutes = require('./routes/roles');
const usuarioRolRoutes = require('./routes/usuarioRol');
const permisosSistemaRoutes = require('./routes/permisosSistema');
const rolPermisoRoutes = require('./routes/rolPermiso');
const bitacoraRoutes = require('./routes/bitacora');
const sesionesRoutes = require('./routes/sesiones');
const ordenCompraRoutes = require('./routes/ordenCompra');
const detalleOrdenCompraRoutes = require('./routes/detalleOrdenCompra');
const recepcionMercanciaRoutes = require('./routes/recepcionMercancia');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'RedMarket API - Sistema de Gestión Integral',
    version: '1.0.0',
    endpoints: {
      productos: '/api/productos',
      ventas: '/api/ventas',
      empleados: '/api/empleados',
      clientes: '/api/clientes',
      proveedores: '/api/proveedores',
      inventario: '/api/inventario',
      metodos_pago: '/api/metodos-pago',
      detalle_venta: '/api/detalle-venta',
      pagos: '/api/pagos',
      factura: '/api/factura',
      devolucion: '/api/devolucion',
      sucursales: '/api/sucursales',
      usuarios: '/api/usuarios',
      roles: '/api/roles',
      usuario_rol: '/api/usuario-rol',
      permisos_sistema: '/api/permisos-sistema',
      rol_permiso: '/api/rol-permiso',
      bitacora: '/api/bitacora',
      sesiones: '/api/sesiones',
      orden_compra: '/api/orden-compra',
      detalle_orden_compra: '/api/detalle-orden-compra',
      recepcion_mercancia: '/api/recepcion-mercancia'
    }
  });
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW(), version()');
    res.json({
      status: 'OK',
      database: 'Conectado',
      timestamp: result.rows[0].now,
      pg_version: result.rows[0].version
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      database: 'Desconectado',
      error: error.message
    });
  }
});

// Rutas de la API
app.use('/api/productos', productosRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/empleados', empleadosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/metodos-pago', metodosPagoRoutes);
app.use('/api/detalle-venta', detalleVentaRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/factura', facturaRoutes);
app.use('/api/devolucion', devolucionRoutes);
app.use('/api/sucursales', sucursalesRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/usuario-rol', usuarioRolRoutes);
app.use('/api/permisos-sistema', permisosSistemaRoutes);
app.use('/api/rol-permiso', rolPermisoRoutes);
app.use('/api/bitacora', bitacoraRoutes);
app.use('/api/sesiones', sesionesRoutes);
app.use('/api/orden-compra', ordenCompraRoutes);
app.use('/api/detalle-orden-compra', detalleOrdenCompraRoutes);
app.use('/api/recepcion-mercancia', recepcionMercanciaRoutes);

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    path: req.path,
    method: req.method
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('\n Usando configuración local (DBngin/PostgreSQL)');
  console.log('\n ========================================');
  console.log(`   RedMarket API corriendo en http://localhost:${PORT}`);
  console.log('   ========================================');
  console.log('\n Endpoints disponibles:');
  console.log(`   - Home:       http://localhost:${PORT}/`);
  console.log(`   - Health:     http://localhost:${PORT}/api/health`);
  console.log(`   - Productos:  http://localhost:${PORT}/api/productos`);
  console.log(`   - Ventas:     http://localhost:${PORT}/api/ventas`);
  console.log(`   - Empleados:  http://localhost:${PORT}/api/empleados`);
  console.log(`   - Clientes:   http://localhost:${PORT}/api/clientes`);
  console.log(`   - Métodos pago: http://localhost:${PORT}/api/metodos-pago`);
  console.log(`   - Detalle venta: http://localhost:${PORT}/api/detalle-venta`);
  console.log(`   - Pagos: http://localhost:${PORT}/api/pagos`);
  console.log(`   - factura: http://localhost:${PORT}/api/factura`);
  console.log(`   - devolucion: http://localhost:${PORT}/api/devolucion`);
  console.log(`   - Sucursales: http://localhost:${PORT}/api/sucursales`);
  console.log(`   - Usuarios:   http://localhost:${PORT}/api/usuarios`);
  console.log(`   - Roles:      http://localhost:${PORT}/api/roles`);
  console.log(`   - Usuario Rol: http://localhost:${PORT}/api/usuario-rol`);
  console.log(`   - Permisos:   http://localhost:${PORT}/api/permisos-sistema`);
  console.log(`   - Rol Permiso: http://localhost:${PORT}/api/rol-permiso`);
  console.log(`   - Bitácora:   http://localhost:${PORT}/api/bitacora`);
  console.log(`   - Sesiones:   http://localhost:${PORT}/api/sesiones`);
  console.log(`   - Orden Compra: http://localhost:${PORT}/api/orden-compra`);
  console.log(`   - Detalle Orden: http://localhost:${PORT}/api/detalle-orden-compra`);
  console.log(`   - Recepción:  http://localhost:${PORT}/api/recepcion-mercancia`);
});

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\n\n Cerrando servidor RedMarket...');
  await pool.end();
  process.exit(0);
});