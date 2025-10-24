const express = require('express');
const router = express.Router();
const {
    mostrarSucursales,
    mostrarSucursalPorId,
    crearSucursal,
    editarSucursal,
    eliminarSucursal
} = require('../controllers/sucursales');

// Rutas para gestión de sucursales
router.get('/ver', mostrarSucursales);
router.get('/ver/:id', mostrarSucursalPorId);
router.post('/crear', crearSucursal);
router.put('/editar/:id', editarSucursal);
router.delete('/eliminar/:id', eliminarSucursal);

module.exports = router;