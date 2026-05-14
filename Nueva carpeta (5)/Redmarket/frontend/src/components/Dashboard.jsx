import { useState, useEffect } from 'react';
import api from '../config/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productos, ventas, clientes, inventario] = await Promise.all([
        api.get('/productos'),
        api.get('/ventas'),
        api.get('/clientes'),
        api.get('/inventario'),
      ]);

      // Backend devuelve {success: true, data: [...]}
      const productosData = productos.data.data || productos.data;
      const ventasData = ventas.data.data || ventas.data;
      const clientesData = clientes.data.data || clientes.data;
      const inventarioData = inventario.data.data || inventario.data;

      const stockBajo = inventarioData.filter(
        (item) => item.stock_actual < item.stock_minimo
      ).length;

      const totalVentas = ventasData.reduce(
        (sum, v) => sum + parseFloat(v.total || v.total_venta || 0),
        0
      );

      setStats({
        totalProductos: productosData.length,
        totalVentas: ventasData.length,
        totalClientes: clientesData.length,
        stockBajo,
        montoVentas: totalVentas,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Cargando dashboard...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>🏪 RedMarket - Dashboard</h1>
        <p>Sistema de Gestión Integral</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">🛍️</div>
          <h3>{stats?.totalProductos || 0}</h3>
          <p>Productos</p>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">💰</div>
          <h3>{stats?.totalVentas || 0}</h3>
          <p>Ventas Registradas</p>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">👥</div>
          <h3>{stats?.totalClientes || 0}</h3>
          <p>Clientes</p>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">📦</div>
          <h3>{stats?.stockBajo || 0}</h3>
          <p>Productos con Stock Bajo</p>
        </div>
      </div>

      <div className="info-card">
        <h2>💵 Total en Ventas</h2>
        <p className="amount">${stats?.montoVentas.toFixed(2) || '0.00'}</p>
      </div>
    </div>
  );
};

export default Dashboard;
