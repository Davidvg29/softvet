export default function validationCrearStock(
  cantidad,
  id_producto,
  id_sucursal,
  observaciones_stock
) {
  const errores = [];

  // Cantidad
  if (cantidad === null || cantidad === undefined || cantidad === "") {
    errores.push("El campo Cantidad es obligatorio.");
  } else if (isNaN(cantidad) || Number(cantidad) <= 0) {
    errores.push("La Cantidad debe ser un número mayor a 0.");
  }

  // Producto
  if (!id_producto) {
    errores.push("Debe seleccionar un Producto.");
  } else if (isNaN(id_producto) || Number(id_producto) <= 0) {
    errores.push("El Producto seleccionado no es válido.");
  }

  // Sucursal
  if (!id_sucursal) {
    errores.push("Debe seleccionar una Sucursal.");
  } else if (isNaN(id_sucursal) || Number(id_sucursal) <= 0) {
    errores.push("La Sucursal seleccionada no es válida.");
  }

  // Observaciones (opcional)
  if (observaciones_stock && observaciones_stock.length > 100) {
    errores.push("Las observaciones no pueden superar los 100 caracteres.");
  }

  // Resultado: string con saltos de línea o vacío si todo OK
  return errores.length > 0 ? errores.join("\n") : "";
}