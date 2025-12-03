function validationCrearHistoriaClinicas(data) {
    const { observaciones_generales, observaciones } = data;

    if (!observaciones_generales || typeof observaciones_generales !== "string" || observaciones_generales.trim() === "") {
        return "La observación general es obligatoria.";
    }

    if (observaciones_generales.length < 3) {
        return "La observación general debe tener al menos 3 caracteres.";
    }

    if (observaciones_generales.length > 200) {
        return "La observación general no debe exceder los 200 caracteres.";
    }

    return ""; // sin errores
}

export default validationCrearHistoriaClinicas;
