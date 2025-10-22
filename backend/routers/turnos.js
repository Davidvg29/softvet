const express = require('express');
const {mostrarTurnos,mostrarTurnoId,crearTurno,editarTurno,eliminarTurno} = require('../controllers/turnos');

const router = express.Router();    

router.get('/ver', mostrarTurnos);
router.get('/ver/:id', mostrarTurnoId);
router.post('/crear', crearTurno);
router.put('/editar/:id', editarTurno);
router.delete('/eliminar/:id', eliminarTurno);


module.exports = router;