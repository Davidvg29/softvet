const { connection } = require("../config/bd/dataBase");
const { validationsCrearStock } = require("../validations/stock");

const verStock = (req, res) => {
    const queryGetStock = `
        SELECT 
            productos.id_producto, 
            productos.nombre_producto, 
            productos.codigo_producto, 
            productos.precio_producto, 
            productos.is_active AS producto_is_active,

            stock.id_stock, 
            stock.cantidad, 
            stock.fecha_ingreso, 
            stock.observaciones_stock, 

            categorias.nombre_categoria,

            sucursales.id_sucursal, 
            sucursales.nombre_sucursal, 
            sucursales.direccion_sucursal, 
            sucursales.celular_sucursal, 
            sucursales.is_active AS sucursal_is_active

        FROM productos
        LEFT JOIN stock ON productos.id_producto = stock.id_producto
        LEFT JOIN categorias ON productos.id_categoria = categorias.id_categoria
        LEFT JOIN sucursales ON stock.id_sucursal = sucursales.id_sucursal

        WHERE productos.is_active = 1
          AND (sucursales.is_active = 1 OR sucursales.is_active IS NULL);
    `;

    connection.query(queryGetStock, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al obtener el stock' });
        } else {
            return res.status(200).json(results);
        }
    });
};



const crearStock = (req, res) => {
  const { cantidad, fecha_ingreso, observaciones_stock, id_producto, id_sucursal } = req.body;

  const validation = validationsCrearStock(req.body);
  if (validation !== null) {
    return res.status(400).json({ error: validation });
  }

  
  const querySelect = `
    SELECT id_stock, cantidad 
    FROM stock 
    WHERE id_producto = ? AND id_sucursal = ?
  `;

  connection.query(querySelect, [id_producto, id_sucursal], (selectErr, rows) => {
    if (selectErr) {
      console.log(selectErr);
      return res.status(500).json({ error: "Error al buscar el stock existente" });
    }

    if (rows.length > 0) {
      const stockActual = rows[0].cantidad;
      const nuevaCantidad = stockActual + Number(cantidad); // o Number(cantidad) si querés reemplazar

      const queryUpdate = `
        UPDATE stock
        SET cantidad = ?, 
            fecha_ingreso = NOW(),
            observaciones_stock = ?
        WHERE id_stock = ?
      `;

      connection.query(
        queryUpdate,
        [nuevaCantidad, observaciones_stock || null, rows[0].id_stock],
        (updateErr) => {
          if (updateErr) {
            console.log(updateErr);
            return res.status(500).json({ error: "Error al actualizar el stock" });
          }

          return res.status(200).json({
            message: "Stock actualizado correctamente",
            cantidad: nuevaCantidad,
          });
        }
      );
    } else {
      // 🔹 Si NO hay stock todavía → INSERT normal (primer registro)
      const queryInsertStock = `
        INSERT INTO stock (cantidad, fecha_ingreso, observaciones_stock, id_producto, id_sucursal)
        VALUES (?, NOW(), ?, ?, ?)
      `;
      connection.query(
        queryInsertStock,
        [cantidad, observaciones_stock, id_producto, id_sucursal],
        (insertErr, results) => {
          if (insertErr) {
            console.log(insertErr);
            return res.status(500).json({ error: "Error al crear el stock" });
          } else {
            return res.status(201).json("Stock creado correctamente");
          }
        }
      );
    }
  });
};

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

const verStockPorProducto = (req, res) => {
  const { id_producto } = req.params;

  const query = `
    SELECT 
      p.id_producto,
      p.nombre_producto,
      p.codigo_producto,
      p.precio_producto,
      p.id_categoria,
      c.nombre_categoria,

      COALESCE(SUM(s.cantidad), 0) AS cantidad_total,
      MAX(s.fecha_ingreso) AS fecha_ultimo_ingreso,

      -- 🟣 Última observación de stock (del último movimiento)
      (
        SELECT s2.observaciones_stock
        FROM stock s2
        WHERE s2.id_producto = p.id_producto
        ORDER BY s2.fecha_ingreso DESC
        LIMIT 1
      ) AS observaciones_stock

    FROM productos p
    LEFT JOIN stock s ON p.id_producto = s.id_producto
    LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
    WHERE p.id_producto = ?
    GROUP BY 
      p.id_producto,
      p.nombre_producto,
      p.codigo_producto,
      p.precio_producto,
      p.id_categoria,
      c.nombre_categoria;
  `;

  connection.query(query, [id_producto], (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: 'Error al obtener el stock del producto' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    return res.status(200).json(results[0]); 
  });
};

const verStockPorID = (req, res) => {
    const id_stock = req.params.id_stock;

    const query = `
        SELECT 
            s.id_stock,
            s.cantidad,
            s.observaciones_stock,
            s.id_producto,
            s.id_sucursal,
            p.nombre_producto,
            p.codigo_producto
        FROM stock s
        LEFT JOIN productos p ON s.id_producto = p.id_producto
        WHERE s.id_stock = ?;
    `;

    connection.query(query, [id_stock], (error, results) => {
        if (error) {
            return res.status(500).json({ error: "Error al obtener el stock" });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Stock no encontrado" });
        }

        res.status(200).json(results[0]);
    });
};



module.exports = {
    verStock,
    crearStock,
    editarStock,
    eliminarStock,
    verStockPorProducto,
    verStockPorID
}