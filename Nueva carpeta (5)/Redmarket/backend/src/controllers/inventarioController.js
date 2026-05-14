const pool = require('../config/database');

const inventarioController = {
  // LISTAR inventario crítico (stock bajo)
  obtenerCritico: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
          i.*,
          p.nombre AS producto,
          p.precio,
          cp.nombre AS categoria
        FROM inventario i
        INNER JOIN producto p ON i.id_producto = p.id_producto
        INNER JOIN categoria_producto cp ON p.id_categoria = cp.id_categoria
        WHERE i.stock_actual <= i.stock_minimo
        ORDER BY i.stock_actual ASC
      `);

      res.json({
        success: true,
        data: result.rows,
        count: result.rowCount,
        message: `${result.rowCount} producto(s) con stock crítico`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // OBTENER todo el inventario
  obtenerTodo: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
          i.*,
          p.nombre AS producto,
          p.precio,
          cp.nombre AS categoria,
          CASE
            WHEN i.stock_actual = 0 THEN 'AGOTADO'
            WHEN i.stock_actual <= i.stock_minimo THEN 'CRÍTICO'
            WHEN i.stock_actual >= i.stock_maximo THEN 'EXCEDENTE'
            ELSE 'NORMAL'
          END AS estado_stock
        FROM inventario i
        INNER JOIN producto p ON i.id_producto = p.id_producto
        INNER JOIN categoria_producto cp ON p.id_categoria = cp.id_categoria
        ORDER BY i.stock_actual ASC
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

  // ACTUALIZAR inventario manualmente
  actualizar: async (req, res) => {
    try {
      const { id_producto } = req.params;
      const { stock_actual, stock_minimo, stock_maximo } = req.body;

      const result = await pool.query(
        `UPDATE inventario
         SET stock_actual = COALESCE($1, stock_actual),
             stock_minimo = COALESCE($2, stock_minimo),
             stock_maximo = COALESCE($3, stock_maximo),
             ultima_actualizacion = CURRENT_TIMESTAMP
         WHERE id_producto = $4
         RETURNING *`,
        [stock_actual, stock_minimo, stock_maximo, id_producto]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          error: 'Inventario no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Inventario actualizado exitosamente',
        data: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = inventarioController;
