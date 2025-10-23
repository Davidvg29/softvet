const { connection } = require("../config/bd/dataBase");
const { validationsCrearStock } = require("../validations/stock");

const verStock = (req, res) => {
    const queryGetStock = `select 
        stock.id_stock, stock.cantidad, stock.fecha_ingreso, stock.observaciones_stock, 
        productos.id_producto, productos.nombre_producto, productos.codigo_producto, productos.precio_producto, productos.is_active as producto_is_active,
        categorias.nombre_categoria,
        sucursales.id_sucursal, sucursales.nombre_sucursal, sucursales.direccion_sucursal, sucursales.celular_sucursal, sucursales.is_active as sucursal_is_active
        from stock
        left join productos on productos.id_producto = stock.id_producto
        left join categorias on productos.id_categoria = categorias.id_categoria
        left join sucursales on stock.id_sucursal = sucursales.id_sucursal;`
    connection.query(queryGetStock, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al obtener el stock' });
        }else {
            return  res.status(200).json(results);
        }
    })
}

const crearStock = (req, res) => {
    const { cantidad, fecha_ingreso, observaciones_stock,  id_producto, id_sucursal} = req.body;

    const validation = validationsCrearStock(req.body);
    if(validation !== null){
        return res.status(400).json({ error: validation });
    }

    const queryInsertStock = `insert into stock (cantidad, fecha_ingreso, observaciones_stock, id_producto, id_sucursal) values (?, NOW(), ?, ?, ?);`
    connection.query(queryInsertStock, [cantidad, observaciones_stock, id_producto, id_sucursal], (error, results) => {
        if (error) {
            console.log(error);
            
            return res.status(500).json({ error: 'Error al crear el stock' });
        }else {
            return  res.status(201).json('Stock creado correctamente');
        }
    })
}

const editarStock = (req, res) => {
    const id_stock = req.params.id_stock;
    const { cantidad, fecha_ingreso, observaciones_stock,  id_producto, id_sucursal} = req.body;

    const validation = validationsCrearStock(req.body);
    if(validation !== null){
        return res.status(400).json({ error: validation });
    }

    const queryUpdateStock = `update stock set cantidad = ?, observaciones_stock = ?, id_producto = ?, id_sucursal = ? where id_stock = ?;`
    connection.query(queryUpdateStock, [cantidad, observaciones_stock, id_producto, id_sucursal, id_stock], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: 'Error al editar el stock' });
        }else {
            return  res.status(200).json('Stock editado correctamente');
        }
    })
}

const eliminarStock = (req, res) => {
    const id_stock = req.params.id_stock;
    const queryDeleteStock = `delete from stock where id_stock = ?;`
    connection.query(queryDeleteStock, [id_stock], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: 'Error al eliminar el stock' });
        }else {
            return  res.status(200).json('Stock eliminado correctamente');
        }
    })
}

module.exports = {
    verStock,
    crearStock,
    editarStock,
    eliminarStock
}