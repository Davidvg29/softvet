const { connection } = require('../config/bd/dataBase');
const { createToken } = require('../middlewares/jwt');
const { encriptarContraseña, compararContraseña } = require('../service/bcrypt');

const logout = (req, res)=>{
    res.clearCookie("TOKEN_AUTH_SOFTVET", {
        path: "/",
        secure: false,  
        httpOnly: true,
        sameSite: 'strict',
    });
    res.status(200).json("Sesion cerrada con exito")
}


const autenticarEmpleado = (req, res) => {
    const { usuario, contrasena } = req.body;
    if (!usuario || !contrasena) {
        return res.status(400).json({ error: 'Faltan datos obligatorios.' });
    }
    const queryGetEmpleado = `SELECT 
        empleados.usuario,
        empleados.contrasena,
        roles.nombre_rol
        FROM empleados
        left join roles on roles.id_rol = empleados.id_rol
        WHERE empleados.usuario = ? AND empleados.is_active = TRUE;`;
    // const queryGetEmpleado = `SELECT 
    //     empleados.id_empleado,
    //     empleados.usuario,
    //     empleados.contrasena,
    //     empleados.nombre_empleado,
    //     empleados.dni_empleado,
    //     empleados.direccion_empleado,
    //     empleados.telefono_empleado,
    //     empleados.mail_empleado,
    //     roles.nombre_rol
    //     FROM empleados
    //     left join roles on roles.id_rol = empleados.id_rol
    //     WHERE empleados.usuario = ? AND empleados.is_active = TRUE;
    //     `;
    connection.query(queryGetEmpleado, [usuario], async (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al autenticar el empleado' });
        }
        if (results.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado o inactivo.' });
        }
            compararContraseña(contrasena, results[0]?.contrasena)
            .then((isMatch)=>{
                if(!isMatch){
                    return  res.status(401).json({ error: 'Credenciales inválidas.' });
                }
                const { usuario, nombre_rol } = results[0];

                const token = createToken({usuario, nombre_rol});

                res.cookie('TOKEN_AUTH_SOFTVET', token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'strict',
                    maxAge: 3600000, //1 hora
                    path: '/'
                });

                return res.status(200).json({ message: 'Usuario autenticado correctamente.', empleado: { usuario, nombre_rol, token } });
            })
            .catch((error)=>{
                return res.status(500).json({ error: 'Error al autenticar el empleado.', detalle: error.message });
            })
    })
}

const obtenerInfoEmpleadoAutenticado = (req, res) => {
    const usuario = req.empleado_softvet.usuario;
    
    const queryGetInfoEmpleado = `SELECT e.id_empleado, e.usuario, e.nombre_empleado, e.dni_empleado, e.direccion_empleado, e.telefono_empleado, e.mail_empleado, r.nombre_rol
        FROM empleados e
        LEFT JOIN roles r ON e.id_rol = r.id_rol
        where e.usuario = ?`
    connection.query(queryGetInfoEmpleado, [usuario], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al obtener la información del empleado.' });
        }
        return res.status(200).json({ empleado: results[0] });    
    })
}

// Obtener todos los empleados
const mostrarEmpleados = (req, res) => {

    connection.query(`
        SELECT e.id_empleado, e.usuario, e.nombre_empleado, e.dni_empleado, e.direccion_empleado, e.telefono_empleado, e.mail_empleado, r.nombre_rol
        FROM empleados e
        LEFT JOIN roles r ON e.id_rol = r.id_rol
        WHERE e.is_active = TRUE`, (error, results) => {
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
        SELECT e.id_empleado, e.usuario, e.nombre_empleado, e.dni_empleado, e.direccion_empleado, e.telefono_empleado, e.mail_empleado, r.nombre_rol
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
console.log("asd");

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

    encriptarContraseña(contrasena)
    .then((contrasenaEncriptada)=>{
        const nuevoEmpleado = { usuario, contrasena:contrasenaEncriptada, nombre_empleado, dni_empleado, direccion_empleado, telefono_empleado, mail_empleado,id_rol };
        connection.query('INSERT INTO empleados SET ?', nuevoEmpleado, (error, results) => {
            if (error) {
                    return res.status(500).json({ error: 'Error al crear el Empleado', detalle: error.message });
                }
                res.json({ message: 'Empleado creado correctamente' });
        });
    })
    .catch((error)=>{
        return res.status(500).json({ error: 'Error al crear el Empleado', detalle: error.message });
    })
    });
}

// Editar un empleado
const editarEmpleado = (req, res) => {
    const { id } = req.params;
    const { usuario, contrasena, nombre_empleado, dni_empleado, direccion_empleado, telefono_empleado, mail_empleado, id_rol } = req.body;

    // Validar duplicados
    const validacion = `
        SELECT * FROM empleados 
        WHERE (dni_empleado = ? OR usuario = ? OR mail_empleado = ?) 
        AND id_empleado != ?
    `;
    
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

        // Encriptar contraseña solo si viene una nueva
        const actualizarEmpleado = (contrasenaFinal) => {
            const empleadoActualizado = { 
                usuario, 
                nombre_empleado, 
                dni_empleado, 
                direccion_empleado, 
                telefono_empleado, 
                mail_empleado, 
                id_rol 
            };
            
            if (contrasenaFinal) empleadoActualizado.contrasena = contrasenaFinal;

            connection.query('UPDATE empleados SET ? WHERE id_empleado = ?', [empleadoActualizado, id], (error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'Error al actualizar el empleado', detalle: error.message });
                }
                res.json({ message: 'Empleado actualizado correctamente' });
            });
        };

        //  Si se envía una nueva contraseña, encriptar; si no, mantener la existente
        if (contrasena && contrasena.trim() !== "") {
            encriptarContraseña(contrasena)
                .then(contrasenaEncriptada => actualizarEmpleado(contrasenaEncriptada))
                .catch(error => res.status(500).json({ error: 'Error al encriptar la contraseña', detalle: error.message }));
        } else {
            actualizarEmpleado(null);
        }
    });
};


// Eliminar un empleado
const eliminarEmpleado = (req, res) => {
    const { id } = req.params;
    connection.query('UPDATE empleados SET is_active = FALSE WHERE id_empleado = ?', [id], (error, results) => {
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
    eliminarEmpleado,
    autenticarEmpleado,
    obtenerInfoEmpleadoAutenticado,
    logout
};
