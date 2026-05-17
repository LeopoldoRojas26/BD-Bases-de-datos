const express = require('express');
const router = express.Router();
const sucursalesController = require('../controllers/sucursalesController');

router.get('/', sucursalesController.obtenerTodos);
router.get('/:id/almacenes', sucursalesController.obtenerAlmacenes);
router.get('/:id', sucursalesController.obtenerPorId);
router.post('/', sucursalesController.crear);
router.put('/:id', sucursalesController.actualizar);
router.patch('/:id/toggle', sucursalesController.toggleActivo);

module.exports = router;