const express = require('express');
const router = express.Router();
const {
    mostrarEspecies,
    mostrarEspeciePorId,
    crearEspecie,
    editarEspecie,
    eliminarEspecie
} = require('../controllers/especies');
const { verifyToken } = require('../middlewares/jwt');

// Rutas para especies
router.get('/ver', verifyToken, mostrarEspecies);
router.get('/ver/:id', verifyToken, mostrarEspeciePorId);
router.post('/crear', verifyToken, crearEspecie);
router.put('/editar/:id', verifyToken, editarEspecie);
router.delete('/eliminar/:id', verifyToken, eliminarEspecie);

module.exports = router;