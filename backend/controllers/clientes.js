const { connection } = require('../config/bd/dataBase');
const nodemailer = require("nodemailer");

// Obtener todos los clientes
const mostrarClientes = (req, res) => {
    // 1. Recibir parámetros (con valores por defecto por si no llegan)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || '';
    
    // 2. Calcular el Offset
    const offset = (page - 1) * limit;

    // 3. Preparar la consulta base y los parámetros dinámicos
    // CORRECCIÓN AQUÍ: Agregamos "WHERE 1=1" para poder concatenar "AND" sin romper el SQL
    let baseQuery = 'FROM clientes WHERE 1=1'; 
    let queryParams = [];

    // Si hay texto en el buscador, agregamos la condición LIKE
    if (search) {
        baseQuery += ' AND (LOWER(nombre_cliente) LIKE ? OR dni_cliente LIKE ?)';
        const searchParam = `%${search.toLowerCase()}%`;
        queryParams.push(searchParam, searchParam);
    }

    // 4. Primera consulta: Saber cuántos registros totales hay (para calcular totalPaginas)
    const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;
    
    connection.query(countQuery, queryParams, (errorCount, resultsCount) => {
        if (errorCount) {
            return res.status(500).json({ error: 'Error al contar los clientes.' });
        }

        const totalItems = resultsCount[0].total;
        const totalPages = Math.ceil(totalItems / limit);

        // 5. Segunda consulta: Traer solo el tramo de datos solicitado
        // CAMBIO PRINCIPAL AQUÍ: Agregamos "is_active DESC" antes del id_cliente
        const dataQuery = `SELECT * ${baseQuery} ORDER BY is_active DESC, id_cliente DESC LIMIT ? OFFSET ?`;
        const dataParams = [...queryParams, limit, offset]; // Agregamos limit y offset al final

        connection.query(dataQuery, dataParams, (errorData, resultsData) => {
            if (errorData) {
                return res.status(500).json({ error: 'Error al obtener los clientes.' });
            }

            // 6. Devolvemos un objeto con los datos y la metadata de paginación
            res.json({
                data: resultsData,
                pagination: {
                    totalItems,
                    totalPages,
                    currentPage: page
                }
            });
        });
    });
}

// Asegúrate de exportarlo como lo hacías antes

// Obtener un cliente por ID
const mostrarClientePorId = (req, res) => {

    const { id } = req.params;
    connection.query('SELECT * FROM clientes WHERE id_cliente = ?', [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al obtener el cliente.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado.' });
        }
        res.json(results[0]);
    });
}

// Agregar un nuevo cliente
const crearCliente = (req, res) => {
    const { id_empleado, nombre_cliente, dni_cliente, direccion_cliente, celular_cliente, mail_cliente } = req.body;
    
    if (!nombre_cliente || !dni_cliente || !direccion_cliente || !celular_cliente || !mail_cliente) {
        return res.status(400).json({ error: 'Faltan datos obligatorios.' });
    }

    const validacion = 'SELECT * FROM clientes WHERE dni_cliente = ?';
    connection.query(validacion, [dni_cliente], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al verificar duplicados', detalle: error.message });
        }
        if (results.length > 0) {
            const datosDuplicados = [];
            results.forEach(result => {
                if (result.dni_cliente === dni_cliente) datosDuplicados.push('DNI');
            });
            return res.status(400).json({
                error: 'Datos duplicados',
                detalle: `Ya existe un cliente con el mismo: ${datosDuplicados.join(', ')}`
            });
        }

        const nuevoCliente = { nombre_cliente, dni_cliente, direccion_cliente, celular_cliente, mail_cliente };
        connection.query('INSERT INTO clientes SET ?', nuevoCliente, (error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Error al crear el Cliente', detalle: error.message });
            }
            res.status(201).json({ message: 'Cliente creado exitosamente.', id_cliente: results.insertId });
            connection.query(`
                INSERT INTO auditorias_movimientos (id_empleado, modulo, accion, descripcion) 
                VALUES (?, 'Clientes', 'CREAR', ?);`, 
                [id_empleado, `Se creó el cliente ${nombre_cliente} (DNI: ${dni_cliente})`], 
                (errorAuditoria) => {
                    if (errorAuditoria) {
                        console.error("Error al registrar auditoría:", errorAuditoria);
                    }
                })
        });
    });
}

