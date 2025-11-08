function validationProveedores({nombre_proveedor, direccion_proveedor, celular_proveedor, mail_proveedor}){
    let error = ""
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!nombre_proveedor || nombre_proveedor.length < 3 ) return error="por favor ingrese un nombre verdadero"
    if(!direccion_proveedor || direccion_proveedor.length<3) return error="por favor ingrese una direccion valida"
    if(!celular_proveedor || isNaN(celular_proveedor) || celular_proveedor.length<10) return error= "por favor ingrese un numero de celular valido"
    if(!mail_proveedor || !regex.test(mail_proveedor)) return error = "error email incorrecto"

    return error
}

export default validationProveedores;