const {connection} = require('../config/bd/dataBase');


// Obtener todas las historias clínicas

const mostrarHistoriasClinicas = (req, res) => {

    const querymostrarHC = `SELECT 
  hc.id_historia_clinica,
  hc.fecha_apertura,
  hc.observaciones_generales,
  m.nombre_mascota AS nombre_mascota,
  e.nombre_empleado AS veterinario
FROM historia_clinica hc
LEFT JOIN mascotas m ON m.id_historia_clinica = hc.id_historia_clinica
LEFT JOIN (
    SELECT dhc2.*
    FROM detalle_historia_clinica dhc2
    JOIN (
        SELECT id_historia_clinica, MAX(fecha_hora) AS max_fecha
        FROM detalle_historia_clinica
        GROUP BY id_historia_clinica
    ) ult ON dhc2.id_historia_clinica = ult.id_historia_clinica
          AND dhc2.fecha_hora = ult.max_fecha
) dhc ON hc.id_historia_clinica = dhc.id_historia_clinica
LEFT JOIN empleados e ON dhc.id_empleado = e.id_empleado
ORDER BY hc.fecha_apertura DESC;
    `;

    connection.query(querymostrarHC, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al obtener las historias clínicas.' });
        }
        res.json(results);
    });
}


// Obtener una historia clínica por ID

const mostrarHistoriaClinicaPorId = (req, res) => {
    const { id } = req.params;

    const querymostrarHCporId = `SELECT 
    hc.*, 
    m.nombre_mascota AS nombre_mascota
FROM historia_clinica hc
LEFT JOIN mascotas m ON m.id_historia_clinica = hc.id_historia_clinica
WHERE hc.id_historia_clinica = ?;
        `;

    connection.query(querymostrarHCporId, [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al obtener la historia clínica.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Historia clínica no encontrada.' });
        }
        res.json(results[0]);
    });
}


//crear historia clinica

const crearHistoriaClinica = (req, res) => {
    const { id_mascota, fecha_apertura, observaciones_generales } = req.body;

    if (!id_mascota || !fecha_apertura) {
        return res.status(400).json({ error: 'La historia clínica debe tener una mascota asociada' });
    }

    connection.query('SELECT * FROM mascotas WHERE id_mascota = ?', [id_mascota], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al verificar la mascota', detalle: error.message });
        }
        if (results.length === 0) {
            return res.status(400).json({ error: 'La mascota asociada no existe' });
        }

        const queryInsertarHC = 'INSERT INTO historia_clinica (id_mascota, fecha_apertura, observaciones_generales) VALUES (?, ?, ?)';

        connection.query(queryInsertarHC, [id_mascota, fecha_apertura, observaciones_generales], (error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Error al crear la historia clínica', detalle: error.message });
            }
            res.status(201).json({ message: 'Historia clínica creada exitosamente.', id_historia_clinica: results.insertId });
        });
    });
}


// Editar una historia clínica

const editarHistoriaClinica = (req, res) => {
    const { id } = req.params;
    const { fecha_apertura, observaciones_generales } = req.body;

    const queryActualizarHC = 'UPDATE historia_clinica SET fecha_apertura = ?, observaciones_generales = ? WHERE id_historia_clinica = ?';

    connection.query(queryActualizarHC, [fecha_apertura, observaciones_generales, id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al actualizar la historia clínica', detalle: error.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Historia clínica no encontrada.' });
        }
        res.json({ message: 'Historia clínica actualizada correctamente.' });
    });
}

// Eliminar una historia clínica
const eliminarHistoriaClinica = (req, res) => {
    const { id } = req.params;

    connection.query('DELETE FROM historia_clinica WHERE id_historia_clinica = ?', [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al eliminar la historia clínica.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Historia clínica no encontrada.' });
        }
        res.json({ message: 'Historia clínica eliminada correctamente.' });
    });
}

module.exports = {
    mostrarHistoriasClinicas,
    mostrarHistoriaClinicaPorId,
    crearHistoriaClinica,
    editarHistoriaClinica,
    eliminarHistoriaClinica
};