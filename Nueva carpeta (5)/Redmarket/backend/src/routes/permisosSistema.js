const express = require('express');
const router = express.Router();
const permisosSistemaController = require('../controllers/permisosSistemaController');

router.get('/', permisosSistemaController.obtenerTodos);
router.get('/:id', permisosSistemaController.obtenerPorId);
router.post('/', permisosSistemaController.crear);
router.put('/:id', permisosSistemaController.actualizar);
router.delete('/:id', permisosSistemaController.eliminar);

module.exports = router;
