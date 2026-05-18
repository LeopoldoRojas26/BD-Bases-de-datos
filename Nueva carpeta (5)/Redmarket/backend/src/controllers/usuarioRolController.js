const pool = require('../config/database');

const usuarioRolController = {
  obtenerTodos: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT ur.id_usuario_rol, ur.id_usuario, ur.id_rol, ur.fecha_asignacion,
               u.username, r.nombre_rol
        FROM usuario_rol ur
        INNER JOIN usuarios u ON ur.id_usuario = u.id_usuario
        INNER JOIN roles r ON ur.id_rol = r.id_rol
        ORDER BY ur.id_usuario_rol DESC
      `);
      res.json({ success: true, data: result.rows, count: result.rowCount });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(`
        SELECT ur.id_usuario_rol, ur.id_usuario, ur.id_rol, ur.fecha_asignacion,
               u.username, r.nombre_rol
        FROM usuario_rol ur
        INNER JOIN usuarios u ON ur.id_usuario = u.id_usuario
        INNER JOIN roles r ON ur.id_rol = r.id_rol
        WHERE ur.id_usuario_rol = $1
      `, [id]);
      
      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Asignación no encontrada' });
      }
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  crear: async (req, res) => {
    try {
      const { id_usuario, id_rol } = req.body;

      if (!id_usuario || !id_rol) {
        return res.status(400).json({ success: false, error: 'Usuario y Rol son requeridos' });
      }

      const result = await pool.query(
        `INSERT INTO usuario_rol (id_usuario, id_rol)
         VALUES ($1, $2) RETURNING *`,
        [id_usuario, id_rol]
      );

      res.status(201).json({ success: true, message: 'Rol asignado al usuario', data: result.rows[0] });
    } catch (error) {
      // Manejo de constraint unique o foráneas
      if (error.code === '23505') {
        return res.status(400).json({ success: false, error: 'Este usuario ya tiene asignado este rol' });
      }
      if (error.code === '23503') {
        return res.status(400).json({ success: false, error: 'El usuario o el rol especificado no existe' });
      }
      res.status(500).json({ success: false, error: error.message });
    }
  },

  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { id_usuario, id_rol } = req.body;

      const result = await pool.query(
        `UPDATE usuario_rol
         SET id_usuario = COALESCE($1, id_usuario),
             id_rol = COALESCE($2, id_rol)
         WHERE id_usuario_rol = $3
         RETURNING *`,
        [id_usuario, id_rol, id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Asignación no encontrada' });
      }

      res.json({ success: true, message: 'Asignación actualizada', data: result.rows[0] });
    } catch (error) {
      if (error.code === '23505') {
        return res.status(400).json({ success: false, error: 'Este usuario ya tiene asignado este rol' });
      }
      if (error.code === '23503') {
        return res.status(400).json({ success: false, error: 'El usuario o el rol especificado no existe' });
      }
      res.status(500).json({ success: false, error: error.message });
    }
  },

  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      
      const result = await pool.query('DELETE FROM usuario_rol WHERE id_usuario_rol = $1 RETURNING *', [id]);

      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Asignación no encontrada' });
      }

      res.json({ success: true, message: 'Asignación eliminada', data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = usuarioRolController;
