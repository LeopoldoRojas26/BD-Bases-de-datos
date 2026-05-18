const pool = require('../config/database');

const permisosSistemaController = {
  obtenerTodos: async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM permisossistema ORDER BY id_permiso_sys DESC');
      res.json({ success: true, data: result.rows, count: result.rowCount });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM permisossistema WHERE id_permiso_sys = $1', [id]);
      
      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Permiso no encontrado' });
      }
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  crear: async (req, res) => {
    try {
      const { nombre_permiso, modulo, descripcion } = req.body;

      if (!nombre_permiso || !modulo) {
        return res.status(400).json({ success: false, error: 'El nombre del permiso y el módulo son requeridos' });
      }

      const result = await pool.query(
        `INSERT INTO permisossistema (nombre_permiso, modulo, descripcion)
         VALUES ($1, $2, $3) RETURNING *`,
        [nombre_permiso, modulo, descripcion || null]
      );

      res.status(201).json({ success: true, message: 'Permiso creado', data: result.rows[0] });
    } catch (error) {
      if (error.code === '23505') {
        return res.status(400).json({ success: false, error: 'Ya existe un permiso con este nombre' });
      }
      res.status(500).json({ success: false, error: error.message });
    }
  },

  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre_permiso, modulo, descripcion } = req.body;

      const result = await pool.query(
        `UPDATE permisossistema
         SET nombre_permiso = COALESCE($1, nombre_permiso),
             modulo = COALESCE($2, modulo),
             descripcion = $3
         WHERE id_permiso_sys = $4
         RETURNING *`,
        [nombre_permiso, modulo, descripcion || null, id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Permiso no encontrado' });
      }

      res.json({ success: true, message: 'Permiso actualizado', data: result.rows[0] });
    } catch (error) {
      if (error.code === '23505') {
        return res.status(400).json({ success: false, error: 'Ya existe un permiso con este nombre' });
      }
      res.status(500).json({ success: false, error: error.message });
    }
  },

  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM permisossistema WHERE id_permiso_sys = $1 RETURNING *', [id]);

      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Permiso no encontrado' });
      }

      res.json({ success: true, message: 'Permiso eliminado', data: result.rows[0] });
    } catch (error) {
      if (error.code === '23503') {
        return res.status(400).json({ 
          success: false, 
          error: 'No se puede eliminar el permiso porque está siendo utilizado por uno o más roles.' 
        });
      }
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = permisosSistemaController;
