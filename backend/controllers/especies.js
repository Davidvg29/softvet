const {connection} = require('../config/bd/dataBase');

// Obtener todos las especies
const mostrarEspecies = (req, res) => {

    connection.query('SELECT * FROM especies', (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al obtener las especies.' });
        }
        res.json(results);
    });
}

// Obtener una especie por ID
const mostrarEspeciePorId = (req, res) => {

    const { id } = req.params;
    connection.query('SELECT * FROM especies WHERE id_especie = ?', [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al obtener la especie.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Especie no encontrada.' });
        }
        res.json(results[0]);
    });
}

// Crear una nueva especie
const crearEspecie = (req, res) => {
    const { nombre_especie } = req.body;

    // Validación de campo obligatorio
    if (!nombre_especie) {
        return res.status(400).json({ error: 'El nombre de la especie es obligatorio.' });
    }

    // Verificar si ya existe una especie con el mismo nombre
    const validacion = 'SELECT * FROM especies WHERE nombre_especie = ?';
    connection.query(validacion, [nombre_especie], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al verificar duplicados', detalle: error.message });
        }

        if (results.length > 0) {
            return res.status(400).json({
                error: 'Especie duplicada',
                detalle: 'Ya existe una especie con ese nombre.'
            });
        }

        // Insertar nueva especie
        const nuevaEspecie = { nombre_especie };
        connection.query('INSERT INTO especies SET ?', nuevaEspecie, (error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Error al crear la especie', detalle: error.message });
            }

            res.status(201).json({
                message: 'Especie creada exitosamente.',
                id_especie: results.insertId
            });
        });
    });
};

// Editar una especie
const editarEspecie = (req, res) => {
    const { id } = req.params;
    const { nombre_especie } = req.body;

    // Validación de campo obligatorio
    if (!nombre_especie) {
        return res.status(400).json({ error: 'El nombre de la especie es obligatorio.' });
    }

    // Verificar si ya existe otra especie con el mismo nombre
    const validacion = 'SELECT * FROM especies WHERE nombre_especie = ? AND id_especie != ?';
    connection.query(validacion, [nombre_especie, id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al verificar duplicados', detalle: error.message });
        }

        if (results.length > 0) {
            return res.status(400).json({
                error: 'Especie duplicada',
                detalle: 'Ya existe otra especie con ese nombre.'
            });
        }

        // Actualizar especie
        const especieActualizada = { nombre_especie };
        connection.query('UPDATE especies SET ? WHERE id_especie = ?', [especieActualizada, id], (error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Error al actualizar la especie.' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Especie no encontrada.' });
            }

            res.json({ message: 'Especie actualizada correctamente.' });
        });
    });
};

// Eliminar una especie
const eliminarEspecie = (req, res) => {
    const { id } = req.params;

    connection.query('DELETE FROM especies WHERE id_especie = ?', [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al eliminar la especie.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Especie no encontrada.' });
        }

        res.json({ message: 'Especie eliminada correctamente.' });
    });
};

module.exports = {
    mostrarEspecies,
    mostrarEspeciePorId,
    crearEspecie,
    editarEspecie,
    eliminarEspecie
};