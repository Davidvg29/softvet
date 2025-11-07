import { useEffect } from "react";
import { useEmpleadoStore } from "../../zustand/empleado";
import { empleado } from '../../endpoints/endpoints';
import axios from "axios";
import { Navigate } from "react-router-dom";

const RutaPrivada = ({children}) => {
    const empleadoStore = useEmpleadoStore((state) => state.empleado);
    const setEmpleado = useEmpleadoStore((state)=>state.setEmpleado)
    const logout = useEmpleadoStore((state)=> state.logout)
    //console.log("ruta privada ");

    useEffect(()=>{
        const getInfoUser = async ()=>{
            try {
                const {data} = await axios.post(`${empleado}/info`, {}, {withCredentials: true})
                //console.log(data.empleado);
                setEmpleado(data.empleado);
            } catch (error) {
                //console.log({error: error.message});
                logout();
            }
        }
        getInfoUser()
    }, [])
    
    if (!empleadoStore) return <Navigate to="/login" replace />

    return children
}
export default RutaPrivada;