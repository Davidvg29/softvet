const { connection } = require("../config/bd/dataBase")

const getAuditoriasMovimiento = (req, res) => {
    connection.query(`
        select am.*, e.nombre_empleado, e.dni_empleado from auditorias_movimientos as am 
        left join empleados e on am.id_empleado = e.id_empleado;`, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al obtener auditorías de movimientos.' });
        }
        else {
            return res.status(200).json(results);
        }   
    })
}

module.exports = {
    getAuditoriasMovimiento
}