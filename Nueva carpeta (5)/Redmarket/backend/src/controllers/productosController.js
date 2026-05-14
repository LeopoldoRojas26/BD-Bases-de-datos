const pool = require('../config/database');

const productosController = {
  // LISTAR todos los productos con su categoría e inventario
  obtenerTodos: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
          p.id_producto,
          p.nombre,
          p.descripcion,
          p.precio,
          p.codigo_barras,
          p.activo,
          cp.nombre AS categoria,
          i.stock_actual,
          i.stock_minimo,
          i.stock_maximo
        FROM producto p
        INNER JOIN categoria_producto cp ON p.id_categoria = cp.id_categoria
        LEFT JOIN inventario i ON p.id_producto = i.id_producto
        WHERE p.activo = TRUE
        ORDER BY p.id_producto DESC
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

  // OBTENER un producto por ID
  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(`
        SELECT 
          p.*,
          cp.nombre AS categoria,
          i.stock_actual,
          i.stock_minimo,
          i.stock_maximo
        FROM producto p
        INNER JOIN categoria_producto cp ON p.id_categoria = cp.id_categoria
        LEFT JOIN inventario i ON p.id_producto = i.id_producto
        WHERE p.id_producto = $1
      `, [id]);

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

  // CREAR un nuevo producto con inventario inicial
  crear: async (req, res) => {
    const client = await pool.connect();
    
    try {
      const { id_categoria, nombre, descripcion, precio, codigo_barras, stock_actual, stock_minimo, stock_maximo } = req.body;

      if (!id_categoria || !nombre || !precio) {
        return res.status(400).json({
          success: false,
          error: 'Faltan campos requeridos: id_categoria, nombre, precio'
        });
      }

      await client.query('BEGIN');

      // Insertar producto
      const productoResult = await client.query(
        `INSERT INTO producto (id_categoria, nombre, descripcion, precio, codigo_barras, activo)
         VALUES ($1, $2, $3, $4, $5, TRUE)
         RETURNING *`,
        [id_categoria, nombre, descripcion, precio, codigo_barras]
      );

      const producto = productoResult.rows[0];

      // Crear registro de inventario si se proporcionaron datos
      if (stock_actual !== undefined) {
        await client.query(
          `INSERT INTO inventario (id_producto, stock_actual, stock_minimo, stock_maximo)
           VALUES ($1, $2, $3, $4)`,
          [producto.id_producto, stock_actual || 0, stock_minimo || 0, stock_maximo || 100]
        );
      }

      await client.query('COMMIT');

      res.status(201).json({
        success: true,
        message: 'Producto creado exitosamente',
        data: producto
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

  // ACTUALIZAR un producto
  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, descripcion, precio, codigo_barras, activo } = req.body;

      const result = await pool.query(
        `UPDATE producto 
         SET nombre = COALESCE($1, nombre),
             descripcion = COALESCE($2, descripcion),
             precio = COALESCE($3, precio),
             codigo_barras = COALESCE($4, codigo_barras),
             activo = COALESCE($5, activo)
         WHERE id_producto = $6
         RETURNING *`,
        [nombre, descripcion, precio, codigo_barras, activo, id]
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

  // ELIMINAR un producto (soft delete)
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
        message: 'Producto desactivado exitosamente',
        data: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // OBTENER categorías
  obtenerCategorias: async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT * FROM categoria_producto WHERE activo = TRUE ORDER BY nombre'
      );
      
      res.json({
        success: true,
        data: result.rows
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
