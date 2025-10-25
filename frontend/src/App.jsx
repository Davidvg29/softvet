import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import { HOME } from './routers/router';

function App() {
  return (
    <Routes>
      <Route path={HOME} element={<Home/>} />
    </Routes>
  );
}

export default App;
