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
          p.id_categoria,
          p.descripcion,
          p.codigo_barras,
          cp.nombre AS categoria
        FROM inventario i
        INNER JOIN producto p ON i.id_producto = p.id_producto
        INNER JOIN categoria_producto cp ON p.id_categoria = cp.id_categoria
        WHERE p.activo = TRUE
          AND i.stock_actual <= i.stock_minimo
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
          p.id_categoria,
          p.descripcion,
          p.codigo_barras,
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
        WHERE p.activo = TRUE
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

  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        `SELECT 
          i.*,
          p.nombre AS producto,
          p.precio,
          p.id_categoria,
          p.descripcion,
          p.codigo_barras,
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
        WHERE p.activo = TRUE AND i.id_producto = $1`,
        [id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          error: 'Inventario no encontrado'
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

  crear: async (req, res) => {
    const client = await pool.connect();

    try {
      const {
        id_categoria,
        producto,
        descripcion,
        precio,
        codigo_barras,
        stock_actual,
        stock_minimo,
        stock_maximo
      } = req.body;

      if (!id_categoria || !producto || precio === undefined) {
        return res.status(400).json({
          success: false,
          error: 'Faltan campos requeridos: id_categoria, producto, precio'
        });
      }

      await client.query('BEGIN');

      const productoResult = await client.query(
        `INSERT INTO producto (id_categoria, nombre, descripcion, precio, codigo_barras, activo)
         VALUES ($1, $2, $3, $4, $5, TRUE)
         RETURNING *`,
        [id_categoria, producto, descripcion || null, precio, codigo_barras || null]
      );

      const nuevoProducto = productoResult.rows[0];

      const inventarioResult = await client.query(
        `INSERT INTO inventario (id_producto, stock_actual, stock_minimo, stock_maximo)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [
          nuevoProducto.id_producto,
          stock_actual ?? 0,
          stock_minimo ?? 0,
          stock_maximo ?? 100
        ]
      );

      await client.query('COMMIT');

      res.status(201).json({
        success: true,
        message: 'Inventario creado exitosamente',
        data: {
          ...inventarioResult.rows[0],
          producto: nuevoProducto.nombre,
          precio: nuevoProducto.precio,
          id_categoria: nuevoProducto.id_categoria,
          descripcion: nuevoProducto.descripcion,
          codigo_barras: nuevoProducto.codigo_barras
        }
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
  },

  actualizar: async (req, res) => {
    const client = await pool.connect();

    try {
      const { id } = req.params;
      const {
        id_categoria,
        producto,
        descripcion,
        precio,
        codigo_barras,
        stock_actual,
        stock_minimo,
        stock_maximo
      } = req.body;

      await client.query('BEGIN');

      const productoResult = await client.query(
        `UPDATE producto
         SET id_categoria = COALESCE($1, id_categoria),
             nombre = COALESCE($2, nombre),
             descripcion = COALESCE($3, descripcion),
             precio = COALESCE($4, precio),
             codigo_barras = COALESCE($5, codigo_barras)
         WHERE id_producto = $6 AND activo = TRUE
         RETURNING *`,
        [id_categoria, producto, descripcion, precio, codigo_barras, id]
      );

      if (productoResult.rowCount === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({
          success: false,
          error: 'Producto no encontrado'
        });
      }

      const invUpdate = await client.query(
        `UPDATE inventario
         SET stock_actual = COALESCE($1, stock_actual),
             stock_minimo = COALESCE($2, stock_minimo),
             stock_maximo = COALESCE($3, stock_maximo),
             ultima_actualizacion = CURRENT_TIMESTAMP
         WHERE id_producto = $4
         RETURNING *`,
        [stock_actual, stock_minimo, stock_maximo, id]
      );

      let inventarioRow = invUpdate.rows[0];

      if (invUpdate.rowCount === 0) {
        const invInsert = await client.query(
          `INSERT INTO inventario (id_producto, stock_actual, stock_minimo, stock_maximo)
           VALUES ($1, $2, $3, $4)
           RETURNING *`,
          [id, stock_actual ?? 0, stock_minimo ?? 0, stock_maximo ?? 100]
        );
        inventarioRow = invInsert.rows[0];
      }

      await client.query('COMMIT');

      res.json({
        success: true,
        message: 'Inventario actualizado exitosamente',
        data: {
          ...inventarioRow,
          producto: productoResult.rows[0].nombre,
          precio: productoResult.rows[0].precio,
          id_categoria: productoResult.rows[0].id_categoria,
          descripcion: productoResult.rows[0].descripcion,
          codigo_barras: productoResult.rows[0].codigo_barras
        }
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
  },

  eliminar: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        'UPDATE producto SET activo = FALSE WHERE id_producto = $1 RETURNING *',
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
        message: 'Inventario eliminado (producto desactivado) exitosamente',
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
