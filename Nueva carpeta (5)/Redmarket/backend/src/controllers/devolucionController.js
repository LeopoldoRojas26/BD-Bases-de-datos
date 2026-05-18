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
    const client = await pool.connect();
    try {
      const { id_venta, motivo } = req.body;

      await client.query('BEGIN');

      const result = await client.query(
        `INSERT INTO devolucion (id_venta, motivo)
         VALUES ($1, $2)
         RETURNING *`,
        [id_venta, motivo]
      );

      // Obtener detalles de la venta para restaurar inventario
      const detalles = await client.query(
        'SELECT id_producto, cantidad FROM detalle_venta WHERE id_venta = $1',
        [id_venta]
      );

      // Restaurar inventario
      for (const item of detalles.rows) {
        await client.query(
          `UPDATE inventario 
           SET stock_actual = stock_actual + $1,
               ultima_actualizacion = CURRENT_TIMESTAMP
           WHERE id_producto = $2`,
          [item.cantidad, item.id_producto]
        );
      }

      await client.query('COMMIT');
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      await client.query('ROLLBACK');
      res.status(500).json({ error: error.message });
    } finally {
      client.release();
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { motivo } = req.body;

      const result = await pool.query(
        `UPDATE devolucion
         SET motivo = $1
         WHERE id_devolucion = $2
         RETURNING *`,
        [motivo, id]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  remove: async (req, res) => {
    const client = await pool.connect();
    try {
      const { id } = req.params;

      await client.query('BEGIN');

      // Obtener la venta asociada
      const devolucion = await client.query('SELECT id_venta FROM devolucion WHERE id_devolucion = $1', [id]);

      if (devolucion.rowCount > 0) {
        const id_venta = devolucion.rows[0].id_venta;

        // Obtener detalles de la venta para descontar el inventario devuelto
        const detalles = await client.query(
          'SELECT id_producto, cantidad FROM detalle_venta WHERE id_venta = $1',
          [id_venta]
        );

        for (const item of detalles.rows) {
          await client.query(
            `UPDATE inventario 
             SET stock_actual = stock_actual - $1,
                 ultima_actualizacion = CURRENT_TIMESTAMP
             WHERE id_producto = $2`,
            [item.cantidad, item.id_producto]
          );
        }
      }

      await client.query('DELETE FROM devolucion WHERE id_devolucion = $1', [id]);
      
      await client.query('COMMIT');
      res.json({ success: true, message: 'Devolución eliminada' });
    } catch (error) {
      await client.query('ROLLBACK');
      res.status(500).json({ error: error.message });
    } finally {
      client.release();
    }
  }
};

module.exports = devolucionController;