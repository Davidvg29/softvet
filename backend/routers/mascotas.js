const express = require('express');
const { mostrarMascotas, crearMascota, editarMasctoa, borrarMascota, activarMascota } = require('../controllers/mascotas');
const router = express.Router();

router.get('/ver', mostrarMascotas);
router.post('/crear', crearMascota);
router.put('/editar/:id', editarMasctoa);
router.put('/borrar/:id', borrarMascota);
router.put('/activar/:id', activarMascota);

module.exports = router;