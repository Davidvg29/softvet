const express = require('express');
const router = express.Router();
const {
    mostrarCompras,
    mostrarCompraPorId,
    crearCompra,
    editarCompra,
    eliminarCompra
} = require('../controllers/compras');

// Rutas para compras
router.get('/ver', mostrarCompras);
router.get('/ver/:id', mostrarCompraPorId);
router.post('/crear', crearCompra);
router.put('/editar/:id', editarCompra);
router.delete('/eliminar/:id', eliminarCompra);

module.exports = router;