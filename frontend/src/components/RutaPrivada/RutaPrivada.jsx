import { useEffect, useState } from "react";
import { useEmpleadoStore } from "../../zustand/empleado";
import { empleados } from "../../endpoints/endpoints";
import axios from "axios";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Swal from 'sweetalert2';

const RutaPrivada = () => {
  const empleado = useEmpleadoStore((state) => state.empleado);
  const setEmpleado = useEmpleadoStore((state) => state.setEmpleado);
  const logout = useEmpleadoStore((state) => state.logout);
  const [loading, setLoading] = useState(true); 
  const location = useLocation();
  let ruta = location.pathname
  const [rol, setRol] = useState("")

  const permisos = {
    Administrador: ["/turnos", "/dashboard", "/ventas", "/empleados", "/productos", "/clientes", "/especies", "/roles", "/proveedores", "/sucursales", "/razas", "/historiaClinica", "/mascotas", "/categorias", "/stock","/informe"],
    Veterinario: ["/turnos", "/dashboard", "/clientes", "/especies", "/razas", "/historiaClinica", "/detalleHistoriaClinica", "/mascotas"],
    Recepcionista: ["/turnos", "/dashboard", "/ventas", "/sucursales", "/clientes", "/mascotas", "/productos", "/categorias"],
  };

  const rutasPermitidas = permisos[rol] || [];

  useEffect(() => {
    const getInfoUser = async () => {
      try {
        const { data } = await axios.post(`${empleados}/info`, {}, { withCredentials: true });
        setEmpleado(data.empleado);
        setRol(empleado.nombre_rol)
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

  if (!rutasPermitidas.includes(ruta)) {
    Swal.fire({
        icon: "error",
        title: "Error",
        text: "No tienes permisos para acceder a este modulo.",
        confirmButtonText: "Aceptar",
      });
    return <Navigate to="/dashboard" replace />;
  }

  // if (location.pathname.startsWith("/login") && empleado) {
  //   console.log(empleado);
    
  //   return <Navigate to="/dashboard" replace />;
  // }

  // si hay usuario válido, muestra las rutas hijas
  return <Outlet />;
};

export default RutaPrivada;
