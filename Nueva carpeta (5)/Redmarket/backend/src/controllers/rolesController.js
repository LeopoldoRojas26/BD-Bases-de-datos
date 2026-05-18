const pool = require('../config/database');

const rolesController = {
  obtenerTodos: async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM roles ORDER BY id_rol DESC');
      res.json({ success: true, data: result.rows, count: result.rowCount });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM roles WHERE id_rol = $1', [id]);
      
      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Rol no encontrado' });
      }
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  crear: async (req, res) => {
    try {
      const { nombre_rol, descripcion } = req.body;

      if (!nombre_rol) {
        return res.status(400).json({ success: false, error: 'El nombre del rol es requerido' });
      }

      const result = await pool.query(
        `INSERT INTO roles (nombre_rol, descripcion)
         VALUES ($1, $2) RETURNING *`,
        [nombre_rol, descripcion || null]
      );

      res.status(201).json({ success: true, message: 'Rol creado', data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre_rol, descripcion } = req.body;

      const result = await pool.query(
        `UPDATE roles
         SET nombre_rol = COALESCE($1, nombre_rol),
             descripcion = $2
         WHERE id_rol = $3
         RETURNING *`,
        [nombre_rol, descripcion || null, id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Rol no encontrado' });
      }

      res.json({ success: true, message: 'Rol actualizado', data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      // Nota: En la tabla de roles no hay columna 'estatus', por lo que haremos un DELETE real.
      // Si la tabla de roles está ligada a usuario_rol, podría fallar por llave foránea.
      const result = await pool.query('DELETE FROM roles WHERE id_rol = $1 RETURNING *', [id]);

      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Rol no encontrado' });
      }

      res.json({ success: true, message: 'Rol eliminado', data: result.rows[0] });
    } catch (error) {
      // Manejar error de llave foránea amigablemente
      if (error.code === '23503') {
        return res.status(400).json({ 
          success: false, 
          error: 'No se puede eliminar el rol porque está siendo utilizado por uno o más usuarios.' 
        });
      }
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = rolesController;
