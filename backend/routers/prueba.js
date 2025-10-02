const express = require('express');
const prueba = require('../controllers/prueba');
const router = express.Router();

router.get('/prueba', prueba);

module.exports = router;
