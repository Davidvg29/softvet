const { connection } = require('../config/bd/dataBase');

// mostrar detalles de compras

const mostrarDetallesCompras = (req, res) => {
    const mostrarDetallesComprasQuery = `
        SELECT dc.*, p.nombre_producto
        FROM detalles_compras dc
        INNER JOIN productos p ON dc.id_producto = p.id_producto
        INNER JOIN compras c ON dc.id_compra = c.id_compra
       
    `;
    connection.query(mostrarDetallesComprasQuery, (error, results) => {
        if (error) {
            console.error("Error al obtener detalles de compras:", error);
            return res.status(500).json({ error: "Error al obtener detalles de compras" });
        }
        return res.json(results);
    });
};

// mostrar detalles de compras por ID 
const mostrarDetalleCompraPorId = (req, res) => {
    const { id_detalle_compra } = req.params;
    const detalleCompraIdQuery = "SELECT * FROM detalles_compras WHERE id_detalle_compra = ?";
    connection.query(detalleCompraIdQuery, [id_detalle_compra], (error, results) => {
        if (error) {
            console.error("Error al obtener el detalle de compra:", error);
            return res.status(500).json({ error: "Error al obtener el detalle de compra" });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Detalle de compra no encontrado" });
        }
        return res.json(results[0]);
    });
};

// crear detalle de compra
const crearDetalleCompra = (req, res) => {
    const { cantidad, precio_unitario, sub_total, id_producto, id_compra } = req.body;

    // Validacióness 
    if (!cantidad || !precio_unitario || !sub_total || !id_producto || !id_compra) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }


    if (isNaN(cantidad) || cantidad <= 0) {
        return res.status(400).json({ error: "La cantidad debe ser un número mayor que 0" });
    }

    if (isNaN(precio_unitario) || precio_unitario <= 0) {
        return res.status(400).json({ error: "El precio unitario debe ser un número mayor que 0" });
    }

    if (isNaN(sub_total) || sub_total <= 0) {
        return res.status(400).json({ error: "El subtotal debe ser un número mayor que 0" });
    }

    if (isNaN(id_producto) || id_producto <= 0) {
        return res.status(400).json({ error: "El ID del producto debe ser un número válido" });
    }

    if (isNaN(id_compra) || id_compra <= 0) {
        return res.status(400).json({ error: "El ID de la compra debe ser un número válido" });
    }


    const crearDetalleCompraQuery = `
        INSERT INTO detalles_compras (cantidad, precio_unitario, sub_total, id_producto, id_compra)
        VALUES (?, ?, ?, ?, ?)
    `;
    connection.query(crearDetalleCompraQuery, [cantidad, precio_unitario, sub_total, id_producto, id_compra], (error, results) => {
        if (error) {
            console.error("Error al crear detalle de compra:", error);
            return res.status(500).json({ error: "Error al crear detalle de compra" });
        }
        return res.json({ message: "Detalle de compra creado correctamente", id: results.insertId });
    });
};

// editar detalle de compra

const editarDetalleCompra = (req, res) => {
    const { id_detalle_compra } = req.params;
    const { cantidad, precio_unitario, sub_total, id_producto, id_compra } = req.body;

    // Validacióness 
    if (!id_detalle_compra || isNaN(id_detalle_compra) || id_detalle_compra <= 0) {
        return res.status(400).json({ error: "ID de detalle inválido" });
    }

    if (!cantidad || !precio_unitario || !sub_total || !id_producto || !id_compra) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }


    if (isNaN(cantidad) || cantidad <= 0) {
        return res.status(400).json({ error: "La cantidad debe ser un número mayor que 0" });
    }

    if (isNaN(precio_unitario) || precio_unitario <= 0) {
        return res.status(400).json({ error: "El precio unitario debe ser un número mayor que 0" });
    }

    if (isNaN(sub_total) || sub_total <= 0) {
        return res.status(400).json({ error: "El subtotal debe ser un número mayor que 0" });
    }

    if (isNaN(id_producto) || id_producto <= 0) {
        return res.status(400).json({ error: "El ID del producto debe ser un número válido" });
    }

    if (isNaN(id_compra) || id_compra <= 0) {
        return res.status(400).json({ error: "El ID de la compra debe ser un número válido" });
    }

    const editarDetalleCompraQuery = `
        UPDATE detalles_compras
        SET cantidad = ?, precio_unitario = ?, sub_total = ?, id_producto = ?, id_compra = ?
        WHERE id_detalle_compra = ?
    `;
    connection.query(editarDetalleCompraQuery, [cantidad, precio_unitario, sub_total, id_producto, id_compra, id_detalle_compra], (error, results) => {
        if (error) {
            console.error("Error al actualizar detalle de compra:", error);
            return res.status(500).json({ error: "Error al actualizar detalle de compra" });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Detalle de compra no encontrado" });
        }
        return res.json({ message: "Detalle de compra actualizado correctamente" });
    });
};

// eliminar detalle de compra 

const eliminarDetalleCompra = (req, res) => {
    const { id_detalle_compra } = req.params;

    if (!id_detalle_compra || isNaN(id_detalle_compra) || id_detalle_compra <= 0) {
        return res.status(400).json({ error: "ID de detalle inválido" });
    }

    const eliminarDetalleCompraQuery = "DELETE FROM detalles_compras WHERE id_detalle_compra = ?";
    connection.query(eliminarDetalleCompraQuery, [id_detalle_compra], (error, results) => {
        if (error) {
            console.error("Error al eliminar detalle de compra:", error);
            return res.status(500).json({ error: "Error al eliminar detalle de compra" });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Detalle de compra no encontrado" });
        }
        return res.json({ message: "Detalle de compra eliminado correctamente" });
    });
};


module.exports = {
    mostrarDetallesCompras,
    mostrarDetalleCompraPorId,
    crearDetalleCompra,
    editarDetalleCompra,
    eliminarDetalleCompra
};