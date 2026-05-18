const pool = require('../config/database');

const bitacoraController = {
  obtenerTodos: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT b.id_log, b.id_usuario, b.accion, b.tabla_afectada, b.id_registro, 
               b.datos_anteriores, b.datos_nuevos, b.fecha_hora, b.ip_origen,
               u.username
        FROM bitacoralog b
        INNER JOIN usuarios u ON b.id_usuario = u.id_usuario
        ORDER BY b.id_log DESC
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
        SELECT b.id_log, b.id_usuario, b.accion, b.tabla_afectada, b.id_registro, 
               b.datos_anteriores, b.datos_nuevos, b.fecha_hora, b.ip_origen,
               u.username
        FROM bitacoralog b
        INNER JOIN usuarios u ON b.id_usuario = u.id_usuario
        WHERE b.id_log = $1
      `, [id]);
      
      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Log no encontrado' });
      }
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
  // No creamos rutas POST, PUT ni DELETE para la bitácora desde la API,
  // ya que debe ser inmutable y se llena automáticamente mediante triggers en la BD.
};

module.exports = bitacoraController;
