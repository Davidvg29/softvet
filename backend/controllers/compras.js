const {connection} = require('../config/bd/dataBase');

// Mostrar todas las compras

const mostrarCompras = (req, res) => {
    const query = `
        SELECT 
            c.id_compra,
            c.fecha_hora AS fecha_compra,
            p.nombre_producto,
            dc.cantidad,
            dc.precio_unitario,
            pr.nombre_proveedor
        FROM compras c
        INNER JOIN detalles_compras dc ON c.id_compra = dc.id_compra
        INNER JOIN productos p ON dc.id_producto = p.id_producto
        INNER JOIN proveedor_productos pp ON p.id_producto = pp.id_producto
        INNER JOIN proveedores pr ON pp.id_proveedor = pr.id_proveedor
        WHERE c.is_active = TRUE
          AND p.is_active = TRUE
        ORDER BY c.fecha_hora DESC;
    `;

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener el listado de compras:', error);
            return res.status(500).json({ error: 'Error al obtener el listado de compras.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No hay compras registradas.' });
        }

        res.status(200).json(results);
    });
};

// Mostrar compras por ID de compra

const mostrarCompraPorId = (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM compras WHERE id_compra = ?', [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al obtener la compra.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Compra no encontrada.' });
        }
        res.json(results[0]);
    });
}

// Crear una nueva compra

const crearCompra = (req, res) => {
    const { total, fecha_hora, id_empleado } = req.body;

    if (!total || !fecha_hora || !id_empleado) {
        return res.status(400).json({ error: 'Faltan datos obligatorios.' });
    }

    const querycrearCompra = 'INSERT INTO compras (total, fecha_hora, id_empleado) VALUES (?, now(), ?)';

    connection.query(querycrearCompra, [total, id_empleado], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al crear la compra.' });
        }
        res.status(201).json({ message: 'Compra creada exitosamente.', id_compra: results.insertId });
    });
}

//Editar una compra

const editarCompra = (req, res) => {
    const { id } = req.params;
    const { total, fecha_hora, id_empleado } = req.body;

    const queryEditarCompra = 'UPDATE compras SET total = ?, fecha_hora = now(), id_empleado = ? WHERE id_compra = ?';

    connection.query(queryEditarCompra, [total, id_empleado, id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al actualizar la compra.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Compra no encontrada.' });
        }
        res.json({ message: 'Compra actualizada correctamente.' });
    });
}

// Eliminar una compra

const eliminarCompra = (req, res) => {
    const { id } = req.params;

    const queryEliminarCompra = 'UPDATE compras SET is_active = FALSE WHERE id_compra = ?';

    connection.query(queryEliminarCompra, [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al eliminar la compra.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Compra no encontrada.' });
        }
        res.json({ message: 'Compra eliminada correctamente.' });
    });
}


module.exports = {
    mostrarCompras,
    mostrarCompraPorId,
    crearCompra,
    editarCompra,
    eliminarCompra
};