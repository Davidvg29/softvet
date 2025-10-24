const express = require('express');
const router = express.Router();

const {
    mostrarCategorias,
    mostrarCategoriaPorId,
    crearCategoria,
    editarCategoria,
    eliminarCategoria
} = require('../controllers/categorias');

// Rutas para gestión de categorías
router.get('/ver', mostrarCategorias);
router.get('/ver/:id', mostrarCategoriaPorId);
router.post('/crear', crearCategoria);
router.put('/editar/:id', editarCategoria);
router.delete('/eliminar/:id', eliminarCategoria);

module.exports = router;
