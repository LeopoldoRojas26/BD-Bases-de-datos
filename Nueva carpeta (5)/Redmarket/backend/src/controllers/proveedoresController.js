const pool = require('../config/database');

const proveedoresController = {
  // LISTAR todos los proveedores
  obtenerTodos: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT id_proveedor, nombre_proveedor, telefono, correo, estado
        FROM proveedor
        ORDER BY id_proveedor DESC
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

  // OBTENER un proveedor por ID
  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        'SELECT id_proveedor, nombre_proveedor, telefono, correo, estado FROM proveedor WHERE id_proveedor = $1',
        [id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          error: 'Proveedor no encontrado'
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

  // CREAR un proveedor
  crear: async (req, res) => {
    try {
      const { nombre_proveedor, telefono, correo, estado } = req.body;

      if (!nombre_proveedor) {
        return res.status(400).json({ success: false, error: 'El nombre del proveedor es requerido' });
      }

      const estado_final = estado || 'activo';

      const result = await pool.query(
        `INSERT INTO proveedor (nombre_proveedor, telefono, correo, estado)
         VALUES ($1, $2, $3, $4)
         RETURNING id_proveedor, nombre_proveedor, telefono, correo, estado`,
        [nombre_proveedor, telefono || null, correo || null, estado_final]
      );

      res.status(201).json({
        success: true,
        message: 'Proveedor creado exitosamente',
        data: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // ACTUALIZAR un proveedor
  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre_proveedor, telefono, correo, estado } = req.body;

      const current = await pool.query('SELECT * FROM proveedor WHERE id_proveedor = $1', [id]);
      if (current.rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Proveedor no encontrado' });
      }

      const result = await pool.query(
        `UPDATE proveedor
         SET nombre_proveedor = COALESCE($1, nombre_proveedor),
             telefono = $2,
             correo = $3,
             estado = COALESCE($4, estado)
         WHERE id_proveedor = $5
         RETURNING id_proveedor, nombre_proveedor, telefono, correo, estado`,
        [nombre_proveedor, telefono || null, correo || null, estado, id]
      );

      res.json({
        success: true,
        message: 'Proveedor actualizado exitosamente',
        data: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // ELIMINAR (marcar como inactivo) un proveedor
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(
        `UPDATE proveedor SET estado = 'inactivo' WHERE id_proveedor = $1 RETURNING id_proveedor, nombre_proveedor, estado`,
        [id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Proveedor no encontrado' });
      }

      res.json({
        success: true,
        message: 'Proveedor marcado como inactivo',
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

module.exports = proveedoresController;
