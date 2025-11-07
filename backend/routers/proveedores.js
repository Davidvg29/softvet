const express = require('express');

const {mostrarProveedores,mostrarProveedoresId,crearProveedor,editarProveedor,eliminarProveedor} = require('../controllers/proveedores');
const { autenticarRoles } = require('../middlewares/autenticarRoles');
const { verifyToken } = require('../middlewares/jwt');

const router = express.Router();

router.get('/ver', mostrarProveedores);   
router.get('/ver/:id', mostrarProveedoresId);
router.post('/crear', autenticarRoles(["Administrador"]), crearProveedor);
router.put('/editar/:id',autenticarRoles(["Administrador"]), editarProveedor);
router.delete('/eliminar/:id',autenticarRoles(["Administrador"]), eliminarProveedor);

module.exports = router;