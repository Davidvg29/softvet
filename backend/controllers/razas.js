const { connection } = require('../config/bd/dataBase');

//mostrar todas las razas
const mostrarRazas = (req, res) => {
    const queryMostrarRaza = `
        SELECT r.id_raza, r.nombre_raza, e.nombre_especie, e.id_especie
        FROM razas r
        INNER JOIN especies e ON r.id_especie = e.id_especie
        ;
    `;

    connection.query(queryMostrarRaza, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al obtener las razas' });
        }
        return res.json(results);
    });
};

const mostrarRazaId = (req, res) => {

    const { id } = req.params;
    const queryMostrarRazaId = `
        SELECT 
            r.id_raza, 
            r.nombre_raza, 
            r.id_especie,
            e.nombre_especie
        FROM razas r
        INNER JOIN especies e ON r.id_especie = e.id_especie
        WHERE r.id_raza = ?;
    `;

    connection.query(queryMostrarRazaId, [id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al obtener la raza' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Raza no encontrada' });
        }
        return res.json(results[0]);
    });
};

const crearRaza = (req, res) => {
    const { nombre_raza, id_especie } = req.body;

    if (!nombre_raza || !id_especie) {
        return res.status(400).json({ error: 'El nombre de la raza y el id de la especie son obligatorios' });
    }

    //Validar tipo de datos
    if (typeof nombre_raza !== 'string' || isNaN(id_especie)) {
        return res.status(400).json({ error: 'Datos inválidos: nombre_raza debe ser texto e id_especie un número' });
    }

    //Normalizar el nombre
    const nombreNormalizado = nombre_raza.trim();

    if (nombreNormalizado.length === 0) {
        return res.status(400).json({ error: 'El nombre de la raza no puede estar vacío' });
    }

    const checkEspecieQuery = 'SELECT * FROM especies WHERE id_especie = ?';
    connection.query(checkEspecieQuery, [id_especie], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al validar la especie' });
        }

        if (results.length === 0) {
            return res.status(400).json({ error: 'La especie referenciada no existe' });
        }

        const checkRazaQuery = `SELECT * FROM razas WHERE nombre_raza = ? AND id_especie = ?`;
        connection.query(checkRazaQuery, [nombreNormalizado, id_especie], (dupErr, dupRows) => {
            if (dupErr) {
                console.error(dupErr);
                return res.status(500).json({ error: 'Error al validar duplicados' });
            }

            if (dupRows.length > 0) {
                return res.status(409).json({ error: 'Ya existe una raza con ese nombre para esta especie' });
            }
            // Insertar la nueva raza
            const crearRazaQuery = `INSERT INTO razas (nombre_raza, id_especie) VALUES (?, ?)`;
            connection.query(crearRazaQuery, [nombreNormalizado, id_especie], (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: 'Error al crear la raza' });
                }
                return res.status(201).json({
                    message: 'Raza creada correctamente',
                    id_raza: results.insertId
                });
            });
        });
    });
};

const editarRaza = (req, res) => {
    const { id } = req.params;
    const { nombre_raza, id_especie } = req.body;

    // Validaciones 
    if (nombre_raza && nombre_raza.trim() === '') {
        return res.status(400).json({ error: 'El nombre de la raza no puede estar vacío' });
    }
    if (id_especie && isNaN(id_especie)) {
        return res.status(400).json({ error: 'El ID de especie debe ser un número válido' });
    }

    // Verificar si existe la raza
    connection.query('SELECT * FROM razas WHERE id_raza = ?', [id], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al consultar la raza' });
        }
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Raza no encontrada' });
        }

        const existing = rows[0];
        const newNombre = nombre_raza ? nombre_raza.trim() : existing.nombre_raza;
        const newEspecie = id_especie ? id_especie : existing.id_especie;

        // Validar duplicado (nombre + especie)
        const checkRazaQuery = `SELECT * FROM razas WHERE nombre_raza = ? AND id_especie = ? AND id_raza = ?`;
        connection.query(checkRazaQuery, [newNombre, newEspecie, id], (dupErr, dupRows) => {
            if (dupErr) {
                console.error(dupErr);
                return res.status(500).json({ error: 'Error al verificar duplicados' });
            }

            if (dupRows.length > 0) {
                return res.status(409).json({ error: 'Ya existe una raza con ese nombre para esta especie' });
            }

            //Actualizar si no hay duplicados
            const updateQuery = `UPDATE razas SET nombre_raza = ?, id_especie = ? WHERE id_raza = ?`;
            connection.query(updateQuery, [newNombre, newEspecie, id], (updateErr) => {
                if (updateErr) {
                    console.error(updateErr);
                    if (updateErr.code === 'ER_NO_REFERENCED_ROW_2') {
                        return res.status(400).json({ error: 'La especie referenciada no existe' });
                    }
                    return res.status(500).json({ error: 'Error al actualizar la raza' });
                }
                return res.json({ message: 'Raza actualizada correctamente' });
            });
        });
    });
};


// Obtener razas por id de especie
const obtenerRazasPorEspecie = (req, res) => {
  const { id_especie } = req.params;

  console.log("ID recibido:", id_especie);


  connection.query(
    'SELECT * FROM razas WHERE id_especie = ?',
    [id_especie],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Error al obtener razas por especie.' });
      }
      res.json(results);
    }
  );
};

const eliminarRaza = (req, res) => {
    const { id } = req.params;

    // Validar que el id sea un número
    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }
    const eliminarRazaQuery = 'DELETE FROM razas WHERE id_raza = ?';

    connection.query(eliminarRazaQuery, [id], (error, results) => {
        if (error) {
            console.error(error);

            return res.status(500).json({ error: 'Error al eliminar la raza' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Raza no encontrada' });
        }
        return res.json({ message: 'Raza eliminada correctamente' });
    });
};


module.exports = {
    mostrarRazas,
    mostrarRazaId,
    crearRaza,
    editarRaza,
    obtenerRazasPorEspecie,
    eliminarRaza
}