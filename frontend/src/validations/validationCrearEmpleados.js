export default function validationCrearEmpleados(
  usuario,
  contrasena,
  nombre_empleado,
  dni_empleado,
  direccion_empleado,
  telefono_empleado,
  mail_empleado,
  id_rol
) {
  const errores = [];

  if (!usuario.trim()) errores.push("El campo Usuario es obligatorio.");
  if (!contrasena.trim()) errores.push("El campo Contraseña es obligatorio.");
  if (!nombre_empleado.trim()) errores.push("El campo Nombre es obligatorio.");
  if (!dni_empleado.trim()) errores.push("El campo DNI es obligatorio.");
  if (!direccion_empleado.trim()) errores.push("El campo Dirección es obligatorio.");
  if (!telefono_empleado.trim()) errores.push("El campo Teléfono es obligatorio.");
  if (!mail_empleado.trim()) errores.push("El campo Correo es obligatorio.");
  if (!id_rol) errores.push("Debe seleccionar un Rol.");

  // Devuelve el texto con saltos de línea si hay errores
  return errores.length > 0 ? errores.join("\n") : "";
}