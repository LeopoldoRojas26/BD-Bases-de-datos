const pool = require('../config/database');

const ordenCompraController = {
  // LISTAR todas las órdenes de compra con nombre del proveedor
  obtenerTodos: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT oc.id_orden_compra, oc.id_proveedor, oc.fecha_orden, oc.total_orden,
               oc.estado_orden, oc.fecha_entrega,
               p.nombre_proveedor
        FROM orden_compra oc
        LEFT JOIN proveedor p ON oc.id_proveedor = p.id_proveedor
        ORDER BY oc.id_orden_compra DESC
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

  // OBTENER una orden por ID
  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(`
        SELECT oc.id_orden_compra, oc.id_proveedor, oc.fecha_orden, oc.total_orden,
               oc.estado_orden, oc.fecha_entrega,
               p.nombre_proveedor
        FROM orden_compra oc
        LEFT JOIN proveedor p ON oc.id_proveedor = p.id_proveedor
        WHERE oc.id_orden_compra = $1
      `, [id]);

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          error: 'Orden de compra no encontrada'
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

  // CREAR una orden de compra
  crear: async (req, res) => {
    try {
      const { id_proveedor, fecha_orden, total_orden, estado_orden, fecha_entrega } = req.body;

      if (!id_proveedor || total_orden === undefined) {
        return res.status(400).json({ success: false, error: 'El proveedor y el total son requeridos' });
      }

      const estado_final = estado_orden || 'pendiente';

      const result = await pool.query(
        `INSERT INTO orden_compra (id_proveedor, fecha_orden, total_orden, estado_orden, fecha_entrega)
         VALUES ($1, COALESCE($2, CURRENT_DATE), $3, $4, $5)
         RETURNING id_orden_compra, id_proveedor, fecha_orden, total_orden, estado_orden, fecha_entrega`,
        [id_proveedor, fecha_orden || null, total_orden, estado_final, fecha_entrega || null]
      );

      res.status(201).json({
        success: true,
        message: 'Orden de compra creada exitosamente',
        data: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // ACTUALIZAR una orden de compra
  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { id_proveedor, fecha_orden, total_orden, estado_orden, fecha_entrega } = req.body;

      const current = await pool.query('SELECT * FROM orden_compra WHERE id_orden_compra = $1', [id]);
      if (current.rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Orden de compra no encontrada' });
      }

      const result = await pool.query(
        `UPDATE orden_compra
         SET id_proveedor = COALESCE($1, id_proveedor),
             fecha_orden = COALESCE($2, fecha_orden),
             total_orden = COALESCE($3, total_orden),
             estado_orden = COALESCE($4, estado_orden),
             fecha_entrega = $5
         WHERE id_orden_compra = $6
         RETURNING id_orden_compra, id_proveedor, fecha_orden, total_orden, estado_orden, fecha_entrega`,
        [id_proveedor, fecha_orden, total_orden, estado_orden, fecha_entrega || null, id]
      );

      res.json({
        success: true,
        message: 'Orden de compra actualizada exitosamente',
        data: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // ELIMINAR una orden de compra (cambiar estado a cancelada)
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(
        `UPDATE orden_compra SET estado_orden = 'cancelada' WHERE id_orden_compra = $1 RETURNING id_orden_compra, estado_orden`,
        [id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Orden de compra no encontrada' });
      }

      res.json({
        success: true,
        message: 'Orden de compra cancelada',
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

module.exports = ordenCompraController;
