const { connection } = require("../config/bd/dataBase");
const { validationsCrearDetallesVentas } = require("../validations/detallesVentas");

const verDetallesVentas = (req, res) => {
    const queryGetDetallesVentas = `select 
        detalles_ventas.id_detalle_venta, detalles_ventas.cantidad, detalles_ventas.precio_unitario, detalles_ventas.sub_total,
        ventas.id_venta, ventas.fecha_hora as fecha_hora_venta,
        productos.id_producto, productos.nombre_producto, productos.codigo_producto, productos.precio_producto as precio_producto_actual,
        clientes.id_cliente, clientes.nombre_cliente, clientes.dni_cliente,
        empleados.id_empleado, empleados.nombre_empleado
        from detalles_ventas
        left join ventas on ventas.id_venta = detalles_ventas.id_venta
        left join productos on detalles_ventas.id_producto = productos.id_producto
        left join clientes on ventas.id_cliente = clientes.id_cliente
        left join empleados on ventas.id_empleado = empleados.id_empleado
        ;`
    connection.query(queryGetDetallesVentas, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error en el servidor' });
        }else{
            return res.status(200).json(results);
        }
    })
}

const crearDetalleVenta = (req, res) => {
    const {cantidad, precio_unitario, sub_total, id_venta, id_producto} = req.body;
    const validation = validationsCrearDetallesVentas(req.body);
    if(validation !== null){
        return res.status(400).json({error: validation});
    }

    const queryCrearDetalleVenta = `insert into detalles_ventas (cantidad, precio_unitario, sub_total, id_venta, id_producto) values (?,?,?,?,?);`
    connection.query(queryCrearDetalleVenta, [cantidad, precio_unitario, sub_total, id_venta, id_producto], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al crear detalle de venta, verifique que exista venta y que exista el producto seleccionado.' });
        }else{
            const stockProducto = `select * from stock where id_producto = ?;`
            connection.query(stockProducto, [id_producto], (errorStock, resultsStock) => {
                if (errorStock) {
                    return res.status(500).json({ error: 'Error al actualizar el stock del producto.' });
                }else{
                    const nuevaCantidad = resultsStock[0].cantidad - cantidad;
                    const actualizarStock = `update stock set cantidad = ? where id_producto = ?;`
                    connection.query(actualizarStock, [nuevaCantidad, id_producto], (errorActualizarStock, resultsActualizarStock) => {
                        if (errorActualizarStock) {
                            return res.status(500).json({ error: 'Error al actualizar el stock del producto.' });
                        }
                    })
                }
            })
            return res.status(201).json('Detalle de venta creado correctamente.');
        }
    })
}

const editarDetalleVenta = (req, res) => {
    const id_detalle_venta = req.params.id;
    const {cantidad, precio_unitario, sub_total, id_venta, id_producto} = req.body;
    const validation = validationsCrearDetallesVentas(req.body);
    if(validation !== null){
        return res.status(400).json({error: validation});
    }

    const queryEditarDetalleVenta = `update detalles_ventas set cantidad = ?, precio_unitario = ?, sub_total = ?, id_venta = ?, id_producto = ? where id_detalle_venta = ?;`
    connection.query(queryEditarDetalleVenta, [cantidad, precio_unitario, sub_total, id_venta, id_producto, id_detalle_venta], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al crear detalle de venta, verifique que exista venta y que exista el producto seleccionado.' });
        }else{
            return res.status(201).json('Detalle de venta editado correctamente.');
        }
    })
}

const borrarDetalleVenta = (req, res) => {
    const id_detalle_venta = req.params.id;
    const queryBorrarDetalleVenta = `delete from detalles_ventas where id_detalle_venta = ?;`
    connection.query(queryBorrarDetalleVenta, [id_detalle_venta], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al borrar detalle de venta.' });
        }else{
            return res.status(200).json('Detalle de venta borrado correctamente.');
        }
    })
}


module.exports = { 
    verDetallesVentas,
    crearDetalleVenta,
    editarDetalleVenta,
    borrarDetalleVenta
};