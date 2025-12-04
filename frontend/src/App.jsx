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
import { HOME, ROLES, PROVEEDORES, INICIAR_SESION, EMPLEADOS, ESPECIES, DASHBOARD, VENTAS, RAZAS, CLIENTES, MASCOTAS,HISTORIAS_CLINICAS ,PRODUCTOS, SUCURSALES, CATEGORIAS, TURNOS, STOCK,INFORME } from './routers/router';
import Razas from './pages/Razas';
import HistoriaClinica from './pages/HistoriaClinica.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import Ventas from './pages/Ventas.jsx';
import Productos from './pages/Productos.jsx'
import Sucursales from './pages/Sucursales.jsx';
import Categorias from './pages/Categorias.jsx';
import Turnos from './pages/Turnos.jsx';
import Stock from './pages/Stock.jsx';
import Informe from './pages/Informe.jsx';
// import Compras from './pages/Compras.jsx';

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
        {/* <Route path={COMPRAS} element={<Compras/>}/> */}
        <Route path={RAZAS} element={<Razas/>}/>
        <Route path={HISTORIAS_CLINICAS} element={<HistoriaClinica/>}/>
        <Route path={PRODUCTOS} element={<Productos/>}/>
        <Route path={SUCURSALES} element={<Sucursales/>}/>
        <Route path={CATEGORIAS} element={<Categorias/>}/>
        <Route path={TURNOS} element={<Turnos/>}/>
        <Route path={STOCK} element={<Stock/>}/>
        <Route path={INFORME} element={<Informe/>}/>
      </Route>
      {/* fin grupo de rutas privadas */}
    </Routes>
  );
}

export default App;
