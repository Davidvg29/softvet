const {connection} = require('../config/bd/dataBase');


//mostrar todos los proveedores
const mostrarProveedores = (req, res) => {
    const sql = 'SELECT * FROM proveedores WHERE id_proveedor ';
    connection.query(sql, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al obtener proveedores' });
        }
        return res.json(results);
    });
};

//mostrar proveedor por id
const mostrarProveedoresId = (req, res) => {
    const { id } = req.params;
    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }
    connection.query('SELECT * FROM proveedores WHERE id_proveedor = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al obtener el proveedor' });
        }   
        if (results.length === 0) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }
        return res.json(results[0]);
    });
};

//crear nuevo proveedor
const crearProveedor = (req, res) => {
    const { nombre_proveedor, direccion_proveedor, celular_proveedor, mail_proveedor } = req.body;

    if (!nombre_proveedor || !direccion_proveedor || !celular_proveedor || !mail_proveedor) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const proveedorExisteQuery = 'SELECT * FROM proveedores WHERE nombre_proveedor = ?';
    connection.query(proveedorExisteQuery, [nombre_proveedor], (checkError, results) => {
        if (checkError) {
            console.error(checkError);
            return res.status(500).json({ error: 'Error al verificar proveedor existente' });
        }

        if (results.length > 0) {
            return res.status(409).json({ error: 'Ya existe un proveedor con ese nombre' });
        }

        const insertarProveedorQuery = `
            INSERT INTO proveedores (nombre_proveedor, direccion_proveedor, celular_proveedor, mail_proveedor, fecha_hora_alta_proveedor)
            VALUES (?, ?, ?, ?, now())
        `;
        const params = [nombre_proveedor.trim(), direccion_proveedor.trim(), celular_proveedor.trim(), mail_proveedor.trim()];

        connection.query(insertarProveedorQuery, params, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error al crear proveedor' });
            }
            return res.status(201).json({ message: 'Proveedor creado correctamente', id_proveedor: result.insertId });
        });
    });
};

//editar proveedor
const editarProveedor = (req, res) => {
    const { id } = req.params;
    const { nombre_proveedor, direccion_proveedor, celular_proveedor, mail_proveedor } = req.body;

    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    connection.query('SELECT * FROM proveedores WHERE id_proveedor = ?', [id], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al consultar proveedor' });
        }
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }

        const existing = rows[0];
        const newNombre = nombre_proveedor || existing.nombre_proveedor;
        const newDireccion = direccion_proveedor || existing.direccion_proveedor;
        const newCelular = celular_proveedor || existing.celular_proveedor;
        const newMail = mail_proveedor || existing.mail_proveedor;

        // Verificar si ya existe otro proveedor con el mismo correo
        const proveedorExisteQuery = 'SELECT * FROM proveedores WHERE nombre_proveedor = ? AND id_proveedor != ?';
        connection.query(proveedorExisteQuery, [newNombre, id], (checkError, dupRows) => {
            if (checkError) {
                console.error(checkError);
                return res.status(500).json({ error: 'Error al verificar duplicado' });
            }
            if (dupRows.length > 0) {
                return res.status(409).json({ error: 'Ya existe otro proveedor con ese nombre' });
            }

            const sql = `
                UPDATE proveedores 
                SET nombre_proveedor = ?, direccion_proveedor = ?, celular_proveedor = ?, mail_proveedor = ?
                WHERE id_proveedor = ?
            `;
            const params = [newNombre.trim(), newDireccion.trim(), newCelular.trim(), newMail.trim(), id];

            connection.query(sql, params, (updateError) => {
                if (updateError) {
                    console.error(updateError);
                    return res.status(500).json({ error: 'Error al actualizar proveedor' });
                }
                return res.json({ message: 'Proveedor actualizado correctamente' });
            });
        });
    });
};

const eliminarProveedor = (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    const eliminarProveedorQuery = 'DELETE FROM proveedores WHERE id_proveedor = ?';
    connection.query(eliminarProveedorQuery, [id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al eliminar proveedor' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }
        return res.json({ message: 'Proveedor eliminado correctamente' });
    });
};


module.exports = {
    mostrarProveedores,
    mostrarProveedoresId,
    crearProveedor,
    editarProveedor,
    eliminarProveedor
};  