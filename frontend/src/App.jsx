import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Proveedores from './pages/Proveedores';
import Roles from './pages/Roles';
import { HOME, ROLES, PROVEEDORES } from './routers/router';

function App() {
  return (
    <Routes>
      <Route path={HOME} element={<Home/>} />
      < Route path={PROVEEDORES} element={<Proveedores/>} />
      <Route path={ROLES} element={<Roles/>} />
    </Routes>
  );
}

export default App;
