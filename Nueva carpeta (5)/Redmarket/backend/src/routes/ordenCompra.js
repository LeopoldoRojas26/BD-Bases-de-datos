const express = require('express');
const router = express.Router();
const ordenCompraController = require('../controllers/ordenCompraController');

router.get('/', ordenCompraController.obtenerTodos);
router.get('/:id', ordenCompraController.obtenerPorId);
router.post('/', ordenCompraController.crear);
router.put('/:id', ordenCompraController.actualizar);
router.delete('/:id', ordenCompraController.eliminar);

module.exports = router;
