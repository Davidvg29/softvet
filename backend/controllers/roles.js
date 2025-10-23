const { connection } = require('../config/bd/dataBase');

//obtener todos los roles
const mostrarRoles = (req, res) => {
    connection.query('SELECT * FROM roles WHERE is_active = TRUE', (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error al obtener los roles');
        }
        res.json(results);
    });
};

//obtener un rol por id
const mostrarRolesId = (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM roles WHERE id_rol=?', [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al obtener el rol' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Rol no encontrado' });
        }
        res.json(results[0]);
    });
};

//crear un rol
const crearRol = (req, res) => {
    const { nombre_rol, is_active } = req.body;
    if (!nombre_rol) {
        return res.status(400).json({ error: 'El nombre del rol es obligatorio' });
    }

    const isActive = typeof is_active === 'boolean' ? is_active : true;

    connection.query('SELECT * FROM roles WHERE nombre_rol = ?', [nombre_rol], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al verificar el rol existente' });
        }
        if (results.length > 0) {
            return res.status(409).json({ error: 'Ya existe un rol con ese nombre' });
        }
    });

    connection.query('INSERT INTO roles (nombre_rol) VALUES (?)', [nombre_rol, isActive], (error, results) => {

        if (error) {
            return res.status(500).json({ error: 'Error al crear el rol' });
        };
        res.status(201).json({ message: 'Rol creado exitosamente', id_rol: results.insertId });
    });
};



//editar un rol
const editarRol = (req, res) => {
    const { id } = req.params;
    const { nombre_rol, is_active } = req.body;

    connection.query('SELECT * FROM roles WHERE id_rol=?', [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al obtener el rol' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Rol no encontrado' });
        }

        const existing = results[0];
        const newName = typeof nombre_rol === 'string' && nombre_rol.trim() !== '' ? nombre_rol.trim() : existing.nombre_rol;
        const newActive = typeof is_active === 'boolean' ? is_active : existing.is_active;

         connection.query('SELECT * FROM roles WHERE nombre_rol = ? AND id_rol <> ?',
            [newName, id],
            (dupErr, dupResults) => {
                if (dupErr) {
                    return res.status(500).json({ error: 'Error al verificar el rol existente' });
                }
                if (dupResults.length > 0) {
                    return res.status(409).json({ error: 'Ya existe un rol con ese nombre' });
                }
       

        connection.query('UPDATE roles SET nombre_rol=?, is_active = ? WHERE id_rol=?', [newName, newActive, id], (updateErr) => {
            if (updateErr) {
                return res.status(500).json({ error: 'Error al actualizar el rol' });
            }
            res.json({ message: 'Rol actualizado exitosamente' });
        });
    });
});
};

//eliminar un rol
const eliminarRol = (req, res) => {
    const { id } = req.params;
    connection.query(
        'UPDATE roles SET is_active = FALSE WHERE id_rol = ?',
        [id],
        (error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Error al eliminar el rol' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Rol no encontrado' });
            }
            res.json({ message: 'Rol eliminado (desactivado) exitosamente' });
        }
    );
};
module.exports = {
    mostrarRoles,
    mostrarRolesId,
    crearRol,
    editarRol,
    eliminarRol
};