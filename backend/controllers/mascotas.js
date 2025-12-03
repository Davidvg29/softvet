const { connection } = require("../config/bd/dataBase");
const { crearMascotaValidacion } = require("../validations/mascotas");


const mostrarMascotas = (req, res) => {
    // esto solo muestra las mascotas activas
    const queryGetMascotas = `select mascotas.id_mascota, mascotas.nombre_mascota, mascotas.edad_mascota, mascotas.sexo_mascota, mascotas.is_active, mascotas.id_historia_clinica, 
    razas.nombre_raza,
    especies.nombre_especie,
    clientes.nombre_cliente, clientes.dni_cliente
    from mascotas
    left join razas on razas.id_raza = mascotas.id_raza
    left join especies on razas.id_especie = especies.id_especie 
    left join clientes on clientes.id_cliente = mascotas.id_cliente
	where mascotas.is_active = true
    ;`;
    connection.query(queryGetMascotas, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al obtener mascotas.' });
        }
        else {
            return res.status(200).json(results);
        }
    });
}

const mostrarMascotaId = (req, res) => {
    const id_mascota = req.params.id;

    const query = `
        SELECT mascotas.id_mascota, mascotas.nombre_mascota, mascotas.edad_mascota, mascotas.sexo_mascota,
               razas.nombre_raza,
               especies.nombre_especie,
               clientes.nombre_cliente, clientes.dni_cliente
        FROM mascotas
        LEFT JOIN razas ON razas.id_raza = mascotas.id_raza
        LEFT JOIN especies ON razas.id_especie = especies.id_especie
        LEFT JOIN clientes ON clientes.id_cliente = mascotas.id_cliente
        WHERE mascotas.id_mascota = ? AND mascotas.is_active = true;
    `;

    connection.query(query, [id_mascota], (error, results) => {
        if (error) {
            console.error("Error al obtener mascota:", error);
            return res.status(500).json({ error: "Error al obtener mascota" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Mascota no encontrada" });
        }

        return res.status(200).json(results[0]); // ← devolvemos solo un objeto
    });
};

const crearMascota = (req, res) => {
    const { nombre_mascota, edad_mascota, sexo_mascota, id_raza, id_cliente, id_historia_clinica } = req.body;
    const validation = crearMascotaValidacion(req.body);

    if (validation !== null) {
        return res.status(400).json({ error: validation });
    }

    const queryInsertCrearMascota = `INSERT INTO mascotas (nombre_mascota, edad_mascota, sexo_mascota, id_raza, id_cliente, id_historia_clinica) VALUES (?, ?, ?, ?, ?, ?);`
    connection.query(queryInsertCrearMascota, [nombre_mascota, edad_mascota, sexo_mascota, id_raza, id_cliente ? id_cliente : null, id_historia_clinica ? id_historia_clinica : null], (error, results) => {
        if (error) {
            console.error("Error al crear mascota:", error);
            return res.status(500).json({ error: 'Error al crear mascota.' });
        }
        else {
            return res.status(200).json("Mascota creada exitosamente.");
        }
    });
}

const editarMasctoa = (req, res) => {
    const id_mascota = req.params.id;

    // Solo campos editables
    const { nombre_mascota, edad_mascota, sexo_mascota, id_raza, id_historia_clinica } = req.body;

    const validation = crearMascotaValidacion({
        nombre_mascota,
        edad_mascota,
        sexo_mascota,
        id_raza,
        id_cliente: 1 // truco para pasar validación
    });

    if (validation !== null) {
        return res.status(400).json({ error: validation });
    }

    // 1) Obtener cliente actual
    const queryGetCliente = `
        SELECT id_cliente 
        FROM mascotas 
        WHERE id_mascota = ?
    `;

    connection.query(queryGetCliente, [id_mascota], (error, results) => {
        if (error) {
            console.error("Error obteniendo cliente:", error);
            return res.status(500).json({ error: "Error interno." });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Mascota no encontrada." });
        }

        const id_cliente_actual = results[0].id_cliente;

        // 2) UPDATE
        const queryUpdate = `
            UPDATE mascotas
            SET nombre_mascota = ?, 
                edad_mascota = ?, 
                sexo_mascota = ?, 
                id_raza = ?, 
                id_cliente = ?,        -- ← se mantiene igual
                id_historia_clinica = ?
            WHERE id_mascota = ?
        `;

        connection.query(
            queryUpdate,
            [
                nombre_mascota,
                edad_mascota,
                sexo_mascota,
                id_raza,
                id_cliente_actual,         // ← siempre el mismo cliente
                id_historia_clinica ?? null,
                id_mascota
            ],
            (error, results) => {
                if (error) {
                    console.error("Error al editar mascota:", error);
                    return res.status(500).json({ error: "Error al editar mascota." });
                }

                if (results.affectedRows === 0) {
                    return res.status(404).json({ error: "Mascota no encontrada." });
                }

                return res.status(200).json("Mascota editada exitosamente.");
            }
        );
    });
};

const borrarMascota = (req, res) => {
    const id_mascota = req.params.id;

    const queryDeleteMascota = `update mascotas set is_active = false where id_mascota = ?;`
    connection.query(queryDeleteMascota, [id_mascota], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al borrar mascota.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Mascota no encontrada." });
        }
        return res.status(200).json("Mascota borrada exitosamente.");
    })
}

const activarMascota = (req, res) => {
    const id_mascota = req.params.id;

    const queryActivarMascota = `update mascotas set is_active = true where id_mascota = ?;`
    connection.query(queryActivarMascota, [id_mascota], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al activar mascota.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Mascota no encontrada." });
        }
        return res.status(200).json("Mascota activada exitosamente.");
    })
}

//mostrar mascotas por cliente
const mostrarMascotasPorCliente = (req, res) => {
    const { id_cliente } = req.params;

    const query = "SELECT * FROM mascotas WHERE id_cliente = ? AND is_active = 1";

    connection.query(query, [id_cliente], (error, results) => {
        if (error) {
            console.log("ERROR SQL en mostrarMascotasPorCliente:", error);
            return res.status(500).json({ error: "Error al obtener las mascotas del cliente." });
        }

        res.json(results);
    });
};

module.exports = {
    mostrarMascotas,
    mostrarMascotaId,
    crearMascota,
    editarMasctoa,
    borrarMascota,
    activarMascota,
    mostrarMascotasPorCliente
}