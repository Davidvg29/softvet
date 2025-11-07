import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import { HOME,PROVEEDORES } from './routers/router';
import Proveedores from './pages/Proveedores';

function App() {
  return (
    <Routes>
      <Route path={HOME} element={<Home/>} />
      < Route path={PROVEEDORES} element={<Proveedores/>} />
    </Routes>
  );
}

export default App;
