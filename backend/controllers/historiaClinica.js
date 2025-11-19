const { connection } = require('../config/bd/dataBase');


// Obtener todas las historias clínicas

const mostrarHistoriasClinicas = (req, res) => {

    const querymostrarHC = `
        SELECT 
            hc.id_historia_clinica,
            hc.fecha_apertura,
            hc.observaciones_generales,

            m.id_mascota,
            m.nombre_mascota,
            
            c.id_cliente,
            c.nombre_cliente,
            c.dni_cliente,

            dhc.observaciones AS diagnostico,
            dhc.fecha_hora AS fecha_ultima_atencion,

            e.nombre_empleado AS veterinario
        FROM historia_clinica hc
        
        LEFT JOIN mascotas m 
            ON m.id_historia_clinica = hc.id_historia_clinica

        LEFT JOIN clientes c
            ON m.id_cliente = c.id_cliente

        LEFT JOIN (
            SELECT dhc2.*
            FROM detalle_historia_clinica dhc2
            JOIN (
                SELECT id_historia_clinica, MAX(fecha_hora) AS max_fecha
                FROM detalle_historia_clinica
                GROUP BY id_historia_clinica
            ) ult
            ON dhc2.id_historia_clinica = ult.id_historia_clinica
            AND dhc2.fecha_hora = ult.max_fecha
        ) dhc
        ON hc.id_historia_clinica = dhc.id_historia_clinica

        LEFT JOIN empleados e 
            ON dhc.id_empleado = e.id_empleado

        ORDER BY hc.fecha_apertura DESC
    `;

    connection.query(querymostrarHC, (error, results) => {
        if (error) {
            console.log("Error SQL:", error);
            return res.status(500).json({ error: 'Error al obtener las historias clínicas.' });
        }
        res.json(results);
    });
};



// Obtener una historia clínica por ID

const mostrarHistoriaClinicaPorId = (req, res) => {
    const { id } = req.params;

    const query = `
        SELECT
            hc.id_historia_clinica,
            hc.fecha_apertura,
            hc.observaciones_generales,

            m.id_mascota,
            m.nombre_mascota,
            
            c.id_cliente,
            c.nombre_cliente,
            c.dni_cliente,

            dhc.observaciones AS diagnostico,
            dhc.fecha_hora AS fecha_ultima_atencion,

            e.nombre_empleado AS veterinario

        FROM historia_clinica hc
        LEFT JOIN mascotas m ON m.id_historia_clinica = hc.id_historia_clinica
        LEFT JOIN clientes c ON c.id_cliente = m.id_cliente

        LEFT JOIN (
            SELECT dhc2.*
            FROM detalle_historia_clinica dhc2
            JOIN (
                SELECT id_historia_clinica, MAX(fecha_hora) AS max_fecha
                FROM detalle_historia_clinica
                GROUP BY id_historia_clinica
            ) ult
            ON dhc2.id_historia_clinica = ult.id_historia_clinica
            AND dhc2.fecha_hora = ult.max_fecha
        ) dhc
        ON hc.id_historia_clinica = dhc.id_historia_clinica

        LEFT JOIN empleados e ON dhc.id_empleado = e.id_empleado

        WHERE hc.id_historia_clinica = ?
    `;

    connection.query(query, [id], (error, results) => {
        if (error) return res.status(500).json({ error: "Error al obtener la historia clínica." });
        if (results.length === 0) return res.status(404).json({ error: "Historia clínica no encontrada." });

        res.json(results[0]);
    });
};




//crear historia clinica

const crearHistoriaClinica = (req, res) => {
    const { id_mascota, observaciones_generales, observaciones,id_empleado } = req.body;

   

    if (!id_mascota) {
        return res.status(400).json({ error: "Debe seleccionar una mascota." });
    }

    // Verificar mascota
    connection.query('SELECT * FROM mascotas WHERE id_mascota = ?', [id_mascota], (error, results) => {
        if (error) return res.status(500).json({ error: "Error al verificar la mascota." });
        if (results.length === 0) return res.status(400).json({ error: "La mascota no existe." });

        // Crear historia clínica
        const queryInsert = `
            INSERT INTO historia_clinica (fecha_apertura, observaciones_generales)
            VALUES (NOW(), ?)
        `;

        connection.query(queryInsert, [observaciones_generales], (error, resultHC) => {
            if (error) {
                return res.status(500).json({ error: "Error al crear la historia clínica." });
            }

            const id_historia = resultHC.insertId;

            // Asociar a la mascota
            connection.query(
                'UPDATE mascotas SET id_historia_clinica = ? WHERE id_mascota = ?',
                [id_historia, id_mascota],
                (error) => {
                    if (error) {
                        return res.status(500).json({ error: "La historia fue creada pero no se pudo asignar a la mascota." });
                    }

                    const queryDetalle = `
                        INSERT INTO detalle_historia_clinica (observaciones, fecha_hora, id_empleado, id_historia_clinica)
                        VALUES (?, NOW(), ?, ?)
                    `;

                    connection.query(queryDetalle, [observaciones || "", id_empleado, id_historia], (error) => {
                        if (error) {
                            return res.status(500).json({ 
                                error: "La historia se creó, pero no se pudo registrar el diagnóstico inicial." 
                            });
                        }

                        res.status(201).json({
                            message: "Historia clínica creada correctamente con su diagnóstico inicial.",
                            id_historia_clinica: id_historia
                        });
                    });
                }
            );
        });
    });
};




// Editar una historia clínica

const editarHistoriaClinica = (req, res) => {
    const { id } = req.params;
    const { observaciones_generales } = req.body;

    const query = `
        UPDATE historia_clinica 
        SET observaciones_generales = ?, fecha_apertura = NOW()
        WHERE id_historia_clinica = ?
    `;

    connection.query(query, [observaciones_generales, id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: "Error al actualizar la historia clínica." });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Historia clínica no encontrada." });
        }
        res.json({ message: "Historia clínica actualizada correctamente." });
    });
};


const eliminarHistoriaClinica = (req, res) => {
    const { id } = req.params;

 
    const queryUpdateMascota = `
        UPDATE mascotas 
        SET id_historia_clinica = NULL 
        WHERE id_historia_clinica = ?
    `;

    connection.query(queryUpdateMascota, [id], (error) => {
        if (error) {
            return res.status(500).json({ error: "Error al desvincular la mascota de la historia clínica." });
        }

        const queryDeleteHC = `
            DELETE FROM historia_clinica 
            WHERE id_historia_clinica = ?
        `;

        connection.query(queryDeleteHC, [id], (error, results) => {
            if (error) {
                return res.status(500).json({ error: "Error al eliminar la historia clínica." });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: "Historia clínica no encontrada." });
            }

            res.json({ message: "Historia clínica eliminada correctamente (la mascota no fue eliminada)." });
        });
    });
};



module.exports = {
    mostrarHistoriasClinicas,
    mostrarHistoriaClinicaPorId,
    crearHistoriaClinica,
    editarHistoriaClinica,
    eliminarHistoriaClinica
};