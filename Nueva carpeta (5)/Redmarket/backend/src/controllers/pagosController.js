const pool = require('../config/database');

const pagosController = {

  obtenerTodos: async (req,res)=>{
    try{
      const result = await pool.query(`
        SELECT p.*, v.total AS total_venta, mp.nombre AS metodo
        FROM pago p
        JOIN venta v ON v.id_venta = p.id_venta
        JOIN metodo_pago mp ON mp.id_metodo_pago = p.id_metodo_pago
        ORDER BY id_pago
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
        'SELECT * FROM pago WHERE id_pago=$1',[id]
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
      const {id_venta,id_metodo_pago,monto,fecha_pago}=req.body;
      const fechaToInsert = fecha_pago ? fecha_pago : new Date();

      const result = await pool.query(`
        INSERT INTO pago(id_venta,id_metodo_pago,monto,fecha_pago)
        VALUES($1,$2,$3,$4) RETURNING *
      `,[id_venta,id_metodo_pago,monto,fechaToInsert]);

      res.status(201).json({success:true,data:result.rows[0]});
    }catch(error){
      res.status(500).json({success:false,error:error.message});
    }
  },

  actualizar: async (req,res)=>{
    try{
      const {id}=req.params;
      const {id_venta,id_metodo_pago,monto,fecha_pago}=req.body;

      const result = await pool.query(`
        UPDATE pago
        SET id_venta=COALESCE($1,id_venta),
            id_metodo_pago=COALESCE($2,id_metodo_pago),
            monto=COALESCE($3,monto),
            fecha_pago=COALESCE($4,fecha_pago)
        WHERE id_pago=$5
        RETURNING *
      `,[id_venta,id_metodo_pago,monto,fecha_pago,id]);

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
        'DELETE FROM pago WHERE id_pago=$1 RETURNING *',[id]
      );

      if(result.rowCount===0)
        return res.status(404).json({success:false,error:'No encontrado'});

      res.json({success:true,data:result.rows[0]});
    }catch(error){
      res.status(500).json({success:false,error:error.message});
    }
  }
};

module.exports = pagosController;