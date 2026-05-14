const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');

router.get('/', inventarioController.obtenerTodo);
router.get('/critico', inventarioController.obtenerCritico);
router.put('/:id_producto', inventarioController.actualizar);

module.exports = router;
