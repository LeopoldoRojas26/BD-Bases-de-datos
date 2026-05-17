const pool = require('../config/database');

const devolucionController = {
  getAll: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT * FROM devolucion ORDER BY id_devolucion ASC
      `);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(
        'SELECT * FROM devolucion WHERE id_devolucion = $1',
        [id]
      );
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const { id_venta, motivo } = req.body;

      const result = await pool.query(
        `INSERT INTO devolucion (id_venta, motivo)
         VALUES ($1, $2)
         RETURNING *`,
        [id_venta, motivo]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { id_venta, motivo } = req.body;

      const result = await pool.query(
        `UPDATE devolucion
         SET id_venta = $1,
             motivo = $2
         WHERE id_devolucion = $3
         RETURNING *`,
        [id_venta, motivo, id]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  remove: async (req, res) => {
    try {
      const { id } = req.params;

      await pool.query('DELETE FROM devolucion WHERE id_devolucion = $1', [id]);

      res.json({ success: true, message: 'Devolución eliminada' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = devolucionController;