const express = require('express');
const router = express.Router();
const {
    informeVentasPorFecha,
    informeTurnosPorFecha,
    informeEmpleadoMasVentas

} = require('../controllers/informes');
const { verifyToken } = require('../middlewares/jwt');
router.post("/ventas-fecha", verifyToken, informeVentasPorFecha);
router.post("/turnos-fecha", verifyToken, informeTurnosPorFecha);
router.post("/empleado-mas-ventas", verifyToken, informeEmpleadoMasVentas);


module.exports = router;