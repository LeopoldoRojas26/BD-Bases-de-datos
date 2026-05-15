const pool = require('../config/database');

const metodosPagoController = {

  // LISTAR
  obtenerTodos: async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT * FROM metodo_pago ORDER BY id_metodo_pago'
      );

      res.json({
        success: true,
        data: result.rows,
        count: result.rowCount
      });
    } catch (error) {
      res.status(500).json({ success:false, error:error.message });
    }
  },

  // OBTENER POR ID
  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        'SELECT * FROM metodo_pago WHERE id_metodo_pago=$1',
        [id]
      );

      if(result.rowCount===0)
        return res.status(404).json({success:false,error:'No encontrado'});

      res.json({ success:true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success:false,error:error.message });
    }
  },

  // CREAR
  crear: async (req,res)=>{
    try{
      const {nombre,descripcion}=req.body;

      const result = await pool.query(
        `INSERT INTO metodo_pago(nombre,descripcion)
         VALUES($1,$2) RETURNING *`,
        [nombre,descripcion]
      );

      res.status(201).json({success:true,data:result.rows[0]});
    }catch(error){
      res.status(500).json({success:false,error:error.message});
    }
  },

  // ACTUALIZAR
  actualizar: async (req,res)=>{
    try{
      const {id}=req.params;
      const {nombre,descripcion}=req.body;

      const result = await pool.query(
        `UPDATE metodo_pago
         SET nombre=COALESCE($1,nombre),
             descripcion=COALESCE($2,descripcion)
         WHERE id_metodo_pago=$3
         RETURNING *`,
        [nombre,descripcion,id]
      );

      if(result.rowCount===0)
        return res.status(404).json({success:false,error:'No encontrado'});

      res.json({success:true,data:result.rows[0]});
    }catch(error){
      res.status(500).json({success:false,error:error.message});
    }
  },

  // ELIMINAR
  eliminar: async (req,res)=>{
    try{
      const {id}=req.params;

      const result = await pool.query(
        'DELETE FROM metodo_pago WHERE id_metodo_pago=$1 RETURNING *',
        [id]
      );

      if(result.rowCount===0)
        return res.status(404).json({success:false,error:'No encontrado'});

      res.json({success:true,data:result.rows[0]});
    }catch(error){
      res.status(500).json({success:false,error:error.message});
    }
  }
};

module.exports = metodosPagoController;