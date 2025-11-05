import { useEmpleadoStore } from "../../zustand/empleado";

const RutaPrivada = () => {
    const empleado = useEmpleadoStore((state) => state.empleado);
    console.log("ruta privada ");
    
    if (!empleado) return <Navigate to="/iniciar-sesion" replace />
}
export default RutaPrivada;