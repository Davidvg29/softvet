const express = require('express');
const router = express.Router();
const {
    mostrarEmpleados,
    mostrarEmpleadoPorId,
    crearEmpleado,
    editarEmpleado,
    eliminarEmpleado,
    autenticarEmpleado
} = require('../controllers/empleados');
const { verifyToken } = require('../middlewares/jwt');

// Rutas para empleados
router.get('/ver',verifyToken, mostrarEmpleados);
router.get('/ver/:id',verifyToken, mostrarEmpleadoPorId);
router.post('/crear',verifyToken, crearEmpleado);
router.put('/editar/:id',verifyToken, editarEmpleado);
router.delete('/eliminar/:id',verifyToken, eliminarEmpleado);
router.post('/autenticar', autenticarEmpleado);

module.exports = router;