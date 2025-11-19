const { connection } = require("../config/bd/dataBase");
const { validationsCrearVenta } = require("../validations/ventas");

const verVentas = (req, res) => {
    const queryGetVentas = `select 
        ventas.id_venta, ventas.fecha_hora, ventas.total, ventas.is_active,
        clientes.id_cliente, clientes.nombre_cliente, clientes.dni_cliente,
        empleados.nombre_empleado
        from ventas
        left join clientes on clientes.id_cliente = ventas.id_cliente
        left join empleados on empleados.id_empleado = ventas.id_empleado;`
    connection.query(queryGetVentas, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al obtener las ventas' });
        }else {
            return res.status(200).json(results);
        }
    })
}

const crearVenta = (req, res) => {
    const { total, id_cliente, id_empleado} = req.body;

    const validation = validationsCrearVenta({ total, id_cliente, id_empleado});
    if(validation !== null){
        return res.status(400).json({ error: validation });
    }

    const queryCreateVenta = `insert into ventas (fecha_hora, total, id_cliente, id_empleado) values (now(), ?, ?, ?);`
    connection.query(queryCreateVenta, [total, id_cliente, id_empleado], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al crear la venta' });
        }else {
            return res.status(201).json({
                message: 'Venta creada exitosamente',
                id_venta: results.insertId
            });
        }
    })  
}

const editarVenta = (req, res) => {
    const id_venta = req.params.id_venta;
    const { total, id_cliente, id_empleado} = req.body;

    const validation = validationsCrearVenta({ total, id_cliente, id_empleado});
    if(validation !== null){
        return res.status(400).json({ error: validation });
    }

const queryEditarVenta = `update ventas set total = ?, id_cliente = ?, id_empleado = ? where id_venta = ?;`
    connection.query(queryEditarVenta, [total, id_cliente, id_empleado, id_venta], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al editar la venta' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Venta no encontrada." });
        }
            return res.status(200).json('Venta editada exitosamente');
    })
}

const borrarVenta = (req, res) => {
    const id_venta = req.params.id_venta;
    const queryDeleteVenta = `update ventas set is_active = false where id_venta = ?;`
    connection.query(queryDeleteVenta, [id_venta], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al borrar la venta' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Venta no encontrada." });
        }
        return res.status(200).json('Venta borrada exitosamente');
    })
}

const activarVenta = (req, res) => {
    const id_venta = req.params.id_venta;
    const queryActivarVenta = `update ventas set is_active = true where id_venta = ?;`
    connection.query(queryActivarVenta, [id_venta], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al activar la venta' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Venta no encontrada." });
        }
        return res.status(200).json('Venta activada exitosamente');
    })
}

module.exports = {
    verVentas,
    crearVenta,
    editarVenta,
    borrarVenta,
    activarVenta
}