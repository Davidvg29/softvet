const express = require('express');
const {mostrarRoles,mostrarRolesId,crearRol,editarRol,eliminarRol} = require('../controllers/roles');
const router = express.Router();

router.get('/ver', mostrarRoles);
router.get('/ver/:id', mostrarRolesId);
router.post('/crear', crearRol);
router.put('/editar/:id', editarRol);
router.delete('/eliminar/:id', eliminarRol);
module.exports = router;