const {connection} = require('../config/bd/dataBase');

// Obtener todos los detalles de las historias clínicas

const mostrardetalleHistoriaClinica = (req, res) => {
    const querydetalleHC = `SELECT * FROM detalle_historia_clinica`;

    connection.query(querydetalleHC, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al obtener los detalles de las historias clínicas.' });
        }
        res.json(results);
    });
}

// Obtener todos los detalles de una historia clínica por su ID

const mostrardetalleHistoriaClinicaPorId = (req, res) => {
    const { id } = req.params; // id de historia_clinica
    const query = `
        SELECT 
            d.id_detalle_historia_clinica,
            d.fecha_hora,
            d.observaciones,
            d.id_empleado,
            d.id_sucursal,
            d.id_venta,
            h.id_historia_clinica,
            h.fecha_apertura,
            h.observaciones_generales
        FROM detalle_historia_clinica AS d
        INNER JOIN historia_clinica AS h 
            ON d.id_historia_clinica = h.id_historia_clinica
        WHERE d.id_historia_clinica = ?;
    `;

    connection.query(query, [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al obtener los detalles de la historia clínica.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'No hay detalles registrados para esta historia clínica.' });
        }
        res.status(200).json(results);
    });
};

//Crear un nuevo detalle de historia clínica

const creardetalleHistoriaClinica = (req, res) => {
    const { id_historia_clinica, id_empleado, id_sucursal, id_venta, fecha_hora, observaciones } = req.body;

    if (!id_historia_clinica || !id_empleado || !fecha_hora) {
        return res.status(400).json({ error: 'Faltan datos obligatorios.' });
    }
    const querycreardetalleHC = `INSERT INTO detalle_historia_clinica (id_historia_clinica, id_empleado, id_sucursal, id_venta, fecha_hora, observaciones) VALUES (?, ?, ?, ?, now(), ?)`;

    connection.query(querycreardetalleHC, [id_historia_clinica, id_empleado, id_sucursal, id_venta, observaciones], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al crear el detalle de la historia clínica.' });
        }
        res.status(201).json({ message: 'Detalle de historia clínica creado exitosamente.', id: results.insertId });
    });
}

//Editar un detalle de historia clínica

const editardetalleHistoriaClinica = (req, res) => {
    const { id } = req.params;
    const { id_historia_clinica, id_empleado, id_sucursal, id_venta, fecha_hora, observaciones } = req.body;
    const queryeditardetalleHC = `UPDATE detalle_historia_clinica SET id_historia_clinica = ?, id_empleado = ?, id_sucursal = ?, id_venta = ?, fecha_hora = now(), observaciones = ? WHERE id_detalle_historia_clinica = ?`;

    connection.query(queryeditardetalleHC, [id_historia_clinica, id_empleado, id_sucursal, id_venta, observaciones, id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al actualizar el detalle de la historia clínica.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Detalle de historia clínica no encontrado.' });
        }
        res.json({ message: 'Detalle de historia clínica actualizado correctamente.' });
    });
}


//Eliminar un detalle de historia clínica

const eliminardetalleHistoriaClinica = (req, res) => {
    const { id } = req.params;
    const queryeliminardetalleHC = `DELETE FROM detalle_historia_clinica WHERE id_detalle_historia_clinica = ?`;
    connection.query(queryeliminardetalleHC, [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al eliminar el detalle de la historia clínica.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Detalle de historia clínica no encontrado.' });
        }
        res.json({ message: 'Detalle de historia clínica eliminado correctamente.' });
    });
}


module.exports = {
    mostrardetalleHistoriaClinica,
    mostrardetalleHistoriaClinicaPorId,
    creardetalleHistoriaClinica,
    editardetalleHistoriaClinica,
    eliminardetalleHistoriaClinica
};
