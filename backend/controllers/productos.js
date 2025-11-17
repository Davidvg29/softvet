const {connection} = require('../config/bd/dataBase');

//mostrar todos los productos
const mostrarProductos = (req, res) => {
    const sql = `
        SELECT p.*, c.nombre_categoria, stock.*, sucursales.*
        FROM productos p
        LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
        LEFT JOIN stock ON stock.id_producto = p.id_producto
        left join sucursales on sucursales.id_sucursal = stock.id_sucursal
        WHERE p.is_active = TRUE;
    `;
    connection.query(sql, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al obtener los productos' });
        }
        return res.json(results);
    });
};

//mostrar producto por id
const mostrarProductoPorId = (req, res) => {
    const { id } = req.params;

    connection.query('SELECT * FROM productos WHERE id_producto = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al obtener el producto' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        return res.json(results[0]);
    });
};

const crearProducto = (req, res) => {
    const { nombre_producto, codigo_producto, precio_producto, id_categoria } = req.body;

    // Validar campos obligatorios
    if (!nombre_producto || !codigo_producto || !precio_producto || !id_categoria) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Validar tipos
    if (typeof nombre_producto !== 'string' || typeof codigo_producto !== 'string' || isNaN(precio_producto) || isNaN(id_categoria)) {
        return res.status(400).json({ error: 'Datos inválidos: revisa los tipos de cada campo' });
    }

    // Normalizar datos
    const nombre = nombre_producto.trim();
    const codigo = codigo_producto.trim();
    const precio = parseFloat(precio_producto);

    // Validar duplicado de código
    const checkSql = 'SELECT * FROM productos WHERE codigo_producto = ?';
    connection.query(checkSql, [codigo], (dupErr, dupRows) => {
        if (dupErr) {
            console.error(dupErr);
            return res.status(500).json({ error: 'Error al verificar duplicados' });
        }
        if (dupRows.length > 0) {
            return res.status(409).json({ error: 'Ya existe un producto con ese código' });
        }

        // Insertar producto
        const insertSql = `
            INSERT INTO productos (nombre_producto, codigo_producto, precio_producto, id_categoria)
            VALUES (?, ?, ?, ?)
        `;
        connection.query(insertSql, [nombre, codigo, precio, id_categoria], (error, results) => {
            if (error) {
                console.error(error);
                if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === 'ER_NO_REFERENCED_ROW') {
                    return res.status(400).json({ error: 'La categoría referenciada no existe' });
                }
                return res.status(500).json({ error: 'Error al crear el producto' });
            }
            return res.status(201).json({ message: 'Producto creado correctamente', id_producto: results.insertId });
        });
    });
};

//editar producto
const editarProducto = (req, res) => {
    const { id } = req.params;
    const { nombre_producto, codigo_producto, precio_producto, id_categoria, is_active } = req.body;

    // Verificar que el producto exista
    const productoExisteQuery = 'SELECT * FROM productos WHERE id_producto = ?';
    connection.query(productoExisteQuery, [id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al verificar el producto' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Verificar que no exista otro producto con el mismo código
        const productoExisteQuery = 'SELECT * FROM productos WHERE codigo_producto = ? AND id_producto != ?';
        connection.query(productoExisteQuery, [codigo_producto, id], (error, duplicateResults) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error al verificar código de producto duplicado' });
            }

            if (duplicateResults.length > 0) {
                return res.status(400).json({ error: 'El código de producto ya está en uso por otro producto' });
            }

            // Actualizar el producto
            const actualizarProductoQuery = `
                UPDATE productos
                SET nombre_producto = ?, codigo_producto = ?, precio_producto = ?, id_categoria = ?, is_active = ?
                WHERE id_producto = ?
            `;
            connection.query(
                actualizarProductoQuery,
                [nombre_producto, codigo_producto, precio_producto, id_categoria, is_active, id],
                (error, results) => {
                    if (error) {
                        console.error(error);
                        return res.status(500).json({ error: 'Error al actualizar el producto' });
                    }

                    return res.json({ message: 'Producto actualizado correctamente' });
                }
            );
        });
    });
};

//eliminar producto (logico)

const eliminarProducto = (req, res) => {
    const { id } = req.params;

    connection.query('UPDATE productos SET is_active = FALSE WHERE id_producto = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al desactivar el producto' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        return res.json({ message: 'Producto desactivado correctamente' });
    });
};

module.exports = {
    mostrarProductos,
    mostrarProductoPorId,
    crearProducto,
    editarProducto,
    eliminarProducto
};