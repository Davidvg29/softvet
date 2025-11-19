function validationCrearCategorias(nombre_categoria) {
    let error = '';
    if (!nombre_categoria || nombre_categoria.trim() === '') {
        error = 'El nombre de la especie es obligatorio.';
    } else if (nombre_categoria.length < 3) {
        error = 'El nombre de la especie debe tener al menos 3 caracteres.';
    } else if (nombre_categoria.length > 50) {
        error = 'El nombre de la especie no debe exceder los 50 caracteres.';
    }
    return error;
}

export default validationCrearCategorias;