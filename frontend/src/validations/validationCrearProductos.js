export default function validationCrearProductos(
  nombre_producto,
  codigo_producto,
  precio_producto,
  id_categoria
) {
  const errores = [];

  if (!nombre_producto.trim()) errores.push("El campo Nombre es obligatorio.");
  if (!codigo_producto.trim()) errores.push("El campo Código es obligatorio.");
  if (!precio_producto.trim()) errores.push("El campo Precio es obligatorio.");
  if (id_categoria === null || id_categoria === undefined || id_categoria === "") {
  return "La categoría es obligatoria";
}

  // Devuelve el texto con saltos de línea si hay errores
  return errores.length > 0 ? errores.join("\n") : "";
}