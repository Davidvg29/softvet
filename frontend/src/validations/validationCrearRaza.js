function validationCrearRaza(nombre_raza) {
    let error = '';
    if (!nombre_raza || nombre_raza.trim() === '') {
        error = 'El nombre de la raza es obligatorio.';
    } else if (nombre_raza.length < 3) {
        error = 'El nombre de la raza debe tener al menos 3 caracteres.';
    } else if (nombre_raza.length > 50) {
        error = 'El nombre de la raza no debe exceder los 50 caracteres.';
    }
    return error;
}

export default validationCrearRaza;