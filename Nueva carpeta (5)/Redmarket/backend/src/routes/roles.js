const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/rolesController');

router.get('/', rolesController.obtenerTodos);
router.get('/:id', rolesController.obtenerPorId);
router.post('/', rolesController.crear);
router.put('/:id', rolesController.actualizar);
router.delete('/:id', rolesController.eliminar);

module.exports = router;
