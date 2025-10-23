const express = require('express');
const router = express.Router();
const {
    mostrarEspecies,
    mostrarEspeciePorId,
    crearEspecie,
    editarEspecie,
    eliminarEspecie
} = require('../controllers/especies');

// Rutas para especies
router.get('/ver', mostrarEspecies);
router.get('/ver/:id', mostrarEspeciePorId);
router.post('/crear', crearEspecie);
router.put('/editar/:id', editarEspecie);
router.delete('/eliminar/:id', eliminarEspecie);

module.exports = router;