const pool = require('../config/database');

const detalleVentaController = {

  // LISTAR todos
  obtenerTodos: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT * FROM detalle_venta
        ORDER BY id_detalle DESC
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

  // OBTENER por ID
  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        'SELECT * FROM detalle_venta WHERE id_detalle = $1',
        [id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          error: 'Detalle no encontrado'
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

  // CREAR
  crear: async (req, res) => {
    try {
      const { id_venta, id_producto, cantidad, precio_unitario } = req.body;

      const result = await pool.query(
        `INSERT INTO detalle_venta 
        (id_venta, id_producto, cantidad, precio_unitario)
        VALUES ($1,$2,$3,$4)
        RETURNING *`,
        [id_venta, id_producto, cantidad, precio_unitario]
      );

      res.status(201).json({
        success: true,
        message: 'Detalle creado',
        data: result.rows[0]
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // ACTUALIZAR
  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { cantidad, precio_unitario } = req.body;

      const result = await pool.query(
        `UPDATE detalle_venta
         SET cantidad = COALESCE($1, cantidad),
             precio_unitario = COALESCE($2, precio_unitario)
         WHERE id_detalle = $3
         RETURNING *`,
        [cantidad, precio_unitario, id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          error: 'Detalle no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Detalle actualizado',
        data: result.rows[0]
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // ELIMINAR
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        'DELETE FROM detalle_venta WHERE id_detalle = $1 RETURNING *',
        [id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          error: 'Detalle no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Detalle eliminado',
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

module.exports = detalleVentaController;