const express = require('express');
const router = express.Router();
const sesionesController = require('../controllers/sesionesController');

router.get('/', sesionesController.obtenerTodos);
router.get('/:id', sesionesController.obtenerPorId);
// Ruta para forzar el cierre de sesión desde el panel admin
router.put('/:id/revocar', sesionesController.revocarSesion);

module.exports = router;
