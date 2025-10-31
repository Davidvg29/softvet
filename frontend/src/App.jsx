import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import { HOME, INICIAR_SESION } from './routers/router';
import IniciarSesion from './components/iniciarSesion/IniciarSesion';

function App() {
  return (
    <Routes>
      <Route path={HOME} element={<Home/>} />
      <Route path={INICIAR_SESION} element={<IniciarSesion/>}/>
    </Routes>
  );
}

export default App;
