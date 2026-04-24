const {connection} = require('../config/bd/dataBase');

//mostrar todos los productos
const mostrarProductos = (req, res) => {
    const sql = `
        SELECT 
      p.id_producto,                             
      p.nombre_producto,
      p.codigo_producto,
      p.precio_producto,
      p.is_active AS producto_is_active,
      p.id_categoria,
      c.nombre_categoria,

      stock.id_stock,
      stock.cantidad,
      stock.fecha_ingreso,
      stock.observaciones_stock,
      stock.id_producto AS stock_id_producto,    

      sucursales.id_sucursal,
      sucursales.nombre_sucursal,
      sucursales.direccion_sucursal,
      sucursales.celular_sucursal,
      sucursales.is_active AS sucursal_is_active
    FROM productos p
    LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
    LEFT JOIN stock ON stock.id_producto = p.id_producto
    LEFT JOIN sucursales ON sucursales.id_sucursal = stock.id_sucursal
    order by p.is_active desc;
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
  const { nombre_producto, codigo_producto, precio_producto, id_categoria, id_empleado } = req.body;

  // Validar campos obligatorios
  if (!nombre_producto || !codigo_producto || !precio_producto || !id_categoria) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  // Validar tipos
  if (
    typeof nombre_producto !== 'string' ||
    typeof codigo_producto !== 'string' ||
    isNaN(precio_producto) ||
    isNaN(id_categoria)
  ) {
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

      // 🔹 ID del producto recién creado
      const id_producto = results.insertId;

      // 🔹 Crear el stock inicial = 0 para ese producto
      const insertStockSql = `
        INSERT INTO stock (id_producto, cantidad, id_sucursal)
        VALUES (?, 0, 1)
      `;

      connection.query(insertStockSql, [id_producto], (stockErr) => {
        if (stockErr) {
          console.error('Error al crear el stock inicial:', stockErr);
          return res.status(500).json({
            error: 'Producto creado, pero hubo un problema al crear el stock inicial',
            id_producto,
          });
        }

        return res.status(201).json({
          message: 'Producto creado correctamente con stock inicial 0',
          id_producto,
        });
      });
      connection.query(`
                INSERT INTO auditorias_movimientos (id_empleado, modulo, accion, descripcion) 
                VALUES (?, 'Productos', 'CREAR', ?);`, 
                [id_empleado, `Se creo el producto N° ${results.insertId} con el nombre ${nombre}`], 
                (errorAuditoria) => {
                    if (errorAuditoria) {
                        console.error("Error al registrar auditoría:", errorAuditoria);
                    }
                })
    });
  });
};

//editar producto
const editarProducto = (req, res) => {
    const { id } = req.params;
    const { nombre_producto, codigo_producto, precio_producto, id_categoria, is_active, id_empleado } = req.body;
    console.log(req.body);
    

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

                    res.json({ message: 'Producto actualizado correctamente' });
                    connection.query(`
                INSERT INTO auditorias_movimientos (id_empleado, modulo, accion, descripcion) 
                VALUES (?, 'Productos', 'ACTUALIZAR', ?);`, 
                [id_empleado, `Se actualizo el producto N° ${id}`], 
                (errorAuditoria) => {
                    if (errorAuditoria) {
                        console.error("Error al registrar auditoría:", errorAuditoria);
                    }
                })
                }
            );
        });
    });
};

//eliminar producto (logico)

const eliminarProducto = (req, res) => {
    const { id } = req.params;
    const { id_empleado } = req.body;

    connection.query('UPDATE productos SET is_active = FALSE WHERE id_producto = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al desactivar el producto' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto desactivado correctamente' });
        connection.query(`
                INSERT INTO auditorias_movimientos (id_empleado, modulo, accion, descripcion) 
                VALUES (?, 'Productos', 'DESACTIVAR', ?);`, 
                [id_empleado, `Se desactivo el producto N° ${id}`], 
                (errorAuditoria) => {
                    if (errorAuditoria) {
                        console.error("Error al registrar auditoría:", errorAuditoria);
                    }
                })
    });
};

const activarProducto = (req, res) => {
    const { id } = req.params;
    const { id_empleado } = req.body;

    // Cambiamos is_active a TRUE
    connection.query('UPDATE productos SET is_active = TRUE WHERE id_producto = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al activar el producto' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Respuesta exitosa al cliente
        res.json({ message: 'Producto activado correctamente' });

        // Registro en la tabla de auditoría
        connection.query(`
                INSERT INTO auditorias_movimientos (id_empleado, modulo, accion, descripcion) 
                VALUES (?, 'Productos', 'ACTIVAR', ?);`, 
                [id_empleado, `Se activó el producto N° ${id}`], 
                (errorAuditoria) => {
                    if (errorAuditoria) {
                        console.error("Error al registrar auditoría:", errorAuditoria);
                    }
                });
    });
};

module.exports = {
    mostrarProductos,
    mostrarProductoPorId,
    crearProducto,
    editarProducto,
    eliminarProducto,
    activarProducto
};