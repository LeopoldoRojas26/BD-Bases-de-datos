const pool = require('../config/database');

const productosController = {
  // LISTAR todos los productos (READ)
  obtenerTodos: async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT * FROM productos ORDER BY id ASC'
      );
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

  // OBTENER un producto por ID (READ)
  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(
        'SELECT * FROM productos WHERE id = $1',
        [id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          error: 'Producto no encontrado'
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

  // CREAR un nuevo producto (CREATE)
  crear: async (req, res) => {
    try {
      const { nombre, precio, stock } = req.body;

      if (!nombre || precio === undefined || stock === undefined) {
        return res.status(400).json({
          success: false,
          error: 'Faltan campos requeridos: nombre, precio, stock'
        });
      }

      const result = await pool.query(
        'INSERT INTO productos (nombre, precio, stock) VALUES ($1, $2, $3) RETURNING *',
        [nombre, precio, stock]
      );

      res.status(201).json({
        success: true,
        message: 'Producto creado exitosamente',
        data: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // ACTUALIZAR un producto (UPDATE)
  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, precio, stock } = req.body;

      const result = await pool.query(
        `UPDATE productos 
         SET nombre = COALESCE($1, nombre),
             precio = COALESCE($2, precio),
             stock = COALESCE($3, stock),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $4
         RETURNING *`,
        [nombre, precio, stock, id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          error: 'Producto no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Producto actualizado exitosamente',
        data: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // ELIMINAR un producto (DELETE)
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        'DELETE FROM productos WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          error: 'Producto no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Producto eliminado exitosamente',
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

module.exports = productosController;
