const express = require('express');
const router = express.Router();
const { verDetallesVentas, crearDetalleVenta, editarDetalleVenta, borrarDetalleVenta } = require('../controllers/detallesVentas');

router.get('/ver', verDetallesVentas);
router.post('/crear', crearDetalleVenta);
router.put('/editar/:id', editarDetalleVenta);
router.delete('/borrar/:id', borrarDetalleVenta);

module.exports = router;