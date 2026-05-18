import { useEffect, useState } from 'react';
import { devolucionService, ventasService } from '../services/api.service';
import './Crud.css';

const Devolucion = () => {
  const [devoluciones, setDevoluciones] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    id_venta: '',
    fecha: '',
    motivo: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [devolucionesRes, ventasRes] = await Promise.all([
        devolucionService.getAll(),
        ventasService.getAll(),
      ]);

      setDevoluciones(devolucionesRes.data.data || []);
      setVentas(ventasRes.data.data || []);

    } catch (error) {
      alert('Error cargando devoluciones');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await devolucionService.update(editingId, {
          motivo: formData.motivo,
        });
        alert('✅ Devolución actualizada');
      } else {
        await devolucionService.create({
          id_venta: parseInt(formData.id_venta),
          fecha: formData.fecha,
          motivo: formData.motivo,
        });
        alert('✅ Devolución registrada');
      }

      fetchData();
      setShowModal(false);
      setEditingId(null);
    } catch (error) {
      alert('❌ Error guardando devolución');
    }
  };

  const handleEdit = (devolucion) => {
    setEditingId(devolucion.id_devolucion);
    setFormData({
      id_venta: devolucion.id_venta,
      fecha: devolucion.fecha ? new Date(devolucion.fecha).toISOString().split('T')[0] : '',
      motivo: devolucion.motivo,
    });
    setShowModal(true);
  };

  const handleDelete = async (id_devolucion, id_venta) => {
    if (!window.confirm('¿Estás seguro de ELIMINAR esta devolución? El producto volverá a salir del inventario.')) {
      return;
    }

    try {
      await devolucionService.delete(id_devolucion);
      
      // Limpiar de localStorage para que la venta vuelva a su estado normal en Ventas.jsx
      const saved = JSON.parse(localStorage.getItem('returnedSales') || '[]');
      const updated = saved.filter(id => id !== id_venta);
      localStorage.setItem('returnedSales', JSON.stringify(updated));

      alert('✅ Devolución eliminada y stock actualizado');
      fetchData();
    } catch (error) {
      alert('❌ Error al eliminar devolución');
    }
  };

  if (loading) return <div className="loading">Cargando devoluciones...</div>;

  return (
    <div className="crud-container">

      <div className="crud-header">
        <h1>🔄 Devoluciones</h1>
      </div>

      <table className="crud-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Venta</th>
            <th>Fecha</th>
            <th>Motivo</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {devoluciones.map((d) => (
            <tr key={d.id_devolucion}>
              <td>{d.id_devolucion}</td>
              <td>Venta #{d.id_venta}</td>
              <td>{new Date(d.fecha).toLocaleDateString()}</td>
              <td>{d.motivo}</td>
              <td>
                <button className="btn-primary" onClick={() => handleEdit(d)} style={{ marginRight: '5px' }}>
                  Editar
                </button>
                <button className="btn-secondary" onClick={() => handleDelete(d.id_devolucion, d.id_venta)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none' }}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>

          <div className="modal-content" onClick={(e) => e.stopPropagation()}>

            <h2>{editingId ? 'Editar Devolución' : 'Nueva Devolución'}</h2>

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label>Venta</label>

                <select
                  required
                  disabled={!!editingId}
                  value={formData.id_venta}
                  onChange={(e) => setFormData({
                    ...formData,
                    id_venta: e.target.value,
                  })}
                >
                  <option value="">Seleccionar venta</option>

                  {ventas.map((v) => (
                    <option key={v.id_venta} value={v.id_venta}>
                      Venta #{v.id_venta}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Fecha</label>

                <input
                  type="date"
                  required
                  disabled={!!editingId}
                  value={formData.fecha}
                  onChange={(e) => setFormData({
                    ...formData,
                    fecha: e.target.value,
                  })}
                />
              </div>

              <div className="form-group">
                <label>Motivo</label>

                <textarea
                  required
                  value={formData.motivo}
                  onChange={(e) => setFormData({
                    ...formData,
                    motivo: e.target.value,
                  })}
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  Guardar
                </button>

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                  }}
                >
                  Cancelar
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Devolucion;
