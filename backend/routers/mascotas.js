const express = require('express');
const { mostrarMascotas, mostrarMascotaId, crearMascota, editarMascota, borrarMascota, activarMascota,mostrarMascotasPorCliente } = require('../controllers/mascotas');
const { verifyToken } = require('../middlewares/jwt');
const router = express.Router();

router.get('/cliente/:id_cliente', verifyToken, mostrarMascotasPorCliente);
router.get('/ver', verifyToken, mostrarMascotas);
router.get('/ver/:id', verifyToken, mostrarMascotaId)
router.post('/crear', verifyToken, crearMascota);
router.put('/editar/:id', verifyToken, editarMascota);
router.delete('/eliminar/:id', verifyToken, borrarMascota);
router.put('/activar/:id', verifyToken, activarMascota);


module.exports = router;