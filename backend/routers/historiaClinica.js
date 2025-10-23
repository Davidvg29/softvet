const express = require('express');
const router = express.Router();
const {
    mostrarHistoriasClinicas,
    mostrarHistoriaClinicaPorId,
    crearHistoriaClinica,
    editarHistoriaClinica,
    eliminarHistoriaClinica
} = require('../controllers/historiaClinica');

// Rutas para historia clínica
router.get('/ver', mostrarHistoriasClinicas);
router.get('/ver/:id', mostrarHistoriaClinicaPorId);
router.post('/crear', crearHistoriaClinica);
router.put('/editar/:id', editarHistoriaClinica);
router.delete('/eliminar/:id', eliminarHistoriaClinica);

module.exports = router;