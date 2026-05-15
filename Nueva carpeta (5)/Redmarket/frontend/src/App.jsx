import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Productos from './components/Productos';
import Ventas from './components/Ventas';
import Inventario from './components/Inventario';
import Clientes from './components/Clientes';
import Empleados from './components/Empleados';
import Proveedores from './components/Proveedores';
import MetodosPago from "./components/MetodosPago";
import './App.css';

function App() {
  return (
    <Router>
      <div className='app'>
        <Navbar />
        <div className='main-content'>
          <Routes>
            <Route path='/' element={<Dashboard /> } />
            <Route path='/productos' element={<Productos />} />
            <Route path='/ventas' element={<Ventas />} />
            <Route path='/inventario' element={<Inventario />} />
            <Route path='/clientes' element={<Clientes />} />
            <Route path='/empleados' element={<Empleados />} />
            <Route path='/proveedores' element={<Proveedores />} />
            <Route path='/metodos-pago' element={<MetodosPago />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

