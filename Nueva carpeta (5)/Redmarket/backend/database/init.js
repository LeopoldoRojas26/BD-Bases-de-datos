const pool = require('../src/config/database');
const fs = require('fs');
const path = require('path');

const initDatabase = async () => {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Inicializando base de datos RedMarket...\n');

    // 1. Crear esquema (tablas)
    console.log('📋 Creando tablas...');
    const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await client.query(schemaSQL);
    console.log('✅ Tablas creadas\n');

    // 2. Insertar datos iniciales
    console.log('📦 Insertando datos de prueba...');
    const seedsSQL = fs.readFileSync(path.join(__dirname, 'seeds.sql'), 'utf8');
    await client.query(seedsSQL);
    console.log('✅ Datos insertados\n');

    // 3. Crear vistas
    console.log('👁️  Creando vistas...');
    const viewsSQL = fs.readFileSync(path.join(__dirname, 'views.sql'), 'utf8');
    await client.query(viewsSQL);
    console.log('✅ Vistas creadas\n');

    // 4. Crear triggers
    console.log('⚡ Creando triggers...');
    const triggersSQL = fs.readFileSync(path.join(__dirname, 'triggers.sql'), 'utf8');
    await client.query(triggersSQL);
    console.log('✅ Triggers creados\n');

    // Resumen
    const stats = await client.query(`
      SELECT
        (SELECT COUNT(*) FROM producto) as productos,
        (SELECT COUNT(*) FROM empleados) as empleados,
        (SELECT COUNT(*) FROM cliente) as clientes,
        (SELECT COUNT(*) FROM proveedor) as proveedores,
        (SELECT COUNT(*) FROM venta) as ventas
    `);

    console.log('🎉 Base de datos inicializada exitosamente\n');
    console.log('📊 Resumen:');
    console.log(`   - Productos:   ${stats.rows[0].productos}`);
    console.log(`   - Empleados:   ${stats.rows[0].empleados}`);
    console.log(`   - Clientes:    ${stats.rows[0].clientes}`);
    console.log(`   - Proveedores: ${stats.rows[0].proveedores}`);
    console.log(`   - Ventas:      ${stats.rows[0].ventas}\n`);

  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

initDatabase()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
