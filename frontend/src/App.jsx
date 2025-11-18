import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Especies from './pages/Especies';

import RutaPrivada from './components/RutaPrivada/RutaPrivada.jsx';
import Prueba from './components/Prueba.jsx';
import Login from './pages/Login.jsx';
import Proveedores from './pages/Proveedores';
import Roles from './pages/Roles';
import Empleados from './pages/Empleados'
import { HOME, ROLES, PROVEEDORES, INICIAR_SESION, EMPLEADOS, ESPECIES, DASHBOARD, VENTAS, RAZAS,HISTORIAS_CLINICAS  } from './routers/router';
import Razas from './pages/Razas';
import HistoriaClinica from './pages/HistoriaClinica.jsx';
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
        <Route path={VENTAS} element={<Ventas/>}/>
        <Route path={RAZAS} element={<Razas/>}/>
        <Route path={HISTORIAS_CLINICAS} element={<HistoriaClinica/>}/>
      </Route>
      {/* fin grupo de rutas privadas */}
    </Routes>
  );
}

export default App;