// Editar un cliente
const editarCliente = (req, res) => {
    const { id } = req.params;
    const { id_empleado, nombre_cliente, dni_cliente, direccion_cliente, celular_cliente, mail_cliente } = req.body;

    const validacion = 'SELECT * FROM clientes WHERE dni_cliente = ? AND id_cliente != ?';
    connection.query(validacion, [dni_cliente, id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al verificar duplicados', detalle: error.message });
        }
        if (results.length > 0) {
            const datosDuplicados = [];
            results.forEach(result => {
                if (result.dni_cliente === dni_cliente) datosDuplicados.push('DNI');
            });
            return res.status(400).json({
                error: 'Datos duplicados',
                detalle: `Ya existe un cliente con el mismo: ${datosDuplicados.join(', ')}`
            });
        }

        const clienteActualizado = { nombre_cliente, dni_cliente, direccion_cliente, celular_cliente, mail_cliente };
        connection.query('UPDATE clientes SET ? WHERE id_cliente = ?', [clienteActualizado, id], (error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Error al actualizar el cliente.' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Cliente no encontrado.' });
            }
            res.json({ message: 'Cliente actualizado correctamente.' });
            connection.query(`
                INSERT INTO auditorias_movimientos (id_empleado, modulo, accion, descripcion) 
                VALUES (?, 'Clientes', 'ACTUALIZAR', ?);`, 
                [id_empleado, `Se actualizo el cliente Nº ${id} (DNI: ${dni_cliente})`], 
                (errorAuditoria) => {
                    if (errorAuditoria) {
                        console.error("Error al registrar auditoría:", errorAuditoria);
                    }
                })
        });
    });
}

// Eliminar un cliente
const eliminarCliente = (req, res) => {
    const { id, id_empleado } = req.params;
    connection.query('UPDATE clientes SET is_active = FALSE WHERE id_cliente = ?', [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al eliminar el cliente.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado.' });
        }
        res.json({ message: 'Cliente eliminado correctamente.' });
        connection.query(`
                INSERT INTO auditorias_movimientos (id_empleado, modulo, accion, descripcion) 
                VALUES (?, 'Clientes', 'ELIMINAR', ?);`, 
                [id_empleado, `Se eliminó el cliente Nº ${id} `], 
                (errorAuditoria) => {
                    if (errorAuditoria) {
                        console.error("Error al registrar auditoría:", errorAuditoria);
                    }
                })
    });
}

const activarCliente = (req, res) => {
    const { id } = req.params;
    const { id_empleado } = req.body; // Lo tomamos del body para mantener la consistencia con el frontend

    // Cambiamos is_active a TRUE
    connection.query('UPDATE clientes SET is_active = TRUE WHERE id_cliente = ?', [id], (error, results) => {
        if (error) {
            console.error("Error al activar cliente:", error);
            return res.status(500).json({ error: 'Error al activar el cliente.' });
        }
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado.' });
        }
        
        // Respuesta exitosa al cliente
        res.json({ message: 'Cliente activado correctamente.' });
        
        // Registro en la tabla de auditoría
        connection.query(`
                INSERT INTO auditorias_movimientos (id_empleado, modulo, accion, descripcion) 
                VALUES (?, 'Clientes', 'ACTIVAR', ?);`, 
                [id_empleado, `Se activó el cliente Nº ${id}`], 
                (errorAuditoria) => {
                    if (errorAuditoria) {
                        console.error("Error al registrar auditoría:", errorAuditoria);
                    }
                }
        );
    });
};

module.exports = { activarCliente }; // Asegúrate de exportarlo

// Buscar clientes por nombre o DNI
const buscarClientes = (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.json([]);
    }

    const sql = `
        SELECT * 
        FROM clientes 
        WHERE is_active = TRUE 
        AND (
            nombre_cliente LIKE ? 
            OR dni_cliente LIKE ?
        ) 
        LIMIT 20
    `;

    const busqueda = `%${query}%`;

    connection.query(sql, [busqueda, busqueda], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error en la búsqueda de clientes.' });
        }
        res.json(results);
    });
};

const contactarFormLanding =async(req, res)=>{
    const { email, nombre, telefono, mensaje } = req.body

    if (!email || !nombre || !mensaje) {
        return res.status(400).json('Faltan campos obligatorios.');
    }

    try {
        
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "soporte.softvet@gmail.com",
                pass: "isqghcuqioxqmenm", 
            },
        });
    
        const info = await transporter.sendMail({
            from: `"Landing Softvet" <soporte.softvet@gmail.com>`, // Quién lo envía (tu sistema)
            to: "soporte.softvet@gmail.com", // A quién le llega (tú mismo)
            replyTo: email, // A dónde se responde al darle "Responder" en Gmail
            subject: `Nuevo contacto de: ${nombre}`,
            text: `Hola Equipo Softvet,\n\nHas recibido un nuevo mensaje desde la landing page.\n\nDatos del contacto:\n- Nombre: ${nombre}\n- Correo: ${email}\n- Teléfono: ${telefono || 'No provisto'}\n\nMensaje:\n${mensaje}`,
            html: `
            <h2>Nuevo mensaje de contacto</h2>
            <ul>
                <li><strong>Nombre:</strong> ${nombre}</li>
                <li><strong>Correo:</strong> ${email}</li>
                <li><strong>Teléfono:</strong> ${telefono || 'No provisto'}</li>
            </ul>
            <p><strong>Mensaje del cliente:</strong></p>
            <p>${mensaje}</p>
            `,
        });
    
    return res.status(200).json('Mensaje enviado con exito.');

    } catch (error) {
        console.log(error);
        
        return res.status(500).json('Ocurrio un error al enviar el mensaje.');
    }
    
}


module.exports = {
    mostrarClientes,
    mostrarClientePorId,
    crearCliente,
    editarCliente,
    eliminarCliente,
    buscarClientes,
    contactarFormLanding,
    activarCliente
};