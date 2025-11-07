import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import RutaPrivada from './components/RutaPrivada/RutaPrivada.jsx';
import Prueba from './components/Prueba.jsx';
import Login from './pages/Login.jsx';
import Proveedores from './pages/Proveedores';
import Roles from './pages/Roles';
import { HOME, ROLES, PROVEEDORES, INICIAR_SESION } from './routers/router';

function App() {
  return (
    <Routes>
      <Route path={HOME} element={<Home/>} />
      <Route path={INICIAR_SESION} element={<Login/>}/>
      {/* grupo de rutas privadas */}
      <Route element={<RutaPrivada/>}>
        {/* Aqui van las rutas privadas */}
        <Route path='/prueba' element={<Prueba/>}/>
        < Route path={PROVEEDORES} element={<Proveedores/>} />
      <Route path={ROLES} element={<Roles/>} />
      </Route>
      {/* fin grupo de rutas privadas */}
    </Routes>
  );
}

export default App;
