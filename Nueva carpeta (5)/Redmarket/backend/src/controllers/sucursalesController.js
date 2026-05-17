const pool = require('../config/database');

const sucursalesController = {

  obtenerTodos: async (req, res) => {
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
      res.json({ success: true, data: result.rows, count: result.rowCount });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(
        `SELECT 
          s.id_sucursal, s.nombre, s.telefono, s.activo,
          d.calle || ' #' || d.numero AS direccion,
          d.colonia, d.codigo_postal,
          c.nombre AS ciudad, e.nombre AS estado
        FROM sucursal s
        LEFT JOIN direccion d ON s.id_direccion = d.id_direccion
        LEFT JOIN ciudad c ON d.id_ciudad = c.id_ciudad
        LEFT JOIN estado e ON c.id_estado = e.id_estado
        WHERE s.id_sucursal = $1`,
        [id]
      );
      if (result.rowCount === 0)
        return res.status(404).json({ success: false, error: 'Sucursal no encontrada' });
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Almacenes de una sucursal específica
  obtenerAlmacenes: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(
        `SELECT id_almacen, nombre, capacidad, activo
         FROM almacen
         WHERE id_sucursal = $1
         ORDER BY nombre`,
        [id]
      );
      res.json({ success: true, data: result.rows, count: result.rowCount });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  crear: async (req, res) => {
    const client = await pool.connect();
    try {
      const { nombre, telefono, calle, numero, colonia, codigo_postal, id_ciudad } = req.body;
      if (!nombre || !calle || !numero || !id_ciudad)
        return res.status(400).json({ success: false, error: 'nombre, calle, numero e id_ciudad son requeridos' });

      await client.query('BEGIN');
      const dirResult = await client.query(
        `INSERT INTO direccion (calle, numero, colonia, codigo_postal, id_ciudad)
         VALUES ($1, $2, $3, $4, $5) RETURNING id_direccion`,
        [calle, numero, colonia || null, codigo_postal || null, id_ciudad]
      );
      const sucResult = await client.query(
        `INSERT INTO sucursal (nombre, telefono, id_direccion, activo)
         VALUES ($1, $2, $3, TRUE) RETURNING *`,
        [nombre, telefono || null, dirResult.rows[0].id_direccion]
      );
      await client.query('COMMIT');
      res.status(201).json({ success: true, message: 'Sucursal creada exitosamente', data: sucResult.rows[0] });
    } catch (error) {
      await client.query('ROLLBACK');
      res.status(500).json({ success: false, error: error.message });
    } finally {
      client.release();
    }
  },

  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, telefono, activo } = req.body;
      const result = await pool.query(
        `UPDATE sucursal
         SET nombre = COALESCE($1, nombre), telefono = COALESCE($2, telefono), activo = COALESCE($3, activo)
         WHERE id_sucursal = $4 RETURNING *`,
        [nombre, telefono, activo, id]
      );
      if (result.rowCount === 0)
        return res.status(404).json({ success: false, error: 'Sucursal no encontrada' });
      res.json({ success: true, message: 'Sucursal actualizada', data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  toggleActivo: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(
        `UPDATE sucursal SET activo = NOT activo WHERE id_sucursal = $1 RETURNING *`,
        [id]
      );
      if (result.rowCount === 0)
        return res.status(404).json({ success: false, error: 'Sucursal no encontrada' });
      res.json({ success: true, message: `Sucursal ${result.rows[0].activo ? 'activada' : 'desactivada'}`, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = sucursalesController;