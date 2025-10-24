const validationsCrearVenta = (venta) => {
    const { total, id_cliente, id_empleado} = venta;
    if(!total || total.length < 0){return "Por favor ingrese un total válido."}
    if(!id_cliente || isNaN(id_cliente)){return "Por favor ingrese un cliente válido."}
    if(!id_empleado || isNaN(id_empleado)){return "Por favor ingrese un empleado válido."}
    return null
}

module.exports = {
    validationsCrearVenta
}