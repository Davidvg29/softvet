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
            d.fecha_hora AS fecha_atencion,
            d.observaciones AS diagnostico_detalle,
            e.nombre_empleado AS veterinario_atencion,
            d.id_sucursal,
            d.id_venta
        FROM detalle_historia_clinica AS d
        LEFT JOIN empleados AS e 
            ON d.id_empleado = e.id_empleado
        WHERE d.id_historia_clinica = ?
        ORDER BY d.fecha_hora DESC;
    `;

    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error("Error SQL al obtener detalles:", error);
            return res.status(500).json({ error: 'Error al obtener los detalles de la historia clínica.' });
        }
        // Nota: Si no hay detalles, se devuelve un array vacío []
        res.status(200).json(results);
    });
};

//Crear un nuevo detalle de historia clínica

const creardetalleHistoriaClinica = (req, res) => {
    
    const { id_historia_clinica, id_empleado, id_sucursal, id_venta, observaciones } = req.body;

   
    if (!id_historia_clinica || !id_empleado) {
        return res.status(400).json({ error: 'Faltan datos obligatorios.' });
    }
    
   
    const querycreardetalleHC = `
        INSERT INTO detalle_historia_clinica (
            id_historia_clinica, id_empleado, id_sucursal, id_venta, observaciones, fecha_hora 
        ) VALUES (?, ?, ?, ?, ?, NOW())
    `;

    
    connection.query(querycreardetalleHC, 
        [id_historia_clinica, id_empleado, id_sucursal, id_venta, observaciones], // 5 parámetros aquí
        (error, results) => {
            if (error) {
                console.error("Error SQL:", error); // Es bueno loggear el error
                return res.status(500).json({ error: 'Error al crear el detalle de la historia clínica.' });
            }
            res.status(201).json({ message: 'Detalle de historia clínica creado exitosamente.', id: results.insertId });
        }
    );
};


const editardetalleHistoriaClinica = (req, res) => {
    const { id } = req.params; // ID del detalle a editar (id_detalle_historia_clinica)
    
  
    const { id_empleado, observaciones } = req.body;
    
    
    if (!id_empleado || !observaciones) {
        return res.status(400).json({ 
            error: 'Faltan datos esenciales para la actualización (id_empleado y observaciones).' 
        });
    }

    
    const queryeditardetalleHC = `
        UPDATE detalle_historia_clinica 
        SET 
            id_empleado = ?,         /* 1. Cambia el empleado al que está logueado/editando */
            fecha_hora = NOW(),      /* 2. Actualiza la fecha/hora a la actual */
            observaciones = ?        /* 3. Actualiza las observaciones */
        WHERE 
            id_detalle_historia_clinica = ?
    `;

    
    const params = [
        id_empleado,
        observaciones,
        id // id_detalle_historia_clinica
    ];

    connection.query(queryeditardetalleHC, params, (error, results) => {
        if (error) {
            console.error("Error SQL al actualizar detalle:", error);
            // Mostrar un error más descriptivo si falla la clave foránea
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                 return res.status(500).json({ error: 'Error: El ID de empleado proporcionado no existe.' });
            }
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

const mostrarDetallePorId = (req, res) => {
    const { id } = req.params; // id_detalle_historia_clinica

    const query = `
        SELECT 
            d.id_detalle_historia_clinica,
            d.id_historia_clinica,
            d.fecha_hora,
            d.observaciones,
            e.nombre_empleado,
            e.id_empleado
        FROM detalle_historia_clinica AS d
        LEFT JOIN empleados AS e 
            ON d.id_empleado = e.id_empleado
        WHERE d.id_detalle_historia_clinica = ?
        LIMIT 1;
    `;

    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error("Error SQL al obtener detalle:", error);
            return res.status(500).json({ error: 'Error al obtener el detalle clínico.' });
        }

        if (results.length === 0) return res.status(404).json({ error: "Detalle no encontrado" });

        res.status(200).json(results[0]); // un solo registro
    });
};



module.exports = {
    mostrardetalleHistoriaClinica,
    mostrardetalleHistoriaClinicaPorId,
    creardetalleHistoriaClinica,
    editardetalleHistoriaClinica,
    eliminardetalleHistoriaClinica,
    mostrarDetallePorId
};
