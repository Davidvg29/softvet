const express = require('express');
const router = express.Router();

const {
    mostrarCategorias,
    mostrarCategoriaPorId,
    crearCategoria,
    editarCategoria,
    eliminarCategoria
} = require('../controllers/categorias');
const { verifyToken } = require('../middlewares/jwt');

// Rutas para gestión de categorías
router.get('/ver',verifyToken, mostrarCategorias);
router.get('/ver/:id',verifyToken, mostrarCategoriaPorId);
router.post('/crear',verifyToken, crearCategoria);
router.put('/editar/:id',verifyToken, editarCategoria);
router.delete('/eliminar/:id',verifyToken, eliminarCategoria);

module.exports = router;
