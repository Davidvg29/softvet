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
        if(error) {
            return res.status(500).json({error: 'Error al obtener mascotas.'});
        }
        else {
            return res.status(200).json(results);
        }
    });
}

const crearMascota = (req, res) => {
    const { nombre_mascota, edad_mascota, sexo_mascota, id_raza, id_cliente, id_historia_clinica } = req.body;
    const validation = crearMascotaValidacion(req.body);
    
    if(validation !== null){
        return res.status(400).json({error: validation});
    }

    const queryInsertCrearMascota = `INSERT INTO mascotas (nombre_mascota, edad_mascota, sexo_mascota, id_raza, id_cliente, id_historia_clinica) VALUES (?, ?, ?, ?, ?, ?);`
    connection.query(queryInsertCrearMascota, [nombre_mascota, edad_mascota, sexo_mascota, id_raza, id_cliente?id_cliente:null, id_historia_clinica?id_historia_clinica:null], (error, results) => {
        if(error) {
            console.error("Error al crear mascota:", error);
            return res.status(500).json({error: 'Error al crear mascota.'});
        }
        else {
            return res.status(200).json("Mascota creada exitosamente.");
        }
    });
}

const editarMasctoa = (req, res) => {
    const id_mascota = req.params.id;
    const { nombre_mascota, edad_mascota, sexo_mascota, id_raza, id_cliente, id_historia_clinica } = req.body;

    const validation = crearMascotaValidacion(req.body);
    
    if(validation !== null){
        return res.status(400).json({error: validation});
    }

    const queryUpdateMascota = `UPDATE mascotas SET nombre_mascota = ?, edad_mascota = ?, sexo_mascota = ?, id_raza = ?, id_cliente = ?, id_historia_clinica = ? WHERE id_mascota = ?;`
    connection.query(queryUpdateMascota, [nombre_mascota, edad_mascota, sexo_mascota, id_raza, id_cliente?id_cliente:null, id_historia_clinica?id_historia_clinica:null, id_mascota], (error, results) => {
        if(error) {
            return res.status(500).json({error: 'Error al editar mascota.'});
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Mascota no encontrada." });
        }
        return res.status(200).json("Mascota editada exitosamente.");
    })
}

const borrarMascota = (req, res) => {
    const id_mascota = req.params.id;

    const queryDeleteMascota = `update mascotas set is_active = false where id_mascota = ?;`
    connection.query(queryDeleteMascota, [id_mascota], (error, results) => {
        if(error) {
            return res.status(500).json({error: 'Error al borrar mascota.'});
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
        if(error) {
            return res.status(500).json({error: 'Error al activar mascota.'});
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Mascota no encontrada." });
        }
        return res.status(200).json("Mascota activada exitosamente.");
    })
}

module.exports = {
    mostrarMascotas,
    crearMascota,
    editarMasctoa,
    borrarMascota,
    activarMascota
}