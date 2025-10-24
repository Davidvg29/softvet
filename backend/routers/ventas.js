const express = require('express');
const router = express.Router();
const { verVentas, crearVenta, editarVenta, borrarVenta, activarVenta } = require('../controllers/ventas');

router.get('/ver', verVentas);
router.post('/crear', crearVenta);
router.put('/editar/:id_venta', editarVenta);
router.put('/borrar/:id_venta', borrarVenta);
router.put('/activar/:id_venta', activarVenta);

module.exports = router;