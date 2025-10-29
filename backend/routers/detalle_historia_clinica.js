const express = require('express');
const router = express.Router();
const {
    mostrardetalleHistoriaClinica,
    mostrardetalleHistoriaClinicaPorId,
    creardetalleHistoriaClinica,
    editardetalleHistoriaClinica,
    eliminardetalleHistoriaClinica
} = require('../controllers/detalle_historia_clinica');
const { verifyToken } = require('../middlewares/jwt');

// Rutas para detalle de historia clínica
router.get('/ver', verifyToken, mostrardetalleHistoriaClinica);
router.get('/ver/:id', verifyToken, mostrardetalleHistoriaClinicaPorId);
router.post('/crear', verifyToken, creardetalleHistoriaClinica);
router.put('/editar/:id', verifyToken, editardetalleHistoriaClinica);
router.delete('/eliminar/:id', verifyToken, eliminardetalleHistoriaClinica);


module.exports = router;