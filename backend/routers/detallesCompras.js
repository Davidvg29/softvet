const express = require('express');

const router = express.Router();

const { mostrarDetallesCompras,mostrarDetalleCompraPorId,crearDetalleCompra,editarDetalleCompra,eliminarDetalleCompra } = require('../controllers/detallesCompras');
const { verifyToken } = require('../middlewares/jwt');
const { autenticarRoles } = require('../middlewares/autenticarRoles');

router.get('/ver', verifyToken, mostrarDetallesCompras);
router.get('/ver/:id_detalle_compra', verifyToken, mostrarDetalleCompraPorId);
router.post('/crear', verifyToken, autenticarRoles(["Administrador"]), crearDetalleCompra);
router.put('/editar/:id_detalle_compra', autenticarRoles(["Administrador"]), verifyToken, editarDetalleCompra);
router.delete('/eliminar/:id_detalle_compra', autenticarRoles(["Administrador"]), verifyToken, eliminarDetalleCompra);

module.exports = router;
