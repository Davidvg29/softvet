const {connection} = require('../config/bd/dataBase');

// Obtener todos los clientes
const mostrarClientes = (req, res) => {

    connection.query('SELECT * FROM clientes', (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al obtener los clientes.' });
        }
        res.json(results);
    });
}

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
    const { nombre_cliente, dni_cliente, direccion_cliente, celular_cliente, mail_cliente } = req.body;
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
        });
    });
}

// Editar un cliente
const editarCliente = (req, res) => {
    const { id } = req.params;
    const { nombre_cliente, dni_cliente, direccion_cliente, celular_cliente, mail_cliente } = req.body;

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
    });
    });
}

// Eliminar un cliente
const eliminarCliente = (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM clientes WHERE id_cliente = ?', [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al eliminar el cliente.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado.' });
        }
        res.json({ message: 'Cliente eliminado correctamente.' });
    });
}

module.exports = {
    mostrarClientes,
    mostrarClientePorId,
    crearCliente,
    editarCliente,
    eliminarCliente
};