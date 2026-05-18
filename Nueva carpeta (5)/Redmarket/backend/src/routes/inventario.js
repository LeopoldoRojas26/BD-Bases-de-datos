const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');

router.get('/', inventarioController.obtenerTodo);
router.get('/critico', inventarioController.obtenerCritico);
router.get('/:id', inventarioController.obtenerPorId);
router.post('/', inventarioController.crear);
router.put('/:id', inventarioController.actualizar);
router.delete('/:id', inventarioController.eliminar);

module.exports = router;
