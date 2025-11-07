function validationCrearRoles(nombre_rol) {
    let error = '';
    if (!nombre_rol || nombre_rol.trim() === '') {
        error = 'El nombre del rol es obligatorio.';
    } else if (nombre_rol.length < 3) {
        error = 'El nombre del rol debe tener al menos 3 caracteres.';
    } else if (nombre_rol.length > 50) {
        error = 'El nombre del rol no debe exceder los 50 caracteres.';
    }
    return error;
}

export default validationCrearRoles;