const express = require('express');
const router = express.Router();
const empleadosController = require('../controllers/empleadosController');

router.get('/', empleadosController.obtenerTodos);
router.get('/catalogos', empleadosController.obtenerCatalogos);
router.get('/:id', empleadosController.obtenerPorId);
router.post('/', empleadosController.crear);
router.put('/:id', empleadosController.actualizar);
router.delete('/:id', empleadosController.eliminar);

module.exports = router;
