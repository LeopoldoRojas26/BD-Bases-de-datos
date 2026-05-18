const pool = require('../config/database');
const crypto = require('crypto');

const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

const usuariosController = {
  obtenerTodos: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT u.id_usuario, u.id_empleado, u.username, u.email, u.estatus, u.fecha_creacion, u.ultimo_acceso,
               e.nombre || ' ' || e.apellido_paterno AS empleado_nombre
        FROM usuarios u
        LEFT JOIN empleados e ON u.id_empleado = e.id_empleado
        ORDER BY u.id_usuario DESC
      `);
      res.json({ success: true, data: result.rows, count: result.rowCount });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(`
        SELECT u.id_usuario, u.id_empleado, u.username, u.email, u.estatus, u.fecha_creacion, u.ultimo_acceso,
               e.nombre || ' ' || e.apellido_paterno AS empleado_nombre
        FROM usuarios u
        LEFT JOIN empleados e ON u.id_empleado = e.id_empleado
        WHERE u.id_usuario = $1
      `, [id]);
      
      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
      }
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  crear: async (req, res) => {
    try {
      const { id_empleado, username, password, email, estatus } = req.body;

      if (!username || !password || !email) {
        return res.status(400).json({ success: false, error: 'Faltan campos requeridos' });
      }

      const password_hash = hashPassword(password);
      const estatus_final = estatus || 'activo';
      
      const empleado_valido = id_empleado ? id_empleado : null;

      const result = await pool.query(
        `INSERT INTO usuarios (id_empleado, username, password_hash, email, estatus)
         VALUES ($1, $2, $3, $4, $5) RETURNING id_usuario, id_empleado, username, email, estatus, fecha_creacion`,
        [empleado_valido, username, password_hash, email, estatus_final]
      );

      res.status(201).json({ success: true, message: 'Usuario creado', data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { id_empleado, username, password, email, estatus } = req.body;

      const current = await pool.query('SELECT * FROM usuarios WHERE id_usuario = $1', [id]);
      if (current.rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
      }

      let password_hash = current.rows[0].password_hash;
      if (password && password.trim() !== '') {
        password_hash = hashPassword(password);
      }
      
      const empleado_valido = id_empleado ? id_empleado : null;

      const result = await pool.query(
        `UPDATE usuarios
         SET id_empleado = COALESCE($1, id_empleado),
             username = COALESCE($2, username),
             password_hash = $3,
             email = COALESCE($4, email),
             estatus = COALESCE($5, estatus)
         WHERE id_usuario = $6
         RETURNING id_usuario, id_empleado, username, email, estatus`,
        [empleado_valido, username, password_hash, email, estatus, id]
      );

      res.json({ success: true, message: 'Usuario actualizado', data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(
        `UPDATE usuarios SET estatus = 'inactivo' WHERE id_usuario = $1 RETURNING id_usuario, username, estatus`,
        [id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
      }

      res.json({ success: true, message: 'Usuario marcado como inactivo', data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = usuariosController;
