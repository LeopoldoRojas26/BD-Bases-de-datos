const express = require('express');
const router = express.Router();
const auditoriaController = require('../controllers/auditoriaController');

router.get('/', auditoriaController.obtenerHistorial);
router.get('/producto/:producto_id', auditoriaController.obtenerPorProducto);

module.exports = router;
