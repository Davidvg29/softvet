const validationsCrearDetallesVentas = (detallesVentas) => {
    const {cantidad, precio_unitario, sub_total, id_venta, id_producto} = detallesVentas;
    if(!cantidad || cantidad.length < 0){return "La cantidad es obligatoria"}
    if(!precio_unitario || precio_unitario.length < 0){return "El precio unitario es obligatorio"}
    if(!sub_total || sub_total.length < 0){return "El sub total es obligatorio"}
    if(!id_venta || isNaN(id_venta)){return "La venta es obligatorio"}
    if(!id_producto || isNaN(id_producto)){return "El producto es obligatorio"}
    return null;
}

module.exports = {validationsCrearDetallesVentas};