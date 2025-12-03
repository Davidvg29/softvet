const express = require('express');
const { mostrarRazas, mostrarRazaId, crearRaza,editarRaza, obtenerRazasPorEspecie, eliminarRaza} = require('../controllers/razas');
const { verifyToken } = require('../middlewares/jwt');

const router = express.Router();

router.get('/ver', verifyToken, mostrarRazas);
router.get('/ver/:id', verifyToken, mostrarRazaId);
router.post('/crear', verifyToken, crearRaza);
router.put('/editar/:id', verifyToken, editarRaza);
router.get('/porEspecie/:id_especie', obtenerRazasPorEspecie);
router.delete('/eliminar/:id', verifyToken, eliminarRaza);

module.exports = router;