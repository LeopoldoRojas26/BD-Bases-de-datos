const express = require('express');
const router = express.Router();
const detalleOrdenCompraController = require('../controllers/detalleOrdenCompraController');

router.get('/', detalleOrdenCompraController.obtenerTodos);
router.get('/:id', detalleOrdenCompraController.obtenerPorId);
router.post('/', detalleOrdenCompraController.crear);
router.put('/:id', detalleOrdenCompraController.actualizar);
router.delete('/:id', detalleOrdenCompraController.eliminar);

module.exports = router;
