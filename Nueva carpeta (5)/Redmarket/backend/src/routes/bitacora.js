const express = require('express');
const router = express.Router();
const bitacoraController = require('../controllers/bitacoraController');

router.get('/', bitacoraController.obtenerTodos);
router.get('/:id', bitacoraController.obtenerPorId);

module.exports = router;
