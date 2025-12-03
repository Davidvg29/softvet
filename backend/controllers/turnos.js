const { connection } = require('../config/bd/dataBase');

// Obtener todos los turnos (soporta filtros por fecha, cliente, mascota, empleado y estado)
const mostrarTurnos = (req, res) => {
    let sql = `select 
        turnos.id_turno, 
        DATE_FORMAT(turnos.fecha_hora, '%Y-%m-%d %H:%i') AS fecha_hora, 
        turnos.motivo_turno, 
        turnos.estado, 
        turnos.id_cliente, 
        turnos.id_mascota, 
        turnos.id_empleado,
        clientes.*,
        mascotas.*,
        empleados.id_empleado, empleados.nombre_empleado
        from turnos
        left join clientes on turnos.id_cliente = clientes.id_cliente
        left join mascotas on turnos.id_mascota = mascotas.id_mascota
        left join empleados on turnos.id_empleado = empleados.id_empleado`;
    const conditions = [];
    const params = [];

    if (req.query.fecha) { // formato yyyy-mm-dd
        conditions.push('DATE(fecha_hora) = ?');
        params.push(req.query.fecha);
    }
    if (req.query.id_cliente) {
        conditions.push('id_cliente = ?');
        params.push(req.query.id_cliente);
    }
    if (req.query.id_mascota) {
        conditions.push('id_mascota = ?');
        params.push(req.query.id_mascota);
    }
    if (req.query.id_empleado) {
        conditions.push('id_empleado = ?');
        params.push(req.query.id_empleado);
    }
    if (req.query.estado) {
        conditions.push('estado = ?');
        params.push(req.query.estado);
    }

    if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
    }

    connection.query(sql, params, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al obtener los turnos' });
        }
        return res.json(results);
    });
};

// Obtener un turno por id
const mostrarTurnoId = (req, res) => {
    const { id } = req.params;
    connection.query(`select 
        turnos.id_turno,
        DATE_FORMAT(turnos.fecha_hora, '%Y-%m-%d %H:%i') AS fecha_hora, -- 👈 CAMBIO CLAVE AQUÍ
        turnos.motivo_turno,
        turnos.estado,
        turnos.id_cliente,
        turnos.id_mascota,
        turnos.id_empleado,
        clientes.*,
        mascotas.*,
        empleados.id_empleado, empleados.nombre_empleado
        from turnos
        left join clientes on turnos.id_cliente = clientes.id_cliente
        left join mascotas on turnos.id_mascota = mascotas.id_mascota
        left join empleados on turnos.id_empleado = empleados.id_empleado WHERE id_turno = ?`, [id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al obtener el turno' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Turno no encontrado' });
        }
        return res.json(results[0]);
    });
};

