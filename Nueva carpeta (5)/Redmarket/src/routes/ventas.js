const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventasController');

router.get('/', ventasController.obtenerTodas);
router.get('/:id', ventasController.obtenerPorId);
router.post('/', ventasController.crear);
router.delete('/:id', ventasController.eliminar);

module.exports = router;
