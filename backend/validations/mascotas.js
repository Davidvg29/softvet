const crearMascotaValidacion  = (mascota)=>{
    
    const { nombre_mascota, edad_mascota, sexo_mascota, id_raza, id_cliente, id_historia_clinica  } = mascota;
    if(!nombre_mascota || nombre_mascota.length < 1){return "Por favor ingrese un nombre válido para la mascota."}
    if(!edad_mascota || isNaN(edad_mascota)){return "Por favor ingrese una edad válida para la mascota."}
    if(!sexo_mascota || sexo_mascota.length < 1 || (sexo_mascota != "Macho" && sexo_mascota != "Hembra") ){return "Por favor ingrese un sexo válido para la mascota."}
    if(!id_raza || isNaN(id_raza)){return "Por favor ingrese una raza válida para la mascota."}
    //if(!id_cliente || isNaN(id_cliente)){return "Por favor ingrese un cliente válido para la mascota."}
    //if(!id_historia_clinica || isNaN(id_historia_clinica)){return "Por favor ingrese una historia clínica válida para la mascota."}

    // retorna null cuando no hay errores
    return null;
}

module.exports = {
    crearMascotaValidacion
}