export default function validationCrearMascotas(nombre, edad, sexo, especie, raza) {
  let errores = [];

  if (!nombre.trim()) errores.push("El nombre de la mascota es obligatorio.");
  if (!edad || edad <= 0) errores.push("La edad debe ser mayor a 0.");
  if (!sexo) errores.push("Debe seleccionar el sexo de la mascota.");
  if (!especie) errores.push("Debe seleccionar la especie.");
  if (!raza) errores.push("Debe seleccionar la raza.");

  if (errores.length > 0) {
    return errores.join(" ");
  }

  return "";
}