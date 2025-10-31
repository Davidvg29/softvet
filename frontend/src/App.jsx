import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Especies from './pages/Especies';
import { ESPECIES, HOME } from './routers/router';

function App() {
  return (
    <Routes>
      <Route path={HOME} element={<Home/>} />
      <Route path={ESPECIES} element={<Especies/>} />
    </Routes>
  );
}

export default App;
