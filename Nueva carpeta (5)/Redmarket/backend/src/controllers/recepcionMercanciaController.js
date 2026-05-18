const pool = require('../config/database');

const recepcionMercanciaController = {
  // LISTAR todas las recepciones con nombre del proveedor
  obtenerTodos: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT rm.id_recepcion, rm.id_orden_compra, rm.fecha_recepcion,
               rm.recibido_por, rm.estado_recepcion, rm.observaciones,
               p.nombre_proveedor
        FROM recepcion_mercancia rm
        LEFT JOIN orden_compra oc ON rm.id_orden_compra = oc.id_orden_compra
        LEFT JOIN proveedor p ON oc.id_proveedor = p.id_proveedor
        ORDER BY rm.id_recepcion DESC
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

  // OBTENER una recepción por ID
  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(`
        SELECT rm.id_recepcion, rm.id_orden_compra, rm.fecha_recepcion,
               rm.recibido_por, rm.estado_recepcion, rm.observaciones,
               p.nombre_proveedor
        FROM recepcion_mercancia rm
        LEFT JOIN orden_compra oc ON rm.id_orden_compra = oc.id_orden_compra
        LEFT JOIN proveedor p ON oc.id_proveedor = p.id_proveedor
        WHERE rm.id_recepcion = $1
      `, [id]);

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          error: 'Recepción no encontrada'
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

  // CREAR una recepción de mercancía
  crear: async (req, res) => {
    try {
      const { id_orden_compra, fecha_recepcion, recibido_por, estado_recepcion, observaciones } = req.body;

      if (!id_orden_compra || !recibido_por) {
        return res.status(400).json({ success: false, error: 'La orden de compra y recibido_por son requeridos' });
      }

      const estado_final = estado_recepcion || 'completa';

      const result = await pool.query(
        `INSERT INTO recepcion_mercancia (id_orden_compra, fecha_recepcion, recibido_por, estado_recepcion, observaciones)
         VALUES ($1, COALESCE($2, CURRENT_TIMESTAMP), $3, $4, $5)
         RETURNING id_recepcion, id_orden_compra, fecha_recepcion, recibido_por, estado_recepcion, observaciones`,
        [id_orden_compra, fecha_recepcion || null, recibido_por, estado_final, observaciones || null]
      );

      res.status(201).json({
        success: true,
        message: 'Recepción de mercancía creada exitosamente',
        data: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // ACTUALIZAR una recepción de mercancía
  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { id_orden_compra, fecha_recepcion, recibido_por, estado_recepcion, observaciones } = req.body;

      const current = await pool.query('SELECT * FROM recepcion_mercancia WHERE id_recepcion = $1', [id]);
      if (current.rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Recepción no encontrada' });
      }

      const result = await pool.query(
        `UPDATE recepcion_mercancia
         SET id_orden_compra = COALESCE($1, id_orden_compra),
             fecha_recepcion = COALESCE($2, fecha_recepcion),
             recibido_por = COALESCE($3, recibido_por),
             estado_recepcion = COALESCE($4, estado_recepcion),
             observaciones = $5
         WHERE id_recepcion = $6
         RETURNING id_recepcion, id_orden_compra, fecha_recepcion, recibido_por, estado_recepcion, observaciones`,
        [id_orden_compra, fecha_recepcion || null, recibido_por, estado_recepcion, observaciones !== undefined ? observaciones : current.rows[0].observaciones, id]
      );

      res.json({
        success: true,
        message: 'Recepción actualizada exitosamente',
        data: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // ELIMINAR una recepción de mercancía
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(
        'DELETE FROM recepcion_mercancia WHERE id_recepcion = $1 RETURNING id_recepcion',
        [id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Recepción no encontrada' });
      }

      res.json({
        success: true,
        message: 'Recepción eliminada exitosamente',
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

module.exports = recepcionMercanciaController;
