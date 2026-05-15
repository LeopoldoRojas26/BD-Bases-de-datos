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

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: '🛒 RedMarket API - Sistema de Gestión Integral',
    version: '1.0.0',
    modules: {
      rrhh: 'Recursos Humanos',
      sucursales: 'Gestión de Sucursales y Almacenes',
      inventario: 'Control de Stock y Productos',
      compras: 'Órdenes de Compra y Proveedores',
      ventas: 'Ventas, Clientes y Facturación',
      administrativo: 'Usuarios, Roles y Auditoría'
    },
    endpoints: {
      productos: '/api/productos',
      ventas: '/api/ventas',
      empleados: '/api/empleados',
      clientes: '/api/clientes',
      proveedores: '/api/proveedores',
      inventario: '/api/inventario',

      metodos_pago: '/api/metodos-pago',
       detalle_venta: '/api/detalle-venta'
      
    }
  });
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW(), version()');
    res.json({
      status: 'OK',
      database: 'Conectado ✅',
      timestamp: result.rows[0].now,
      pg_version: result.rows[0].version
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      database: 'Desconectado ❌',
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
  console.error('❌ Error:', err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('\n🚀 ========================================');
  console.log(`   RedMarket API corriendo en http://localhost:${PORT}`);
  console.log('   ========================================');
  console.log('\n📡 Endpoints disponibles:');
  console.log(`   - Home:       http://localhost:${PORT}/`);
  console.log(`   - Health:     http://localhost:${PORT}/api/health`);
  console.log(`   - Productos:  http://localhost:${PORT}/api/productos`);
  console.log(`   - Ventas:     http://localhost:${PORT}/api/ventas`);
  console.log(`   - Empleados:  http://localhost:${PORT}/api/empleados`);
  console.log(`   - Clientes:   http://localhost:${PORT}/api/clientes\n`);

  console.log(`   - Métodos pago: http://localhost:${PORT}/api/metodos-pago`);
  console.log(`   - Detalle venta: http://localhost:${PORT}/api/detalle-venta\n`);
});

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\n\n👋 Cerrando servidor RedMarket...');
  await pool.end();
  process.exit(0);
});
