const express = require('express');
const router = express.Router();
const {
    mostrarEmpleados,
    mostrarEmpleadoPorId,
    crearEmpleado,
    editarEmpleado,
    eliminarEmpleado,
    autenticarEmpleado,
    obtenerInfoEmpleadoAutenticado,
    logout,
    mailRestablecerContraseña,
    restablecerContraseña,
    activarEmpleado
} = require('../controllers/empleados');
const { verifyToken } = require('../middlewares/jwt');
const { autenticarRoles } = require('../middlewares/autenticarRoles');
const { route } = require('./productos');

// Rutas para empleados
router.get('/ver',verifyToken, mostrarEmpleados);
router.get('/ver/:id',verifyToken, mostrarEmpleadoPorId);
router.post('/crear',verifyToken, autenticarRoles(["Administrador"]), crearEmpleado);
router.put('/editar/:id',verifyToken, autenticarRoles(["Administrador"]), editarEmpleado);
router.delete('/eliminar/:id',verifyToken, autenticarRoles(["Administrador"]), eliminarEmpleado);
router.put('/activar/:id',verifyToken, autenticarRoles(["Administrador"]), activarEmpleado);
router.post('/autenticar', autenticarEmpleado);
router.post('/info', verifyToken, obtenerInfoEmpleadoAutenticado);
router.get('/logout', logout)
router.get('/password/restablecer/:email', mailRestablecerContraseña)
router.post('/password/restablecer/', restablecerContraseña)

module.exports = router;