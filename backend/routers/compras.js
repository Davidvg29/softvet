const express = require('express');
const router = express.Router();
const {
    mostrarCompras,
    mostrarCompraPorId,
    crearCompra,
    editarCompra,
    eliminarCompra
} = require('../controllers/compras');
const { verifyToken } = require('../middlewares/jwt');
const { autenticarRoles } = require('../middlewares/autenticarRoles');

// Rutas para compras
router.get('/ver', verifyToken, mostrarCompras);
router.get('/ver/:id', verifyToken, mostrarCompraPorId);
router.post('/crear', verifyToken, autenticarRoles(["Administrador"]), crearCompra);
router.put('/editar/:id', verifyToken, autenticarRoles(["Administrador"]), editarCompra);
router.delete('/eliminar/:id', verifyToken, autenticarRoles(["Administrador"]), eliminarCompra);

module.exports = router;