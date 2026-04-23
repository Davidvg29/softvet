const express = require('express');
const { mostrarProductos,mostrarProductoPorId,crearProducto,editarProducto,eliminarProducto, activarProducto } = require('../controllers/productos');
const { verifyToken } = require('../middlewares/jwt');

const router = express.Router();

router.get('/ver', verifyToken, mostrarProductos);
router.get('/ver/:id', verifyToken, mostrarProductoPorId);
router.post('/crear', verifyToken, crearProducto);
router.put('/editar/:id', verifyToken, editarProducto);
router.delete('/eliminar/:id', verifyToken, eliminarProducto);
router.put('/activar/:id', verifyToken, activarProducto);

module.exports = router;