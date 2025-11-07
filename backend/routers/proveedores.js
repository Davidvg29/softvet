const express = require('express');

const {mostrarProveedores,mostrarProveedoresId,crearProveedor,editarProveedor,eliminarProveedor} = require('../controllers/proveedores');
const { autenticarRoles } = require('../middlewares/autenticarRoles');
const { verifyToken } = require('../middlewares/jwt');

const router = express.Router();

router.get('/ver', mostrarProveedores);   
router.get('/ver/:id', mostrarProveedoresId);
router.post('/crear',verifyToken, autenticarRoles(["Administrador"]), crearProveedor);
router.put('/editar/:id',verifyToken, autenticarRoles(["Administrador"]), editarProveedor);
router.delete('/eliminar/:id', verifyToken, autenticarRoles(["Administrador"]), eliminarProveedor);

module.exports = router;