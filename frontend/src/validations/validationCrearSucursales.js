function validationCrearSucursales(nombre_sucursal) {
    let error = '';
    if (!nombre_sucursal || nombre_sucursal.trim() === '') {
        error = 'El nombre de la sucursal es obligatorio.';
    } else if (nombre_sucursal.length < 3) {
        error = 'El nombre de la sucursal debe tener al menos 3 caracteres.';
    } else if (nombre_sucursal.length > 50) {
        error = 'El nombre de la sucursal no debe exceder los 50 caracteres.';
    }
    return error;
}

export default validationCrearSucursales;