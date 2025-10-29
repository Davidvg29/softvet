const express = require('express');
const { mostrarRazas, mostrarRazaId, crearRaza,editarRaza,eliminarRaza} = require('../controllers/razas');
const { verifyToken } = require('../middlewares/jwt');

const router = express.Router();

router.get('/ver', verifyToken, mostrarRazas);
router.get('/ver/:id', verifyToken, mostrarRazaId);
router.post('/crear', verifyToken, crearRaza);
router.put('/editar/:id', verifyToken, editarRaza);
router.delete('/eliminar/:id', verifyToken, eliminarRaza);

module.exports = router;