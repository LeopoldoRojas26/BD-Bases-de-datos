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
        <h2>🏪 RedMarket ERP</h2>
      </div>

      <ul className="navbar-menu">
        <li>
          <Link to="/" className={isActive('/')}>
            📊 Dashboard
          </Link>
        </li>

        <li>
          <Link to="/ventas" className={isActive('/ventas')}>
            🛒 Ventas
          </Link>
        </li>

        <li>
          <Link to="/inventarios" className={isActive('/inventarios')}>
            📦 Inventarios
          </Link>
        </li>

        <li>
          <Link to="/compras" className={isActive('/compras')}>
            🚚 Compras
          </Link>
        </li>

        <li>
          <Link to="/sucursales" className={isActive('/sucursales')}>
            🏢 Sucursales
          </Link>
        </li>

        <li>
          <Link to="/rrhh" className={isActive('/rrhh')}>
            👨‍💼 RRHH
          </Link>
        </li>

        <li>
          <Link to="/admin" className={isActive('/admin')}>
            🔐 Administración
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;