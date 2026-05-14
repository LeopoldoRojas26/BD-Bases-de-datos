const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./config/database');
const productosRoutes = require('./routes/productos');
const ventasRoutes = require('./routes/ventas');
const auditoriaRoutes = require('./routes/auditoria');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    message: '🚀 API CRUD con PostgreSQL - Sprint 4',
    version: '1.0.0',
    endpoints: {
      productos: {
        'GET /api/productos': 'Listar todos los productos',
        'GET /api/productos/:id': 'Obtener un producto',
        'POST /api/productos': 'Crear producto',
        'PUT /api/productos/:id': 'Actualizar producto',
        'DELETE /api/productos/:id': 'Eliminar producto'
      },
      ventas: {
        'GET /api/ventas': 'Listar todas las ventas',
        'GET /api/ventas/:id': 'Obtener una venta',
        'POST /api/ventas': 'Crear venta (dispara triggers)',
        'DELETE /api/ventas/:id': 'Eliminar venta'
      },
      auditoria: {
        'GET /api/auditoria': 'Ver historial de cambios de stock',
        'GET /api/auditoria/producto/:producto_id': 'Ver historial por producto'
      }
    },
    triggers: [
      'trigger_validar_stock - Valida stock disponible antes de venta',
      'trigger_descontar_stock - Descuenta stock y registra auditoría'
    ]
  });
});

app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'OK',
      database: 'Conectado ✅',
      timestamp: result.rows[0].now
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      database: 'Desconectado ❌',
      error: error.message
    });
  }
});

app.use('/api/productos', productosRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/auditoria', auditoriaRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    path: req.path
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log('\n🚀 ========================================');
  console.log(`   Servidor corriendo en http://localhost:${PORT}`);
  console.log('   ========================================');
  console.log('\n📡 Endpoints disponibles:');
  console.log(`   - Documentación: http://localhost:${PORT}/`);
  console.log(`   - Health Check:  http://localhost:${PORT}/api/health`);
  console.log(`   - Productos:     http://localhost:${PORT}/api/productos`);
  console.log(`   - Ventas:        http://localhost:${PORT}/api/ventas`);
  console.log(`   - Auditoría:     http://localhost:${PORT}/api/auditoria\n`);
});

process.on('SIGINT', async () => {
  console.log('\n\n👋 Cerrando servidor...');
  await pool.end();
  process.exit(0);
});
