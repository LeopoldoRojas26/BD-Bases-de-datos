const express = require('express');
const router = express.Router();
const usuarioRolController = require('../controllers/usuarioRolController');

router.get('/', usuarioRolController.obtenerTodos);
router.get('/:id', usuarioRolController.obtenerPorId);
router.post('/', usuarioRolController.crear);
router.put('/:id', usuarioRolController.actualizar);
router.delete('/:id', usuarioRolController.eliminar);

module.exports = router;
