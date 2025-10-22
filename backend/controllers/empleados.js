const { connection } = require('../config/bd/dataBase');

// Obtener todos los empleados
const mostrarEmpleados = (req, res) => {

    connection.query(`
        SELECT e.*, r.nombre_rol AS rol 
        FROM empleados e
        LEFT JOIN roles r ON e.id_rol = r.id_rol`, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al obtener los empleados.' });
        }
        res.json(results);
    });
}

// Obtener un empleado por ID
const mostrarEmpleadoPorId = (req, res) => {

    const { id } = req.params;
    connection.query(`
        SELECT e.*, r.nombre_rol AS rol
        FROM empleados e
        LEFT JOIN roles r ON e.id_rol = r.id_rol
        WHERE e.id_empleado = ?
`, [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al obtener el empleado.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Empleado no encontrado.' });
        }
        res.json(results[0]);
    });
}

// Agregar un nuevo empleado
const crearEmpleado = (req, res) => {

    const { usuario, contrasena, nombre_empleado, dni_empleado, direccion_empleado, telefono_empleado, mail_empleado,id_rol } = req.body;
        if (!usuario || !contrasena || !nombre_empleado || !dni_empleado || !direccion_empleado || !telefono_empleado || !mail_empleado || !id_rol) {
             return res.status(400).json({ error: 'Faltan datos obligatorios.' });
        }
    const validacion = 'SELECT * FROM empleados WHERE dni_empleado = ? OR usuario = ? OR mail_empleado = ?';
    connection.query(validacion, [dni_empleado, usuario, mail_empleado], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al verificar duplicados', detalle: error.message });
        }

    if (results.length > 0) {
            const datosDuplicados = [];
            results.forEach(result => {
                if (result.dni_empleado === dni_empleado) datosDuplicados.push('DNI');
                if (result.usuario === usuario) datosDuplicados.push('Usuario');
                if (result.mail_empleado === mail_empleado) datosDuplicados.push('Email');
            });
            return res.status(400).json({ 
                error: 'Datos duplicados', 
                detalle: `Ya existe un empleado con el mismo: ${datosDuplicados.join(', ')}` 
            });
        }


    const nuevoEmpleado = { usuario, contrasena, nombre_empleado, dni_empleado, direccion_empleado, telefono_empleado, mail_empleado,id_rol };
    connection.query('INSERT INTO empleados SET ?', nuevoEmpleado, (error, results) => {
        if (error) {
                return res.status(500).json({ error: 'Error al crear el Empleado', detalle: error.message });
            }
            res.json({ message: 'Empleado creado correctamente' });
    });
    });
}

// Editar un empleado
const editarEmpleado = (req, res) => {
    const { id } = req.params;
    const { usuario, contrasena, nombre_empleado, dni_empleado, direccion_empleado, telefono_empleado, mail_empleado,id_rol } = req.body;

    const validacion = 'SELECT * FROM empleados WHERE (dni_empleado = ? OR usuario = ? OR mail_empleado = ?) AND id_empleado != ?';
    connection.query(validacion, [dni_empleado, usuario, mail_empleado, id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al verificar duplicados', detalle: error.message });
        }
        if (results.length > 0) {
            const datosDuplicados = [];
            results.forEach(result => {
                if (result.dni_empleado === dni_empleado) datosDuplicados.push('DNI');
                if (result.usuario === usuario) datosDuplicados.push('Usuario');
                if (result.mail_empleado === mail_empleado) datosDuplicados.push('Email');
            });
            return res.status(400).json({
                error: 'Datos duplicados',
                detalle: `Ya existe un empleado con el mismo: ${datosDuplicados.join(', ')}`
            });
        }

        
    const empleadoActualizado = { usuario, contrasena, nombre_empleado, dni_empleado, direccion_empleado, telefono_empleado, mail_empleado,id_rol };
    connection.query('UPDATE empleados SET ? WHERE id_empleado = ?', [empleadoActualizado, id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al actualizar el empleado.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Empleado no encontrado.' });
        }
        res.json({ message: 'Empleado actualizado correctamente.' });
    });
    });
}

// Eliminar un empleado
const eliminarEmpleado = (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM empleados WHERE id_empleado = ?', [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al eliminar el empleado.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Empleado no encontrado.' });
        }
        res.json({ message: 'Empleado eliminado correctamente.' });
    });
}

module.exports = {
    mostrarEmpleados,
    mostrarEmpleadoPorId,
    crearEmpleado,
    editarEmpleado,
    eliminarEmpleado
};
