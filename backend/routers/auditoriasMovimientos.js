const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/jwt');
const { autenticarRoles } = require('../middlewares/autenticarRoles');
const { getAuditoriasMovimiento } = require('../controllers/auditoriasMovimiento');

router.get('/ver', verifyToken, autenticarRoles(["Administrador"]), getAuditoriasMovimiento);

module.exports = router;