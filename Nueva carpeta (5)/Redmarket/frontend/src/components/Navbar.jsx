import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>🏪 RedMarket</h2>
      </div>
      <ul className="navbar-menu">
        <li>
          <Link to="/" className={isActive('/')}>
            🏠 Dashboard
          </Link>
        </li>
        <li>
          <Link to="/productos" className={isActive('/productos')}>
            🛍️ Productos
          </Link>
        </li>
        <li>
          <Link to="/ventas" className={isActive('/ventas')}>
            💰 Ventas
          </Link>
        </li>
        <li>
          <Link to="/inventario" className={isActive('/inventario')}>
            📦 Inventario
          </Link>
        </li>
        <li>
          <Link to="/clientes" className={isActive('/clientes')}>
            👥 Clientes
          </Link>
        </li>
        <li>
          <Link to="/empleados" className={isActive('/empleados')}>
            👔 Empleados
          </Link>
        </li>
        <li>
          <Link to="/proveedores" className={isActive('/proveedores')}>
            🚚 Proveedores
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
