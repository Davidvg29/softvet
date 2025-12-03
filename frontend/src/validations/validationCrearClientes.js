export default function validationCrearClientes(
  nombre_cliente,
  dni_cliente,
  direccion_cliente,
  celular_cliente,
  mail_cliente
) {
  const errores = [];

  if (!nombre_cliente.trim()) errores.push("El campo Nombre es obligatorio.");
  if (!dni_cliente.trim()) errores.push("El campo DNI es obligatorio.");
  if (!direccion_cliente.trim()) errores.push("El campo Dirección es obligatorio.");
  if (!celular_cliente.trim()) errores.push("El campo Teléfono es obligatorio.");
  if (!mail_cliente.trim()) errores.push("El campo Correo es obligatorio.");

  // Devuelve el texto con saltos de línea si hay errores
  return errores.length > 0 ? errores.join("\n") : "";
}