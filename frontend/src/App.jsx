import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Roles from './pages/Roles';
import { HOME, ROLES } from './routers/router';

function App() {
  return (
    <Routes>
      <Route path={HOME} element={<Home/>} />
      <Route path={ROLES} element={<Roles/>} />
    </Routes>
  );
}

export default App;
