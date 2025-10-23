const express = require('express');
const router = express.Router();
const { verStock, crearStock, editarStock, eliminarStock } = require('../controllers/stock');

router.get('/ver', verStock);
router.post('/crear', crearStock);
router.put('/editar/:id_stock', editarStock);
router.delete('/borrar/:id_stock', eliminarStock)

module.exports = router;