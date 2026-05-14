const pool = require('../config/database');

const ventasController = {
  // LISTAR todas las ventas (READ)
  obtenerTodas: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT v.*, p.nombre as producto_nombre, p.precio as precio_unitario
        FROM ventas v
        INNER JOIN productos p ON v.producto_id = p.id
        ORDER BY v.fecha DESC
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

  // OBTENER una venta por ID (READ)
  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(`
        SELECT v.*, p.nombre as producto_nombre, p.precio as precio_unitario
        FROM ventas v
        INNER JOIN productos p ON v.producto_id = p.id
        WHERE v.id = $1
      `, [id]);

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          error: 'Venta no encontrada'
        });
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // CREAR una nueva venta (CREATE) - Dispara los triggers
  crear: async (req, res) => {
    const client = await pool.connect();
    
    try {
      const { producto_id, cantidad } = req.body;

      if (!producto_id || !cantidad) {
        return res.status(400).json({
          success: false,
          error: 'Faltan campos requeridos: producto_id, cantidad'
        });
      }

      if (cantidad <= 0) {
        return res.status(400).json({
          success: false,
          error: 'La cantidad debe ser mayor a 0'
        });
      }

      await client.query('BEGIN');

      const productoResult = await client.query(
        'SELECT * FROM productos WHERE id = $1',
        [producto_id]
      );

      if (productoResult.rowCount === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({
          success: false,
          error: 'Producto no encontrado'
        });
      }

      const producto = productoResult.rows[0];
      const total = producto.precio * cantidad;

      const ventaResult = await client.query(
        'INSERT INTO ventas (producto_id, cantidad, total) VALUES ($1, $2, $3) RETURNING *',
        [producto_id, cantidad, total]
      );

      await client.query('COMMIT');

      const ventaCompleta = await client.query(`
        SELECT v.*, p.nombre as producto_nombre, p.precio as precio_unitario, p.stock as stock_restante
        FROM ventas v
        INNER JOIN productos p ON v.producto_id = p.id
        WHERE v.id = $1
      `, [ventaResult.rows[0].id]);

      res.status(201).json({
        success: true,
        message: 'Venta realizada exitosamente. Stock descontado automáticamente por trigger.',
        data: ventaCompleta.rows[0]
      });

    } catch (error) {
      await client.query('ROLLBACK');
      
      res.status(400).json({
        success: false,
        error: error.message,
        info: 'La transacción fue cancelada. No se realizaron cambios en la base de datos.'
      });
    } finally {
      client.release();
    }
  },

  // ELIMINAR una venta (DELETE)
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        'DELETE FROM ventas WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          error: 'Venta no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Venta eliminada exitosamente',
        data: result.rows[0],
        info: 'Nota: El stock NO se restaura automáticamente al eliminar una venta'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = ventasController;
