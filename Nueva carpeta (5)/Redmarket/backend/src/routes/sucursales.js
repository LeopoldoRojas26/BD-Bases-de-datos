const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.id_sucursal,
        s.nombre,
        s.telefono,
        s.activo,
        d.calle || ' #' || d.numero AS direccion,
        d.colonia,
        d.codigo_postal,
        c.nombre AS ciudad,
        e.nombre AS estado
      FROM sucursal s
      LEFT JOIN direccion d ON s.id_direccion = d.id_direccion
      LEFT JOIN ciudad c ON d.id_ciudad = c.id_ciudad
      LEFT JOIN estado e ON c.id_estado = e.id_estado
      ORDER BY s.id_sucursal
    `);
    res.json({ success: true, data: result.rows, count: result.rows.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;