import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';

// 🔹 Pantallas módulo (las crearemos enseguida)
import VentasModule from './modules/VentasModule';
import InventariosModule from './modules/InventariosModule';
import ComprasModule from './modules/ComprasModule';
import SucursalesModule from './modules/SucursalesModule';
import RRHHModule from './modules/RRHHModule';
import AdminModule from './modules/AdminModule';

import './App.css';

function App() {
  return (
    <Router>
      <div className='app'>
        <Navbar />

        <div className='main-content'>
          <Routes>
            <Route path='/' element={<Dashboard />} />

            {/* RUTAS POR MÓDULO */}
            <Route path='/ventas' element={<VentasModule />} />
            <Route path='/inventarios' element={<InventariosModule />} />
            <Route path='/compras' element={<ComprasModule />} />
            <Route path='/sucursales' element={<SucursalesModule />} />
            <Route path='/rrhh' element={<RRHHModule />} />
            <Route path='/admin' element={<AdminModule />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;