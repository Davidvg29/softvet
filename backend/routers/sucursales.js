const express = require('express');
const router = express.Router();
const {
    mostrarSucursales,
    mostrarSucursalPorId,
    crearSucursal,
    editarSucursal,
    eliminarSucursal
} = require('../controllers/sucursales');
const { verifyToken } = require('../middlewares/jwt');
const { autenticarRoles } = require('../middlewares/autenticarRoles');

// Rutas para gestión de sucursales
router.get('/ver', verifyToken, mostrarSucursales);
router.get('/ver/:id', verifyToken, mostrarSucursalPorId);
router.post('/crear', verifyToken, autenticarRoles(["Administrador"]), crearSucursal);
router.put('/editar/:id', verifyToken, autenticarRoles(["Administrador"]), editarSucursal);
router.delete('/eliminar/:id', verifyToken, autenticarRoles(["Administrador"]), eliminarSucursal);

module.exports = router;