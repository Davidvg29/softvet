const { connection } = require('../config/bd/dataBase');

// Obtener todos los turnos (soporta filtros por fecha, cliente, mascota, empleado y estado)
const mostrarTurnos = (req, res) => {
    let sql = `select 
turnos.*,
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
    connection.query('SELECT * FROM turnos WHERE id_turno = ?', [id], (error, results) => {
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

    if (!fecha_hora || !id_cliente || !id_mascota || !id_empleado) {
        return res.status(400).json({ error: 'fecha_hora, id_cliente, id_mascota e id_empleado son obligatorios' });
    }

    if (isNaN(Date.parse(fecha_hora))) {
        return res.status(400).json({ error: 'Formato de fecha inválido' });
    }


    //convierto la fecha a formato compatible con MySQL
    const fechaFormateada = new Date(fecha_hora).toISOString().slice(0, 19).replace('T', ' ');

    const estadosPermitidos = ['Pendiente', 'Confirmado', 'Cancelado', 'Atendido'];
    const estadoFinal = estado ? estado.trim() : 'Pendiente';

    if (!estadosPermitidos.includes(estadoFinal)) {
        return res.status(400).json({ 
            error: `Estado inválido. Los estados permitidos son: ${estadosPermitidos.join(', ')}`
        });
    }

    
    const motivo = motivo_turno ? motivo_turno.trim() : null;

    const checkSql = `
        SELECT * FROM turnos
        WHERE fecha_hora = ?  AND id_cliente = ? AND id_mascota = ? AND id_empleado =?
    `;
    connection.query(checkSql, [fechaFormateada, id_cliente, id_mascota, id_empleado], (checkError, results) => {
        if (checkError) {
            console.error(checkError);
            return res.status(500).json({ error: 'Error al verificar turno existente' });
        }

        if (results.length > 0) {
            return res.status(409).json({ error: 'Ya existe un turno con la misma fecha, cliente, mascota y empleado' });
        }

        // Si no existe, insertar
        const insertSql = `
            INSERT INTO turnos (fecha_hora, motivo_turno, estado, id_cliente, id_mascota, id_empleado)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const params = [fechaFormateada, motivo, estadoFinal, id_cliente, id_mascota, id_empleado];

        connection.query(insertSql, params, (error, results) => {
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
        if (fecha_hora) {
            if (isNaN(Date.parse(fecha_hora))) {
                return res.status(400).json({ error: 'Formato de fecha inválido' });
            }
            newFecha = new Date(fecha_hora).toISOString().slice(0, 19).replace('T', ' ');
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
        connection.query(checkSql, [newFecha, newCliente, newMascota,newEmpleado, id], (dupErr, dupRows) => {
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

module.exports = {
    mostrarTurnos,
    mostrarTurnoId,
    crearTurno,
    editarTurno,
    eliminarTurno
};
