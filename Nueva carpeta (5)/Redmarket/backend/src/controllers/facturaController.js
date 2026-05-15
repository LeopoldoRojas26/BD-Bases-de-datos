const pool = require('../config/database');

const facturaController = {

  obtenerTodos: async (req,res)=>{
    try{
      const result = await pool.query(`
        SELECT f.*, v.total
        FROM factura f
        JOIN venta v ON v.id_venta = f.id_venta
        ORDER BY id_factura
      `);

      res.json({success:true,data:result.rows});
    }catch(error){
      res.status(500).json({success:false,error:error.message});
    }
  },

  obtenerPorId: async (req,res)=>{
    try{
      const {id}=req.params;

      const result = await pool.query(
        'SELECT * FROM factura WHERE id_factura=$1',
        [id]
      );

      if(result.rowCount===0)
        return res.status(404).json({success:false,error:'No encontrado'});

      res.json({success:true,data:result.rows[0]});
    }catch(error){
      res.status(500).json({success:false,error:error.message});
    }
  },

  crear: async (req,res)=>{
    try{
      const {id_venta,total}=req.body;

      const result = await pool.query(`
        INSERT INTO factura(id_venta,total)
        VALUES($1,$2)
        RETURNING *
      `,[id_venta,total]);

      res.status(201).json({success:true,data:result.rows[0]});
    }catch(error){
      res.status(500).json({success:false,error:error.message});
    }
  },

  actualizar: async (req,res)=>{
    try{
      const {id}=req.params;
      const {id_venta,total}=req.body;

      const result = await pool.query(`
        UPDATE factura
        SET id_venta=COALESCE($1,id_venta),
            total=COALESCE($2,total)
        WHERE id_factura=$3
        RETURNING *
      `,[id_venta,total,id]);

      if(result.rowCount===0)
        return res.status(404).json({success:false,error:'No encontrado'});

      res.json({success:true,data:result.rows[0]});
    }catch(error){
      res.status(500).json({success:false,error:error.message});
    }
  },

  eliminar: async (req,res)=>{
    try{
      const {id}=req.params;

      const result = await pool.query(
        'DELETE FROM factura WHERE id_factura=$1 RETURNING *',
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

module.exports = facturaController;