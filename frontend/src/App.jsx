import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Especies from './pages/Especies';

import RutaPrivada from './components/RutaPrivada/RutaPrivada.jsx';
import Prueba from './components/Prueba.jsx';
import Login from './pages/Login.jsx';
import Proveedores from './pages/Proveedores';
import Roles from './pages/Roles';
import Clientes from './pages/Clientes';
import Mascotas from './pages/Mascotas.jsx'
import Empleados from './pages/Empleados'
import { HOME, ROLES, PROVEEDORES, INICIAR_SESION, EMPLEADOS, ESPECIES, DASHBOARD, VENTAS, RAZAS, CLIENTES, MASCOTAS } from './routers/router';
import Razas from './pages/Razas';
<<<<<<< HEAD
import Productos from './pages/Productos.jsx'
import { HOME, ROLES, PROVEEDORES, INICIAR_SESION, EMPLEADOS, ESPECIES, DASHBOARD, RAZAS, CLIENTES, MASCOTAS, PRODUCTOS } from './routers/router';
=======
>>>>>>> 0987aaec8ca021000336a6572583798a9aa6abb5
import DashboardPage from './pages/DashboardPage.jsx';
import Ventas from './pages/Ventas.jsx';

function App() {
  return (
    <Routes>
      <Route path={HOME} element={<Home/>} />
      {/* grupo de rutas privadas */}
      <Route path={INICIAR_SESION} element={<Login/>}/>
      <Route element={<RutaPrivada/>}>
        {/* Aqui van las rutas privadas */}
        <Route path='/prueba' element={<Prueba/>}/>
        <Route path={PROVEEDORES} element={<Proveedores/>} />
        <Route path={ROLES} element={<Roles/>} />
        <Route path={EMPLEADOS} element={<Empleados/>} />
        <Route path={ESPECIES} element={<Especies/>} />
        <Route path={DASHBOARD} element={<DashboardPage/>}/>
        <Route path={CLIENTES} element={<Clientes/>} />
        <Route path={MASCOTAS} element={<Mascotas/>} />
        <Route path={VENTAS} element={<Ventas/>}/>
        <Route path={RAZAS} element={<Razas/>}/>
        <Route path={PRODUCTOS} element={<Productos/>}/>
      </Route>
      {/* fin grupo de rutas privadas */}
    </Routes>
  );
}

export default App;
