const { connection } = require('../config/bd/dataBase');

// Obtener todas las categorías activas
const mostrarCategorias = (req, res) => {
    connection.query('SELECT * FROM categorias', (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al obtener las categorías.' });
        }
        res.json(results);
    });
};

// Obtener una categoría por ID
const mostrarCategoriaPorId = (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM categorias WHERE id_categoria = ?', [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al obtener la categoría.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada.' });
        }
        res.json(results[0]);
    });
};

// Crear una nueva categoría con validación de duplicados
const crearCategoria = (req, res) => {
    const { nombre_categoria } = req.body;
    if (!nombre_categoria) {
        return res.status(400).json({ error: 'El nombre de la categoría es obligatorio.' });
    }

    const validacion = 'SELECT * FROM categorias WHERE nombre_categoria = ?';
    connection.query(validacion, [nombre_categoria], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al verificar duplicados', detalle: error.message });
        }
        if (results.length > 0) {
            return res.status(400).json({
                error: 'Datos duplicados',
                detalle: 'Ya existe una categoría con ese nombre.'
            });
        }

        const nuevaCategoria = { nombre_categoria } // is_active: true //};
        connection.query('INSERT INTO categorias (nombre_categoria) values(?)', [nombre_categoria], (error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Error al crear la categoría.', detalle: error.message });
            }
            res.status(201).json({ message: 'Categoría creada exitosamente.', id_categoria: results.insertId });
        });
    });
};

// Editar una categoría existente
const editarCategoria = (req, res) => {
    const { id } = req.params;
    const { nombre_categoria } = req.body;

    const validacion = 'SELECT * FROM categorias WHERE nombre_categoria = ? AND id_categoria != ?';
    connection.query(validacion, [nombre_categoria, id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al verificar duplicados', detalle: error.message });
        }
        if (results.length > 0) {
            return res.status(400).json({
                error: 'Datos duplicados',
                detalle: 'Ya existe una categoría con ese nombre.'
            });
        }

        connection.query('UPDATE categorias SET nombre_categoria = ? WHERE id_categoria = ?', [nombre_categoria, id], (error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Error al actualizar la categoría.' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Categoría no encontrada.' });
            }
            res.json({ message: 'Categoría actualizada correctamente.' });
        });
    });
};

// Eliminar (desactivar) una categoría
const eliminarCategoria = (req, res) => {
    const { id } = req.params;
    connection.query('UPDATE categorias SET is_active = FALSE WHERE id_categoria = ?', [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al eliminar la categoría.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada.' });
        }
        res.json({ message: 'Categoría eliminada correctamente.' });
    });
};

module.exports = {
    mostrarCategorias,
    mostrarCategoriaPorId,
    crearCategoria,
    editarCategoria,
    eliminarCategoria
};
