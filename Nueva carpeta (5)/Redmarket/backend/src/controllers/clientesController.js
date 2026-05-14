const pool = require('../config/database');

const clientesController = {
  // LISTAR todos los clientes
  obtenerTodos: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT * FROM cliente
        ORDER BY fecha_registro DESC
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

  // OBTENER un cliente por ID
  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        'SELECT * FROM cliente WHERE id_cliente = $1',
        [id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          error: 'Cliente no encontrado'
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

  // CREAR un nuevo cliente
  crear: async (req, res) => {
    try {
      const { nombre, correo, telefono } = req.body;

      if (!nombre) {
        return res.status(400).json({
          success: false,
          error: 'El campo nombre es requerido'
        });
      }

      const result = await pool.query(
        `INSERT INTO cliente (nombre, correo, telefono, fecha_registro)
         VALUES ($1, $2, $3, CURRENT_DATE)
         RETURNING *`,
        [nombre, correo, telefono]
      );

      res.status(201).json({
        success: true,
        message: 'Cliente creado exitosamente',
        data: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // ACTUALIZAR un cliente
  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, correo, telefono } = req.body;

      const result = await pool.query(
        `UPDATE cliente
         SET nombre = COALESCE($1, nombre),
             correo = COALESCE($2, correo),
             telefono = COALESCE($3, telefono)
         WHERE id_cliente = $4
         RETURNING *`,
        [nombre, correo, telefono, id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          error: 'Cliente no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Cliente actualizado exitosamente',
        data: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // ELIMINAR un cliente
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        'DELETE FROM cliente WHERE id_cliente = $1 RETURNING *',
        [id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          error: 'Cliente no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Cliente eliminado exitosamente',
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

module.exports = clientesController;
