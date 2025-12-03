const bcrypt = require("bcrypt")

const encriptarContraseña = async (contraseña)=>{
    const saltRounds = 10;
    return await bcrypt.hash(contraseña, saltRounds)
}

const compararContraseña = async (contraseñaPlana, contraseñaHasheada) => {
    if (!contraseñaPlana || !contraseñaHasheada) return false;
        return await bcrypt.compare(contraseñaPlana, contraseñaHasheada);
};

module.exports = {
    encriptarContraseña,
    compararContraseña
}