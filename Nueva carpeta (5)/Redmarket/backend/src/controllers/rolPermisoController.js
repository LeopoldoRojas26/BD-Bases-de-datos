const pool = require('../config/database');

const rolPermisoController = {
  obtenerTodos: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT rp.id_rol_permiso, rp.id_rol, rp.id_permiso_sys,
               r.nombre_rol, p.nombre_permiso, p.modulo
        FROM rol_permiso rp
        INNER JOIN roles r ON rp.id_rol = r.id_rol
        INNER JOIN permisossistema p ON rp.id_permiso_sys = p.id_permiso_sys
        ORDER BY rp.id_rol_permiso DESC
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
        SELECT rp.id_rol_permiso, rp.id_rol, rp.id_permiso_sys,
               r.nombre_rol, p.nombre_permiso, p.modulo
        FROM rol_permiso rp
        INNER JOIN roles r ON rp.id_rol = r.id_rol
        INNER JOIN permisossistema p ON rp.id_permiso_sys = p.id_permiso_sys
        WHERE rp.id_rol_permiso = $1
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
      const { id_rol, id_permiso_sys } = req.body;

      if (!id_rol || !id_permiso_sys) {
        return res.status(400).json({ success: false, error: 'Rol y Permiso son requeridos' });
      }

      const result = await pool.query(
        `INSERT INTO rol_permiso (id_rol, id_permiso_sys)
         VALUES ($1, $2) RETURNING *`,
        [id_rol, id_permiso_sys]
      );

      res.status(201).json({ success: true, message: 'Permiso asignado al rol', data: result.rows[0] });
    } catch (error) {
      if (error.code === '23505') {
        return res.status(400).json({ success: false, error: 'Este rol ya tiene asignado este permiso' });
      }
      if (error.code === '23503') {
        return res.status(400).json({ success: false, error: 'El rol o el permiso especificado no existe' });
      }
      res.status(500).json({ success: false, error: error.message });
    }
  },

  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { id_rol, id_permiso_sys } = req.body;

      const result = await pool.query(
        `UPDATE rol_permiso
         SET id_rol = COALESCE($1, id_rol),
             id_permiso_sys = COALESCE($2, id_permiso_sys)
         WHERE id_rol_permiso = $3
         RETURNING *`,
        [id_rol, id_permiso_sys, id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Asignación no encontrada' });
      }

      res.json({ success: true, message: 'Asignación actualizada', data: result.rows[0] });
    } catch (error) {
      if (error.code === '23505') {
        return res.status(400).json({ success: false, error: 'Este rol ya tiene asignado este permiso' });
      }
      if (error.code === '23503') {
        return res.status(400).json({ success: false, error: 'El rol o el permiso especificado no existe' });
      }
      res.status(500).json({ success: false, error: error.message });
    }
  },

  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM rol_permiso WHERE id_rol_permiso = $1 RETURNING *', [id]);

      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Asignación no encontrada' });
      }

      res.json({ success: true, message: 'Asignación eliminada', data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = rolPermisoController;
