import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Especies from './pages/Especies';
import Roles from './pages/Roles';
import { HOME, ROLES, ESPECIES } from './routers/router';


function App() {
  return (
    <Routes>
      <Route path={HOME} element={<Home/>} />
      <Route path={ESPECIES} element={<Especies/>} />
      <Route path={ROLES} element={<Roles/>} />
    </Routes>
  );
}

export default App;
