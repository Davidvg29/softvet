const e = require('express');
const { connection } = require('../config/bd/dataBase');
const { createToken } = require('../middlewares/jwt');
const { encriptarContraseña, compararContraseña } = require('../service/bcrypt');
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

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

const mailRestablecerContraseña = async (req, res) => {
    const { email } = req.params;

    try {

        connection.query('SELECT * FROM empleados WHERE mail_empleado = ?', [email], async (error, results) => {
            if(error){
                return res.status(500).json('Ocurrio un error al verificar correo de empleado para resetear contrasña.');
            }
            if(results.length === 0){
                return res.status(500).json('No existe un empleado con ese correo electrónico.');
            }
        })

        const token = jwt.sign(
             {email},
             process.env.JWT_SECRET,
             {expiresIn: "15m" }
        )

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "soporte.softvet@gmail.com",
                pass: "isqghcuqioxqmenm", 
            },
        });
        // Supongamos que esta es la URL que generas con el token de seguridad
        const resetUrl = `http://localhost:5173/empleados/password/restablecer/${token}`; 

        const info = await transporter.sendMail({
            from: '"Soporte Softvet" <soporte.softvet@gmail.com>',
            to: email,
            subject: "Restablece tu contraseña - Softvet",
            text: `Hola,\n\nHemos recibido una solicitud para restablecer la contraseña de tu cuenta en Softvet.\n\nPor favor, visita el siguiente enlace para crear una nueva contraseña:\n\n${resetUrl}\n\nSi no solicitaste este cambio, puedes ignorar este correo.\n\nSaludos,\nEl equipo de Softvet.`, // Versión texto plano (importante para evitar spam)
            html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                
                <div style="background: linear-gradient(135deg, #6d3bd2 0%, #a56bf4 100%); padding: 20px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px;">SOFTVET</h1>
                    <h4 style="color: #ffffff; margin: 0; ;">Sistema de gestión para veterinarias</h4>
                </div>

                <div style="padding: 30px;">
                    <h2 style="color: #333; margin-top: 0;">Restablecimiento de Contraseña</h2>
                    <p>Hola,</p>
                    <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en el sistema de gestión <strong>Softvet</strong>.</p>
                    <p>Haz clic en el botón de abajo para crear una nueva contraseña:</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background: linear-gradient(135deg, #6d3bd2 0%, #a56bf4 100%); color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">Restablecer mi contraseña</a>
                    </div>

                    <p style="font-size: 14px; color: #666;">RECORDAR: solo tienes 15 minutos para restablecer la contraseña.</p>


                    <p style="font-size: 14px; color: #666;">Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:</p>
                    <p style="font-size: 14px; color: #007BFF; word-break: break-all;">${resetUrl}</p>
                    
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    
                    <p style="font-size: 12px; color: #999;">Si no solicitaste este cambio, por favor ignora este correo. Tu contraseña actual seguirá siendo segura.</p>
                </div>
                
                <div style="background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #999;">
                    <p>&copy; ${new Date().getFullYear()} Softvet. Todos los derechos reservados.</p>
                </div>
            </div>
            `,
        });

        return res.status(200).json('Correo de recuperación enviado.');

    } catch (error) {
        return res.status(500).json('Ocurrio un error al enviar el correo de recuperación de contraseña.');
    }
}

const restablecerContraseña = async (req, res) => {
    const { token, nuevaContraseña } = req.body;

    if (!token || !nuevaContraseña) {
        return res.status(200).json({ error: 'Faltan datos obligatorios.' });
    }
    try {
        const {email} = jwt.verify(token, process.env.JWT_SECRET)
        // console.log(email);
        
        let contraseñaEncriptada = await encriptarContraseña(nuevaContraseña);

        // console.log(contraseñaEncriptada);

        connection.query('UPDATE empleados SET contrasena = ? WHERE mail_empleado = ?', [contraseñaEncriptada, email], (error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Error al actualizar la contraseña.' });
            }
            if (results.affectedRows === 0) {
                return res.status(200).json('Empleado con el correo electronico asignado no existe.' );
            }
            return res.status(200).json('Contraseña restablecida correctamente.');
        })
    } catch (error) {
        return res.status(500).json('Token inválido o expirado.');
    }
}

module.exports = {
    mostrarEmpleados,
    mostrarEmpleadoPorId,
    crearEmpleado,
    editarEmpleado,
    eliminarEmpleado,
    autenticarEmpleado,
    obtenerInfoEmpleadoAutenticado,
    logout,
    mailRestablecerContraseña,
    restablecerContraseña
};
