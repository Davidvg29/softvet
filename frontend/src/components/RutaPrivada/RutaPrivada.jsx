import { useEffect, useState } from "react";
import { useEmpleadoStore } from "../../zustand/empleado";
import { empleados } from "../../endpoints/endpoints";
import axios from "axios";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RutaPrivada = () => {
  const empleado = useEmpleadoStore((state) => state.empleado);
  const setEmpleado = useEmpleadoStore((state) => state.setEmpleado);
  const logout = useEmpleadoStore((state) => state.logout);
  const [loading, setLoading] = useState(true); 
  const location = useLocation();

  useEffect(() => {
    const getInfoUser = async () => {
      try {
        const { data } = await axios.post(`${empleados}/info`, {}, { withCredentials: true });
        setEmpleado(data.empleado);
        
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };
    getInfoUser();
  }, []);

  // mientras verifica sesión, no navegues ni renderices nada
  if (loading) return <p>Cargando...</p>;

  // si no hay usuario en el store, redirige
  if (!empleado) return <Navigate to="/login" replace />;

  // if (location.pathname.startsWith("/login") && empleado) {
  //   console.log(empleado);
    
  //   return <Navigate to="/dashboard" replace />;
  // }

  // si hay usuario válido, muestra las rutas hijas
  return <Outlet />;
};

export default RutaPrivada;
