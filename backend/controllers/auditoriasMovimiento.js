const { connection } = require("../config/bd/dataBase")

const getAuditoriasMovimiento = (req, res) => {
    const { fechaDesde, fechaHasta } = req.query;

    let query = `
        SELECT am.*, e.nombre_empleado, e.dni_empleado 
        FROM auditorias_movimientos AS am 
        LEFT JOIN empleados e ON am.id_empleado = e.id_empleado
    `;
    let queryParams = [];
    if (fechaDesde && fechaHasta) {
        // DATE() extrae solo la parte de la fecha (YYYY-MM-DD) para comparar correctamente
        query += ` WHERE DATE(am.fecha_hora) >= ? AND DATE(am.fecha_hora) <= ?`;
        queryParams.push(fechaDesde, fechaHasta);
    }

    connection.query(query, queryParams, (error, results) => {
        if (error) {
            console.error(error); 
            return res.status(500).json({ error: 'Error al obtener auditorías de movimientos.' });
        } else {
            return res.status(200).json(results);
        }   
    });
}

module.exports = {
    getAuditoriasMovimiento
}