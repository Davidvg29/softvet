const express = require('express');
const router = express.Router();
const {
    mostrarClientes,
    mostrarClientePorId,
    crearCliente,
    editarCliente,
    eliminarCliente,
    buscarClientes
} = require('../controllers/clientes');
const { verifyToken } = require('../middlewares/jwt');

// Rutas para clientes
router.get('/ver', verifyToken, mostrarClientes);
router.get('/ver/:id', verifyToken, mostrarClientePorId);
router.get('/buscar', verifyToken, buscarClientes);
router.post('/crear', verifyToken, crearCliente);
router.put('/editar/:id', verifyToken, editarCliente);
router.delete('/eliminar/:id', verifyToken, eliminarCliente);

module.exports = router;