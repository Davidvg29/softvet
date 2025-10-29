const express = require('express');
const { mostrarMascotas, crearMascota, editarMasctoa, borrarMascota, activarMascota } = require('../controllers/mascotas');
const { verifyToken } = require('../middlewares/jwt');
const router = express.Router();

router.get('/ver', verifyToken, mostrarMascotas);
router.post('/crear', verifyToken, crearMascota);
router.put('/editar/:id', verifyToken, editarMasctoa);
router.put('/borrar/:id', verifyToken, borrarMascota);
router.put('/activar/:id', verifyToken, activarMascota);

module.exports = router;