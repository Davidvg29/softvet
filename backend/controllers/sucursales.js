const { connection } = require('../config/bd/dataBase');

// Obtener todas las sucursales activas
const mostrarSucursales = (req, res) => {
    connection.query('SELECT * FROM sucursales WHERE is_active = TRUE', (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al obtener las sucursales.' });
        }
        res.json(results);
    });
};

// Obtener una sucursal por ID
const mostrarSucursalPorId = (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM sucursales WHERE id_sucursal = ?', [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al obtener la sucursal.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Sucursal no encontrada.' });
        }
        res.json(results[0]);
    });
};

// Crear una nueva sucursal con validación de duplicados
const crearSucursal = (req, res) => {
    const { nombre_sucursal, direccion_sucursal, celular_sucursal } = req.body;
    if (!nombre_sucursal || !direccion_sucursal || !celular_sucursal) {
        return res.status(400).json({ error: 'Faltan datos obligatorios.' });
    }

    const validacion = 'SELECT * FROM sucursales WHERE nombre_sucursal = ? OR direccion_sucursal = ?';
    connection.query(validacion, [nombre_sucursal, direccion_sucursal], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al verificar duplicados', detalle: error.message });
        }
        if (results.length > 0) {
            const duplicados = [];
            results.forEach(result => {
                if (result.nombre_sucursal === nombre_sucursal) duplicados.push('Nombre');
                if (result.direccion_sucursal === direccion_sucursal) duplicados.push('Dirección');
            });
            return res.status(400).json({
                error: 'Datos duplicados',
                detalle: `Ya existe una sucursal con el mismo: ${duplicados.join(', ')}`
            });
        }

        const nuevaSucursal = { nombre_sucursal, direccion_sucursal, celular_sucursal, is_active: true };
        connection.query('INSERT INTO sucursales SET ?', nuevaSucursal, (error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Error al crear la sucursal.', detalle: error.message });
            }
            res.status(201).json({ message: 'Sucursal creada exitosamente.', id_sucursal: results.insertId });
        });
    });
};

// Editar una sucursal existente
const editarSucursal = (req, res) => {
    const { id } = req.params;
    const { nombre_sucursal, direccion_sucursal, celular_sucursal } = req.body;

    const sucursalActualizada = { nombre_sucursal, direccion_sucursal, celular_sucursal };
    connection.query('UPDATE sucursales SET ? WHERE id_sucursal = ?', [sucursalActualizada, id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al actualizar la sucursal.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Sucursal no encontrada.' });
        }
        res.json({ message: 'Sucursal actualizada correctamente.' });
    });
};

// Eliminar una sucursal
const eliminarSucursal = (req, res) => {
    const { id } = req.params;
    connection.query('UPDATE sucursales SET is_active = FALSE WHERE id_sucursal = ?', [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al eliminar la sucursal.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Sucursal no encontrada.' });
        }
        res.json({ message: 'Sucursal eliminada correctamente.' });
    });
};

module.exports = {
    mostrarSucursales,
    mostrarSucursalPorId,
    crearSucursal,
    editarSucursal,
    eliminarSucursal
};
