const pool = require('../config/database');

const sesionesController = {
  obtenerTodos: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT s.id_sesion, s.id_usuario, s.token_sesion, s.fecha_inicio, 
               s.fecha_expiracion, s.fecha_cierre, s.ip_acceso, s.dispositivo, s.estatus,
               u.username
        FROM sesiones s
        INNER JOIN usuarios u ON s.id_usuario = u.id_usuario
        ORDER BY s.id_sesion DESC
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
        SELECT s.id_sesion, s.id_usuario, s.token_sesion, s.fecha_inicio, 
               s.fecha_expiracion, s.fecha_cierre, s.ip_acceso, s.dispositivo, s.estatus,
               u.username
        FROM sesiones s
        INNER JOIN usuarios u ON s.id_usuario = u.id_usuario
        WHERE s.id_sesion = $1
      `, [id]);
      
      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Sesión no encontrada' });
      }
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Para el módulo Admin, en lugar de un DELETE o crear sesiones a mano, 
  // daremos la opción de "Revocar/Cerrar" una sesión de forma manual.
  revocarSesion: async (req, res) => {
    try {
      const { id } = req.params;
      
      const result = await pool.query(
        `UPDATE sesiones 
         SET estatus = 'cerrada', 
             fecha_cierre = CURRENT_TIMESTAMP 
         WHERE id_sesion = $1 AND estatus = 'activa' 
         RETURNING *`, 
        [id]
      );

      if (result.rowCount === 0) {
        return res.status(400).json({ success: false, error: 'La sesión no fue encontrada o ya está cerrada/expirada' });
      }

      res.json({ success: true, message: 'Sesión revocada exitosamente', data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = sesionesController;
