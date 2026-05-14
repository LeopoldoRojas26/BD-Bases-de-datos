import { useState, useEffect } from 'react';
import { proveedoresService } from '../services/api.service';
import '../components/Productos.css';

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    try {
      const response = await proveedoresService.getAll();
      // Backend devuelve {success: true, data: [...]}
      setProveedores(response.data.data || response.data);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="productos-container">
      <div className="productos-header">
        <h1>🚚 Gestión de Proveedores</h1>
      </div>

      <div className="productos-grid">
        {proveedores.map((proveedor) => (
          <div key={proveedor.id_proveedor} className="producto-card">
            <h3>{proveedor.nombre_proveedor}</h3>
            <p>📧 {proveedor.correo || 'Sin correo'}</p>
            <p>📱 {proveedor.telefono || 'Sin teléfono'}</p>
            <p>📊 Estado: {proveedor.estado}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Proveedores;
