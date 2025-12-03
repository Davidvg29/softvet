const express = require('express');
const router = express.Router();
const { verVentas, crearVenta, editarVenta, borrarVenta, activarVenta } = require('../controllers/ventas');
const { verifyToken } = require('../middlewares/jwt');
const { autenticarRoles } = require('../middlewares/autenticarRoles');

router.get('/ver', verifyToken, verVentas);
router.post('/crear', verifyToken, crearVenta);
router.put('/editar/:id_venta', verifyToken, editarVenta);
router.put('/borrar/:id_venta', verifyToken, autenticarRoles(["Administrador"]), borrarVenta);
router.put('/activar/:id_venta', verifyToken, autenticarRoles(["Administrador"]), activarVenta);

module.exports = router;