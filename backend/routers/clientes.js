const express = require('express');
const router = express.Router();
const {
    mostrarClientes,
    mostrarClientePorId,
    crearCliente,
    editarCliente,
    eliminarCliente,
    buscarClientes,
    contactarFormLanding
} = require('../controllers/clientes');
const { verifyToken } = require('../middlewares/jwt');

// Rutas para clientes
router.get('/ver', verifyToken, mostrarClientes);
router.get('/ver/:id', verifyToken, mostrarClientePorId);
router.get('/buscar', verifyToken, buscarClientes);
router.post('/crear', verifyToken, crearCliente);
router.put('/editar/:id', verifyToken, editarCliente);
router.delete('/eliminar/:id/:id_empleado', verifyToken, eliminarCliente);
router.post('/contact', contactarFormLanding);

module.exports = router;