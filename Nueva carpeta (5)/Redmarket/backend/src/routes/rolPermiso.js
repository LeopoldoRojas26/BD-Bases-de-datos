const express = require('express');
const router = express.Router();
const rolPermisoController = require('../controllers/rolPermisoController');

router.get('/', rolPermisoController.obtenerTodos);
router.get('/:id', rolPermisoController.obtenerPorId);
router.post('/', rolPermisoController.crear);
router.put('/:id', rolPermisoController.actualizar);
router.delete('/:id', rolPermisoController.eliminar);

module.exports = router;
