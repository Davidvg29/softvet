const express = require('express');
const { mostrarProductos,mostrarProductoPorId,crearProducto,editarProducto,eliminarProducto } = require('../controllers/productos');


const router = express.Router();


router.get('/ver', mostrarProductos);
router.get('/ver/:id', mostrarProductoPorId);
router.post('/crear', crearProducto);
router.put('/editar/:id', editarProducto);
router.delete('/eliminar/:id', eliminarProducto);

module.exports = router;