const express = require('express');
const router = express.Router();
const { verStock, crearStock, editarStock, eliminarStock } = require('../controllers/stock');
const { verifyToken } = require('../middlewares/jwt');

router.get('/ver', verifyToken, verStock);
router.post('/crear', verifyToken, crearStock);
router.put('/editar/:id_stock', verifyToken, editarStock);
router.delete('/borrar/:id_stock', verifyToken, eliminarStock)

module.exports = router;