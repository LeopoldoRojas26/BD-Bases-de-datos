const pool = require('../config/database');

const ventasController = {
  // LISTAR todas las ventas
  obtenerTodas: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
          v.id_venta,
          v.fecha,
          v.total,
          c.nombre AS cliente,
          e.nombre || ' ' || e.apellido_paterno AS empleado
        FROM venta v
        INNER JOIN cliente c ON v.id_cliente = c.id_cliente
        INNER JOIN Empleados e ON v.id_empleado = e.id_empleado
        ORDER BY v.fecha DESC
        LIMIT 100
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

  // OBTENER una venta con detalle
  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;

      // Obtener venta principal
      const ventaResult = await pool.query(`
        SELECT 
          v.*,
          c.nombre AS cliente,
          c.correo AS cliente_correo,
          e.nombre || ' ' || e.apellido_paterno AS empleado
        FROM venta v
        INNER JOIN cliente c ON v.id_cliente = c.id_cliente
        INNER JOIN Empleados e ON v.id_empleado = e.id_empleado
        WHERE v.id_venta = $1
      `, [id]);

      if (ventaResult.rowCount === 0) {
        return res.status(404).json({
          success: false,
          error: 'Venta no encontrada'
        });
      }

      // Obtener detalle de productos
      const detalleResult = await pool.query(`
        SELECT 
          dv.*,
          p.nombre AS producto_nombre,
          p.codigo_barras
        FROM detalle_venta dv
        INNER JOIN producto p ON dv.id_producto = p.id_producto
        WHERE dv.id_venta = $1
      `, [id]);

      const venta = ventaResult.rows[0];
      venta.detalle = detalleResult.rows;

      res.json({
        success: true,
        data: venta
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // CREAR una nueva venta (dispara triggers)
  crear: async (req, res) => {
    const client = await pool.connect();

    try {
      const { id_cliente, id_empleado, productos } = req.body;

      if (!id_cliente || !id_empleado || !productos || productos.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Faltan campos requeridos: id_cliente, id_empleado, productos[]'
        });
      }

      await client.query('BEGIN');

      // Calcular total
      let total = 0;
      for (const item of productos) {
        const precioResult = await client.query(
          'SELECT precio FROM producto WHERE id_producto = $1',
          [item.id_producto]
        );
        
        if (precioResult.rowCount === 0) {
          throw new Error(`Producto ${item.id_producto} no encontrado`);
        }

        total += precioResult.rows[0].precio * item.cantidad;
      }

      // Crear venta
      const ventaResult = await client.query(
        `INSERT INTO venta (fecha, total, id_cliente, id_empleado)
         VALUES (CURRENT_TIMESTAMP, $1, $2, $3)
         RETURNING *`,
        [total, id_cliente, id_empleado]
      );

      const venta = ventaResult.rows[0];

      // Insertar detalle de venta (dispara triggers)
      for (const item of productos) {
        const precioResult = await client.query(
          'SELECT precio FROM producto WHERE id_producto = $1',
          [item.id_producto]
        );

        await client.query(
          `INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario)
           VALUES ($1, $2, $3, $4)`,
          [venta.id_venta, item.id_producto, item.cantidad, precioResult.rows[0].precio]
        );

        // Actualizar inventario (descontar stock)
        const updateResult = await client.query(
          `UPDATE inventario 
           SET stock_actual = stock_actual - $1,
               ultima_actualizacion = CURRENT_TIMESTAMP
           WHERE id_producto = $2
           RETURNING stock_actual, stock_minimo`,
          [item.cantidad, item.id_producto]
        );

        if (updateResult.rowCount === 0) {
          throw new Error(`No existe inventario para producto ${item.id_producto}`);
        }

        const { stock_actual, stock_minimo } = updateResult.rows[0];

        // Validar stock negativo
        if (stock_actual < 0) {
          throw new Error(`Stock insuficiente para producto ${item.id_producto}. Stock negativo: ${stock_actual}`);
        }

        // Advertencia si stock bajo
        if (stock_actual < stock_minimo) {
          console.warn(`⚠️  ALERTA: Producto ${item.id_producto} tiene stock bajo (${stock_actual} < ${stock_minimo})`);
        }
      }

      await client.query('COMMIT');

      res.status(201).json({
        success: true,
        message: 'Venta registrada exitosamente. Stock actualizado automáticamente.',
        data: venta
      });

    } catch (error) {
      await client.query('ROLLBACK');

      res.status(400).json({
        success: false,
        error: error.message,
        info: 'La transacción fue cancelada. No se realizaron cambios.'
      });
    } finally {
      client.release();
    }
  },

  // ACTUALIZAR una venta
  actualizar: async (req, res) => {
    const client = await pool.connect();

    try {
      const { id } = req.params;
      const { id_cliente, id_empleado, productos } = req.body;

      if (!id_cliente || !id_empleado || !productos || productos.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Faltan campos requeridos: id_cliente, id_empleado, productos[]'
        });
      }

      await client.query('BEGIN');

      // 1. Obtener detalles antiguos para restaurar inventario
      const oldDetallesResult = await client.query(
        'SELECT id_producto, cantidad FROM detalle_venta WHERE id_venta = $1',
        [id]
      );

      // Restaurar inventario antiguo
      for (const item of oldDetallesResult.rows) {
        await client.query(
          `UPDATE inventario 
           SET stock_actual = stock_actual + $1,
               ultima_actualizacion = CURRENT_TIMESTAMP
           WHERE id_producto = $2`,
          [item.cantidad, item.id_producto]
        );
      }

      // Eliminar detalles antiguos
      await client.query('DELETE FROM detalle_venta WHERE id_venta = $1', [id]);

      // 2. Calcular nuevo total
      let total = 0;
      for (const item of productos) {
        const precioResult = await client.query(
          'SELECT precio FROM producto WHERE id_producto = $1',
          [item.id_producto]
        );
        
        if (precioResult.rowCount === 0) {
          throw new Error(`Producto ${item.id_producto} no encontrado`);
        }

        total += precioResult.rows[0].precio * item.cantidad;
      }

      // 3. Actualizar la cabecera de la venta
      const updateVentaResult = await client.query(
        `UPDATE venta 
         SET id_cliente = $1, id_empleado = $2, total = $3
         WHERE id_venta = $4 RETURNING *`,
        [id_cliente, id_empleado, total, id]
      );

      if (updateVentaResult.rowCount === 0) {
        throw new Error('Venta no encontrada');
      }

      const venta = updateVentaResult.rows[0];

      // 4. Insertar nuevos detalles y descontar inventario
      for (const item of productos) {
        const precioResult = await client.query(
          'SELECT precio FROM producto WHERE id_producto = $1',
          [item.id_producto]
        );

        await client.query(
          `INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario)
           VALUES ($1, $2, $3, $4)`,
          [id, item.id_producto, item.cantidad, precioResult.rows[0].precio]
        );

        const updateResult = await client.query(
          `UPDATE inventario 
           SET stock_actual = stock_actual - $1,
               ultima_actualizacion = CURRENT_TIMESTAMP
           WHERE id_producto = $2
           RETURNING stock_actual, stock_minimo`,
          [item.cantidad, item.id_producto]
        );

        if (updateResult.rowCount === 0) {
          throw new Error(`No existe inventario para producto ${item.id_producto}`);
        }

        const { stock_actual, stock_minimo } = updateResult.rows[0];

        if (stock_actual < 0) {
          throw new Error(`Stock insuficiente para producto ${item.id_producto}. Stock negativo: ${stock_actual}`);
        }
      }

      await client.query('COMMIT');

      res.json({
        success: true,
        message: 'Venta actualizada exitosamente e inventario ajustado.',
        data: venta
      });

    } catch (error) {
      await client.query('ROLLBACK');
      res.status(400).json({
        success: false,
        error: error.message
      });
    } finally {
      client.release();
    }
  },

  // ELIMINAR una venta
  eliminar: async (req, res) => {
    const client = await pool.connect();

    try {
      const { id } = req.params;

      await client.query('BEGIN');

      // Obtener detalle para restaurar inventario
      const detalleResult = await client.query(
        'SELECT id_producto, cantidad FROM detalle_venta WHERE id_venta = $1',
        [id]
      );

      // Restaurar inventario
      for (const item of detalleResult.rows) {
        await client.query(
          `UPDATE inventario 
           SET stock_actual = stock_actual + $1,
               ultima_actualizacion = CURRENT_TIMESTAMP
           WHERE id_producto = $2`,
          [item.cantidad, item.id_producto]
        );
      }

      // Eliminar devoluciones asociadas para evitar el error de Foreign Key Constraint
      await client.query('DELETE FROM devolucion WHERE id_venta = $1', [id]);

      // Eliminar venta (CASCADE elimina detalles)
      const result = await client.query(
        'DELETE FROM venta WHERE id_venta = $1 RETURNING *',
        [id]
      );

      if (result.rowCount === 0) {
        throw new Error('Venta no encontrada');
      }

      await client.query('COMMIT');

      res.json({
        success: true,
        message: 'Venta eliminada e inventario restaurado',
        data: result.rows[0]
      });

    } catch (error) {
      await client.query('ROLLBACK');
      res.status(500).json({
        success: false,
        error: error.message
      });
    } finally {
      client.release();
    }
  }
};

module.exports = ventasController;
