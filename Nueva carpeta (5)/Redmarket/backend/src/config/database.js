const { Pool } = require('pg');
require('dotenv').config();

// Configuración: Priorizar DATABASE_URL (Supabase) sobre parámetros individuales
let poolConfig;

if (process.env.DATABASE_URL) {
  // Usar DATABASE_URL para Supabase u otros servicios cloud
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  };
  console.log('🌐 Usando DATABASE_URL (Supabase/Cloud)');
} else {
  // Usar parámetros individuales para PostgreSQL local (DBngin)
  poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'redmarket_db',
  };
  console.log('💻 Usando configuración local (DBngin/PostgreSQL)');
}

const pool = new Pool(poolConfig);

pool.on('connect', () => {
  console.log('✅ Conectado a PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Error en conexión PostgreSQL:', err);
  process.exit(-1);
});

module.exports = pool;
