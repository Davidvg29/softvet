function validationCrearEspecies(nombre_especie) {
    let error = '';
    if (!nombre_especie || nombre_especie.trim() === '') {
        error = 'El nombre de la especie es obligatorio.';
    } else if (nombre_especie.length < 3) {
        error = 'El nombre de la especie debe tener al menos 3 caracteres.';
    } else if (nombre_especie.length > 50) {
        error = 'El nombre de la especie no debe exceder los 50 caracteres.';
    }
    return error;
}

export default validationCrearEspecies;