// Crear un turno
const crearTurno = (req, res) => {
    const { fecha_hora, motivo_turno, estado, id_cliente, id_mascota, id_empleado } = req.body;

    // Validaciones básicas
    if (!fecha_hora || !id_cliente || !id_mascota || !id_empleado) {
        return res.status(400).json({ error: 'fecha_hora, id_cliente, id_mascota e id_empleado son obligatorios' });
    }

    const regexFechaHora = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/; // formato "YYYY-MM-DD HH:mm"
    if (!regexFechaHora.test(fecha_hora)) {
        return res.status(400).json({ error: 'Formato de fecha y hora inválido. Debe ser YYYY-MM-DD HH:mm' });
    }

    // Validar estado
    const estadosPermitidos = ['Pendiente', 'Confirmado', 'Cancelado', 'Atendido'];
    const estadoFinal = estado ? estado.trim() : 'Pendiente';
    if (!estadosPermitidos.includes(estadoFinal)) {
        return res.status(400).json({ error: `Estado inválido. Los estados permitidos son: ${estadosPermitidos.join(', ')}` });
    }

    const motivo = motivo_turno ? motivo_turno.trim() : null;

    // Validar duplicados
    const checkSql = `
        SELECT * FROM turnos
        WHERE fecha_hora = ? AND id_cliente = ? AND id_mascota = ? AND id_empleado = ?
    `;
    connection.query(checkSql, [fecha_hora, id_cliente, id_mascota, id_empleado], (checkError, results) => {
        if (checkError) {
            console.error(checkError);
            return res.status(500).json({ error: 'Error al verificar turno existente' });
        }

        if (results.length > 0) {
            return res.status(409).json({ error: 'Ya existe un turno con la misma fecha, cliente, mascota y empleado' });
        }

        // Insertar turno
        const insertSql = `
            INSERT INTO turnos (fecha_hora, motivo_turno, estado, id_cliente, id_mascota, id_empleado)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        connection.query(insertSql, [fecha_hora, motivo, estadoFinal, id_cliente, id_mascota, id_empleado], (error, results) => {
            if (error) {
                console.error(error);
                if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === 'ER_NO_REFERENCED_ROW') {
                    return res.status(400).json({ error: 'Referencia a cliente/mascota/empleado no existe' });
                }
                return res.status(500).json({ error: 'Error al crear el turno' });
            }

            return res.status(201).json({ message: 'Turno creado', id_turno: results.insertId });
        });
    });
};



// editar un turno
const editarTurno = (req, res) => {
    const { id } = req.params;
    const { fecha_hora, motivo_turno, estado, id_cliente, id_mascota, id_empleado } = req.body;

    connection.query('SELECT * FROM turnos WHERE id_turno = ?', [id], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al consultar el turno' });
        }
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Turno no encontrado' });
        }

        const existing = rows[0];
        // Validar y formatear fecha
        let newFecha = existing.fecha_hora;

        // INICIO DE CORRECCIÓN DE ZONA HORARIA EXISTENTE
        // Esta parte es compleja, pero si ya la tienes para manejar datos antiguos sin fecha_hora nueva, la mantenemos.
        if (newFecha instanceof Date && !fecha_hora) {
            // El driver la devuelve 3 horas DESFASADA (asumiendo que está en UTC), compensamos para obtener el valor guardado.
            const timeMs = newFecha.getTime();
            const offsetMinutes = newFecha.getTimezoneOffset();
            const correctedMs = timeMs - (offsetMinutes * 60000); 
            newFecha = new Date(correctedMs).toISOString().slice(0, 19).replace('T', ' ');
        }
        // FIN DE CORRECCIÓN DE ZONA HORARIA

        // CORRECCIÓN CLAVE: Usamos la hora local enviada por el cliente.
        if (fecha_hora) {
            if (isNaN(Date.parse(fecha_hora))) {
                return res.status(400).json({ error: 'Formato de fecha inválido' });
            }
            
            // ANTES (Error: Convierte a UTC, añade 3 horas):
            // newFecha = new Date(fecha_hora).toISOString().slice(0, 19).replace('T', ' ');
            
            //  AHORA (Solución: Usa la cadena de hora local tal cual la envió React)
            newFecha = fecha_hora;
        }

        // Validar estado permitido
        const estadosPermitidos = ['Pendiente', 'Confirmado', 'Cancelado', 'Atendido'];
        const newEstado = estado ? estado.trim() : existing.estado;

        if (!estadosPermitidos.includes(newEstado)) {
            return res.status(400).json({
                error: `Estado inválido. Los estados permitidos son: ${estadosPermitidos.join(', ')}`
            });
        }

        //actualizar los campos 
        const newMotivo = typeof motivo_turno === 'string' ? motivo_turno : existing.motivo_turno;
        const newCliente = typeof id_cliente !== 'undefined' ? id_cliente : existing.id_cliente;
        const newMascota = typeof id_mascota !== 'undefined' ? id_mascota : existing.id_mascota;
        const newEmpleado = typeof id_empleado !== 'undefined' ? id_empleado : existing.id_empleado;

        //Validar duplicados
        const checkSql = `
            SELECT * FROM turnos
            WHERE fecha_hora = ? AND id_cliente = ? AND id_mascota = ? AND id_empleado = ? AND id_turno != ? 
        `;
        connection.query(checkSql, [newFecha, newCliente, newMascota, newEmpleado, id], (dupErr, dupRows) => {
            if (dupErr) {
                console.error(dupErr);
                return res.status(500).json({ error: 'Error al validar duplicados' });
            }
            if (dupRows.length > 0) {
                return res.status(409).json({ error: 'Ya existe un turno con esa fecha para el mismo cliente, mascota y empleado' });
            }

            //Ejecutar actualización
            const sql = `
                UPDATE turnos 
                SET fecha_hora = ?, motivo_turno = ?, estado = ?, id_cliente = ?, id_mascota = ?, id_empleado = ?
                WHERE id_turno = ?
            `;
            const params = [newFecha, newMotivo, newEstado, newCliente, newMascota, newEmpleado, id];

            connection.query(sql, params, (updateErr) => {
                if (updateErr) {
                    console.error(updateErr);
                    if (updateErr.code === 'ER_NO_REFERENCED_ROW_2' || updateErr.code === 'ER_NO_REFERENCED_ROW') {
                        return res.status(400).json({ error: 'Referencia a cliente/mascota/empleado no existe' });
                    }
                    return res.status(500).json({ error: 'Error al actualizar el turno' });
                }
                return res.json({ message: 'Turno actualizado correctamente' });
            });
        });
    });
};

// Eliminar un turno
const eliminarTurno = (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM turnos WHERE id_turno = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al eliminar el turno' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Turno no encontrado' });
        }
        return res.json({ message: 'Turno eliminado' });
    });
};

// Obtener horarios disponibles por fecha
// Obtener horarios disponibles por fecha
const horariosDisponibles = (req, res) => {
    const { fecha } = req.query;

    if (!fecha) {
        return res.status(400).json({ error: "Debe proporcionar una fecha" });
    }

    // Horarios base de atención
    const horariosBase = [
        "09:00", "10:00", "11:00", "12:00",
        "14:00", "15:00", "16:00", "17:00"
    ];

    // Obtener turnos ocupados para esa fecha
    const sql = `
        SELECT TIME(fecha_hora) AS hora
        FROM turnos
        WHERE DATE(fecha_hora) = ?
    `;

    connection.query(sql, [fecha], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: "Error al obtener horarios ocupados" });
        }

        // Extraer horas ocupadas en formato HH:mm
        const ocupados = results.map(r => r.hora.substring(0, 5));

        // Filtrar horarios disponibles
        const disponibles = horariosBase.filter(h => !ocupados.includes(h));

        return res.json(disponibles);
    });
};


module.exports = {
    mostrarTurnos,
    mostrarTurnoId,
    crearTurno,
    editarTurno,
    eliminarTurno,
    horariosDisponibles
};
