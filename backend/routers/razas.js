const express = require('express');
const { mostrarRazas, mostrarRazaId, crearRaza,editarRaza,eliminarRaza} = require('../controllers/razas');

const router = express.Router();

router.get('/ver', mostrarRazas);
router.get('/ver/:id', mostrarRazaId);
router.post('/crear', crearRaza);
router.put('/editar/:id', editarRaza);
router.delete('/eliminar/:id', eliminarRaza);

module.exports = router;