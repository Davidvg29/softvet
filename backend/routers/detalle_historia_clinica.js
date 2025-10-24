const express = require('express');
const router = express.Router();
const {
    mostrardetalleHistoriaClinica,
    mostrardetalleHistoriaClinicaPorId,
    creardetalleHistoriaClinica,
    editardetalleHistoriaClinica,
    eliminardetalleHistoriaClinica
} = require('../controllers/detalle_historia_clinica');

// Rutas para detalle de historia clínica
router.get('/ver', mostrardetalleHistoriaClinica);
router.get('/ver/:id', mostrardetalleHistoriaClinicaPorId);
router.post('/crear', creardetalleHistoriaClinica);
router.put('/editar/:id', editardetalleHistoriaClinica);
router.delete('/eliminar/:id', eliminardetalleHistoriaClinica);


module.exports = router;