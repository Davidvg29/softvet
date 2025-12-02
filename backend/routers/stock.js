const express = require('express');
const router = express.Router();
const { verStock, crearStock, editarStock, eliminarStock, verStockPorProducto,verStockPorID } = require('../controllers/stock');
const { verifyToken } = require('../middlewares/jwt');

router.get('/ver', verifyToken, verStock);
router.get('/ver/producto/:id_producto', verifyToken, verStockPorProducto);
router.get('/verStock/:id_stock',verifyToken,verStockPorID )
router.post('/crear', verifyToken, crearStock);
router.put('/editar/:id_stock', verifyToken, editarStock);
router.delete('/borrar/:id_stock', verifyToken, eliminarStock)

module.exports = router;