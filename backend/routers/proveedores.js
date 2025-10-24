const express = require('express');

const {mostrarProveedores,mostrarProveedoresId,crearProveedor,editarProveedor,eliminarProveedor} = require('../controllers/proveedores');


const router = express.Router();

router.get('/ver', mostrarProveedores);   
router.get('/ver/:id', mostrarProveedoresId);
router.post('/crear', crearProveedor);
router.put('/editar/:id', editarProveedor);
router.delete('/eliminar/:id', eliminarProveedor);

module.exports = router;