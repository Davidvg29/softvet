const express = require('express');
const {mostrarRoles,mostrarRolesId,crearRol,editarRol,eliminarRol} = require('../controllers/roles');
const { verifyToken } = require('../middlewares/jwt');
const router = express.Router();

router.get('/ver', verifyToken, mostrarRoles);
router.get('/ver/:id', verifyToken, mostrarRolesId);
router.post('/crear', verifyToken, crearRol);
router.put('/editar/:id', verifyToken, editarRol);
router.delete('/eliminar/:id', verifyToken, eliminarRol);
module.exports = router;