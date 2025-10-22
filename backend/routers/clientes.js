const express = require('express');
const router = express.Router();
const {
    mostrarClientes,
    mostrarClientePorId,
    crearCliente,
    editarCliente,
    eliminarCliente
} = require('../controllers/clientes');

// Rutas para clientes
router.get('/ver', mostrarClientes);
router.get('/ver/:id', mostrarClientePorId);
router.post('/crear', crearCliente);
router.put('/editar/:id', editarCliente);
router.delete('/eliminar/:id', eliminarCliente);

module.exports = router;