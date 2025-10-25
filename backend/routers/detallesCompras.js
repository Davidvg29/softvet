const express = require('express');

const router = express.Router();

const { mostrarDetallesCompras,mostrarDetalleCompraPorId,crearDetalleCompra,editarDetalleCompra,eliminarDetalleCompra } = require('../controllers/detallesCompras');

router.get('/ver', mostrarDetallesCompras);
router.get('/ver/:id_detalle_compra', mostrarDetalleCompraPorId);
router.post('/crear', crearDetalleCompra);
router.put('/editar/:id_detalle_compra', editarDetalleCompra);
router.delete('/eliminar/:id_detalle_compra', eliminarDetalleCompra);

module.exports = router;
