const pool = require('../config/database');

const auditoriaController = {
  // LISTAR historial de cambios de stock
  obtenerHistorial: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT a.*, p.nombre as producto_nombre
        FROM auditoria_stock a
        INNER JOIN productos p ON a.producto_id = p.id
        ORDER BY a.fecha DESC
      `);

      res.json({
        success: true,
        data: result.rows,
        count: result.rowCount
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // OBTENER historial por producto
  obtenerPorProducto: async (req, res) => {
    try {
      const { producto_id } = req.params;

      const result = await pool.query(`
        SELECT a.*, p.nombre as producto_nombre
        FROM auditoria_stock a
        INNER JOIN productos p ON a.producto_id = p.id
        WHERE a.producto_id = $1
        ORDER BY a.fecha DESC
      `, [producto_id]);

      res.json({
        success: true,
        data: result.rows,
        count: result.rowCount
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = auditoriaController;
