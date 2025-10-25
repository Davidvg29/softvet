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

// Rutas para empleados
router.get('/ver', mostrarEmpleados);
router.get('/ver/:id', mostrarEmpleadoPorId);
router.post('/crear', crearEmpleado);
router.put('/editar/:id', editarEmpleado);
router.delete('/eliminar/:id', eliminarEmpleado);
router.post('/autenticar', autenticarEmpleado);

module.exports = router;