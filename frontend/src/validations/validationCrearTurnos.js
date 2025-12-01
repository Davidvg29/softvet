function validationCrearTurnos(data) {
    const { motivo_turno, fecha, horario, fecha_hora, id_cliente, id_mascota } = data;

    // Validar cliente
    if (!id_cliente) return "Debe seleccionar un cliente.";

    // Validar mascota
    if (!id_mascota) return "Debe seleccionar una mascota.";

    // Validar motivo del turno
    if (!motivo_turno || motivo_turno.trim() === "") 
        return "Debe ingresar un motivo del turno.";

    if (motivo_turno.length < 3) 
        return "El motivo debe tener al menos 3 caracteres.";

    if (motivo_turno.length > 150) 
        return "El motivo no puede superar los 150 caracteres.";

    // Validar fecha
    if (!fecha) return "Debe seleccionar una fecha.";

    // Validar horario
    if (!horario) return "Debe seleccionar un horario disponible.";

    // Validar fecha completa final (combinación fecha + horario)
    if (!fecha_hora) return "Debe seleccionar una fecha y un horario.";

    // Validar formato de fecha_hora "YYYY-MM-DD HH:mm"
    const regexFechaHora = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
    if (!regexFechaHora.test(fecha_hora)) return "Formato de fecha y hora inválido.";

    return "";
}

export default validationCrearTurnos;
