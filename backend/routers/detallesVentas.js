const express = require('express');
const router = express.Router();
const { verDetallesVentas, crearDetalleVenta, editarDetalleVenta, borrarDetalleVenta } = require('../controllers/detallesVentas');
const { verifyToken } = require('../middlewares/jwt');
const { autenticarRoles } = require('../middlewares/autenticarRoles');

router.get('/ver', verifyToken, verDetallesVentas);
router.post('/crear', verifyToken, crearDetalleVenta);
router.put('/editar/:id', verifyToken, editarDetalleVenta);
router.delete('/borrar/:id', verifyToken, autenticarRoles(["Administrador"]), borrarDetalleVenta);

module.exports = router;