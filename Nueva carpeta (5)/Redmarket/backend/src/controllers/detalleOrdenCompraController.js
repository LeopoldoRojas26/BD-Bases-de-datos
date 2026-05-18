const pool = require('../config/database');

const detalleOrdenCompraController = {
  // LISTAR todos los detalles con nombre de orden y producto
  obtenerTodos: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT doc.id_detalle_orden, doc.id_orden_compra, doc.id_producto,
               doc.cantidad, doc.precio_unitario, doc.subtotal,
               p.nombre AS nombre_producto,
               prov.nombre_proveedor
        FROM detalle_orden_compra doc
        LEFT JOIN producto p ON doc.id_producto = p.id_producto
        LEFT JOIN orden_compra oc ON doc.id_orden_compra = oc.id_orden_compra
        LEFT JOIN proveedor prov ON oc.id_proveedor = prov.id_proveedor
        ORDER BY doc.id_detalle_orden DESC
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

  // OBTENER un detalle por ID
  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(`
        SELECT doc.id_detalle_orden, doc.id_orden_compra, doc.id_producto,
               doc.cantidad, doc.precio_unitario, doc.subtotal,
               p.nombre AS nombre_producto
        FROM detalle_orden_compra doc
        LEFT JOIN producto p ON doc.id_producto = p.id_producto
        WHERE doc.id_detalle_orden = $1
      `, [id]);

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          error: 'Detalle de orden no encontrado'
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

  // CREAR un detalle de orden de compra
  crear: async (req, res) => {
    try {
      const { id_orden_compra, id_producto, cantidad, precio_unitario } = req.body;

      if (!id_orden_compra || !id_producto || !cantidad || precio_unitario === undefined) {
        return res.status(400).json({ success: false, error: 'Todos los campos son requeridos: id_orden_compra, id_producto, cantidad, precio_unitario' });
      }

      const subtotal = cantidad * precio_unitario;

      const result = await pool.query(
        `INSERT INTO detalle_orden_compra (id_orden_compra, id_producto, cantidad, precio_unitario, subtotal)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id_detalle_orden, id_orden_compra, id_producto, cantidad, precio_unitario, subtotal`,
        [id_orden_compra, id_producto, cantidad, precio_unitario, subtotal]
      );

      res.status(201).json({
        success: true,
        message: 'Detalle de orden creado exitosamente',
        data: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // ACTUALIZAR un detalle de orden de compra
  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { id_orden_compra, id_producto, cantidad, precio_unitario } = req.body;

      const current = await pool.query('SELECT * FROM detalle_orden_compra WHERE id_detalle_orden = $1', [id]);
      if (current.rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Detalle de orden no encontrado' });
      }

      const cant = cantidad || current.rows[0].cantidad;
      const precio = precio_unitario !== undefined ? precio_unitario : current.rows[0].precio_unitario;
      const subtotal = cant * precio;

      const result = await pool.query(
        `UPDATE detalle_orden_compra
         SET id_orden_compra = COALESCE($1, id_orden_compra),
             id_producto = COALESCE($2, id_producto),
             cantidad = $3,
             precio_unitario = $4,
             subtotal = $5
         WHERE id_detalle_orden = $6
         RETURNING id_detalle_orden, id_orden_compra, id_producto, cantidad, precio_unitario, subtotal`,
        [id_orden_compra, id_producto, cant, precio, subtotal, id]
      );

      res.json({
        success: true,
        message: 'Detalle de orden actualizado exitosamente',
        data: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // ELIMINAR un detalle de orden de compra
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(
        'DELETE FROM detalle_orden_compra WHERE id_detalle_orden = $1 RETURNING id_detalle_orden',
        [id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Detalle de orden no encontrado' });
      }

      res.json({
        success: true,
        message: 'Detalle de orden eliminado exitosamente',
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

module.exports = detalleOrdenCompraController;
