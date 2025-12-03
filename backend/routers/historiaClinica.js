const express = require('express');
const router = express.Router();
const {
    mostrarHistoriasClinicas,
    mostrarHistoriaClinicaPorId,
    crearHistoriaClinica,
    editarHistoriaClinica,
    eliminarHistoriaClinica
} = require('../controllers/historiaClinica');
const { verifyToken } = require('../middlewares/jwt');

// Rutas para historia clínica
router.get('/ver', verifyToken, mostrarHistoriasClinicas);
router.get('/ver/:id', verifyToken, mostrarHistoriaClinicaPorId);
router.post('/crear', verifyToken, crearHistoriaClinica);
router.put('/editar/:id', verifyToken, editarHistoriaClinica);
router.delete('/eliminar/:id', verifyToken, eliminarHistoriaClinica);

module.exports = router;