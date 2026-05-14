const pool = require('../config/database');

const empleadosController = {
  // LISTAR todos los empleados activos
  obtenerTodos: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
          e.id_empleado,
          e.nombre || ' ' || e.apellido_paterno || COALESCE(' ' || e.apellido_materno, '') AS nombre_completo,
          e.nombre,
          e.apellido_paterno,
          e.apellido_materno,
          e.email,
          e.telefono,
          e.fecha_ingreso,
          e.estatus,
          p.nombre_puesto,
          d.nombre_departamento,
          t.nombre_turno
        FROM Empleados e
        INNER JOIN Puestos p ON e.id_puesto = p.id_puesto
        INNER JOIN Departamentos d ON e.id_departamento = d.id_departamento
        INNER JOIN Turnos t ON e.id_turno = t.id_turno
        WHERE e.estatus = 'activo'
        ORDER BY e.id_empleado DESC
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

  // OBTENER un empleado por ID
  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(`
        SELECT 
          e.*,
          p.nombre_puesto,
          p.salario_base,
          d.nombre_departamento,
          t.nombre_turno,
          t.hora_inicio,
          t.hora_fin
        FROM Empleados e
        INNER JOIN Puestos p ON e.id_puesto = p.id_puesto
        INNER JOIN Departamentos d ON e.id_departamento = d.id_departamento
        INNER JOIN Turnos t ON e.id_turno = t.id_turno
        WHERE e.id_empleado = $1
      `, [id]);

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          error: 'Empleado no encontrado'
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

  // CREAR un nuevo empleado
  crear: async (req, res) => {
    try {
      const {
        nombre,
        apellido_paterno,
        apellido_materno,
        fecha_nacimiento,
        sexo,
        curp,
        rfc,
        email,
        telefono,
        id_puesto,
        id_departamento,
        id_turno,
        fecha_ingreso
      } = req.body;

      if (!nombre || !apellido_paterno || !curp || !rfc || !email || !id_puesto || !id_departamento || !id_turno) {
        return res.status(400).json({
          success: false,
          error: 'Faltan campos requeridos'
        });
      }

      const result = await pool.query(
        `INSERT INTO Empleados (
          nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo,
          curp, rfc, email, telefono,
          id_puesto, id_departamento, id_turno, fecha_ingreso, estatus
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'activo')
        RETURNING *`,
        [nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo,
         curp, rfc, email, telefono, id_puesto, id_departamento, id_turno,
         fecha_ingreso || new Date()]
      );

      res.status(201).json({
        success: true,
        message: 'Empleado creado exitosamente',
        data: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // ACTUALIZAR un empleado
  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        nombre,
        apellido_paterno,
        apellido_materno,
        email,
        telefono,
        id_puesto,
        id_departamento,
        id_turno,
        estatus
      } = req.body;

      const result = await pool.query(
        `UPDATE Empleados
         SET nombre = COALESCE($1, nombre),
             apellido_paterno = COALESCE($2, apellido_paterno),
             apellido_materno = COALESCE($3, apellido_materno),
             email = COALESCE($4, email),
             telefono = COALESCE($5, telefono),
             id_puesto = COALESCE($6, id_puesto),
             id_departamento = COALESCE($7, id_departamento),
             id_turno = COALESCE($8, id_turno),
             estatus = COALESCE($9, estatus)
         WHERE id_empleado = $10
         RETURNING *`,
        [nombre, apellido_paterno, apellido_materno, email, telefono,
         id_puesto, id_departamento, id_turno, estatus, id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          error: 'Empleado no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Empleado actualizado exitosamente',
        data: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // ELIMINAR (dar de baja) un empleado
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        `UPDATE Empleados SET estatus = 'baja' WHERE id_empleado = $1 RETURNING *`,
        [id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          error: 'Empleado no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Empleado dado de baja',
        data: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // OBTENER catálogos (puestos, departamentos, turnos)
  obtenerCatalogos: async (req, res) => {
    try {
      const [puestosRes, deptosRes, turnosRes] = await Promise.all([
        pool.query('SELECT * FROM Puestos ORDER BY nombre_puesto'),
        pool.query('SELECT * FROM Departamentos ORDER BY nombre_departamento'),
        pool.query('SELECT * FROM Turnos ORDER BY nombre_turno')
      ]);

      res.json({
        success: true,
        data: {
          puestos: puestosRes.rows,
          departamentos: deptosRes.rows,
          turnos: turnosRes.rows
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = empleadosController;
