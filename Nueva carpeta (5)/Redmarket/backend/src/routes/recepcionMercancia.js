const express = require('express');
const router = express.Router();
const recepcionMercanciaController = require('../controllers/recepcionMercanciaController');

router.get('/', recepcionMercanciaController.obtenerTodos);
router.get('/:id', recepcionMercanciaController.obtenerPorId);
router.post('/', recepcionMercanciaController.crear);
router.put('/:id', recepcionMercanciaController.actualizar);
router.delete('/:id', recepcionMercanciaController.eliminar);

module.exports = router;
