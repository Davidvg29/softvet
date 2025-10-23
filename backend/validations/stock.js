const validationsCrearStock = (stock) => {
    const { cantidad, fecha_ingreso, observaciones_stock,  id_producto, id_sucursal} = stock;
    if(!cantidad || isNaN(cantidad) || cantidad < 0){return "Por favor ingrese una cantidad válida."}
    if(!id_producto || isNaN(id_producto)){return "Por favor ingrese un producto válido."}
    if(!id_sucursal || isNaN(id_sucursal)){return "Por favor ingrese una sucursal válida."}
    return null
}

module.exports = {
    validationsCrearStock
}