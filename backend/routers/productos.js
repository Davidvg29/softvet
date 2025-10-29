const express = require('express');
const { mostrarProductos,mostrarProductoPorId,crearProducto,editarProducto,eliminarProducto } = require('../controllers/productos');
const { verifyToken } = require('../middlewares/jwt');

const router = express.Router();

router.get('/ver', verifyToken, mostrarProductos);
router.get('/ver/:id', verifyToken, mostrarProductoPorId);
router.post('/crear', verifyToken, crearProducto);
router.put('/editar/:id', verifyToken, editarProducto);
router.delete('/eliminar/:id', verifyToken, eliminarProducto);

module.exports = router;