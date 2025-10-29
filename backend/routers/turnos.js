const express = require('express');
const {mostrarTurnos,mostrarTurnoId,crearTurno,editarTurno,eliminarTurno} = require('../controllers/turnos');
const { verifyToken } = require('../middlewares/jwt');

const router = express.Router();    

router.get('/ver', verifyToken, mostrarTurnos);
router.get('/ver/:id', verifyToken, mostrarTurnoId);
router.post('/crear', verifyToken, crearTurno);
router.put('/editar/:id', verifyToken, editarTurno);
router.delete('/eliminar/:id', verifyToken, eliminarTurno);

module.exports = router;