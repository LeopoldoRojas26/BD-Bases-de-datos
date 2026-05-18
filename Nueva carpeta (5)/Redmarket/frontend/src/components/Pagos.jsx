import { useEffect, useState } from 'react';
import { pagosService, ventasService, metodosPagoService } from '../services/api.service';
import './Crud.css';

const Pagos = () => {
  const [pagos, setPagos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [metodos, setMetodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    id_venta: '',
    id_metodo_pago: '',
    monto: '',
    fecha_pago: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [pagosRes, ventasRes, metodosRes] = await Promise.all([
        pagosService.getAll(),
        ventasService.getAll(),
        metodosPagoService.getAll(),
      ]);

      setPagos(pagosRes.data.data || []);
      setVentas(ventasRes.data.data || []);
      setMetodos(metodosRes.data.data || []);

    } catch (error) {
      alert('Error cargando pagos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await pagosService.update(editingId, {
          id_venta: parseInt(formData.id_venta),
          id_metodo_pago: parseInt(formData.id_metodo_pago),
          monto: parseFloat(formData.monto),
          fecha_pago: formData.fecha_pago,
        });
        alert('✅ Pago actualizado');
      } else {
        await pagosService.create({
          id_venta: parseInt(formData.id_venta),
          id_metodo_pago: parseInt(formData.id_metodo_pago),
          monto: parseFloat(formData.monto),
          fecha_pago: formData.fecha_pago,
        });
        alert('✅ Pago registrado');
      }

      fetchData();
      setShowModal(false);

      setFormData({
        id_venta: '',
        id_metodo_pago: '',
        monto: '',
        fecha_pago: '',
      });
      setEditingId(null);

    } catch (error) {
      alert(editingId ? '❌ Error actualizando pago' : '❌ Error registrando pago');
    }
  };

  const handleEdit = (pago) => {
    setEditingId(pago.id_pago);
    setFormData({
      id_venta: pago.id_venta,
      id_metodo_pago: pago.id_metodo_pago,
      monto: parseFloat(pago.monto).toFixed(2),
      fecha_pago: pago.fecha_pago ? new Date(pago.fecha_pago).toISOString().split('T')[0] : '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas ELIMINAR permanentemente este pago?')) {
      return;
    }

    try {
      await pagosService.delete(id);
      alert('✅ Pago eliminado');
      fetchData();
    } catch (error) {
      alert('❌ Error al eliminar el pago');
    }
  };

  if (loading) return <div className="loading">Cargando pagos...</div>;

  return (
    <div className="crud-container">

      <div className="crud-header">
        <h1>💳 Gestión de Pagos</h1>

        <button
          className="btn-primary"
          onClick={() => {
            setEditingId(null);
            setFormData({
              id_venta: '',
              id_metodo_pago: '',
              monto: '',
              fecha_pago: '',
            });
            setShowModal(true);
          }}
        >
          + Nuevo Pago
        </button>
      </div>

      <table className="crud-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Venta</th>
            <th>Método</th>
            <th>Monto</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {pagos.map((pago) => (
            <tr key={pago.id_pago}>
              <td>{pago.id_pago}</td>
              <td>Venta #{pago.id_venta}</td>
              <td>{pago.metodo || pago.id_metodo_pago}</td>
              <td>${parseFloat(pago.monto).toFixed(2)}</td>
              <td>{new Date(pago.fecha_pago).toLocaleDateString()}</td>
              <td>
                <button className="btn-primary" onClick={() => handleEdit(pago)} style={{ marginRight: '5px' }}>
                  Editar
                </button>
                <button className="btn-secondary" onClick={() => handleDelete(pago.id_pago)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none' }}>
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

            <h2>{editingId ? 'Editar Pago' : 'Nuevo Pago'}</h2>

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label>Venta</label>

                <select
                  required
                  value={formData.id_venta}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const selectedVenta = ventas.find(v => v.id_venta === parseInt(selectedId));
                    setFormData({
                      ...formData,
                      id_venta: selectedId,
                      monto: selectedVenta ? selectedVenta.total : '',
                    });
                  }}
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
                <label>Método de pago</label>

                <select
                  required
                  value={formData.id_metodo_pago}
                  onChange={(e) => setFormData({
                    ...formData,
                    id_metodo_pago: e.target.value,
                  })}
                >
                  <option value="">Seleccionar método</option>

                  {metodos.map((m) => (
                    <option key={m.id_metodo_pago} value={m.id_metodo_pago}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Monto</label>

                <input
                  type="number"
                  step="0.01"
                  required
                  readOnly
                  value={formData.monto}
                />
              </div>

              <div className="form-group">
                <label>Fecha</label>

                <input
                  type="date"
                  required
                  value={formData.fecha_pago}
                  onChange={(e) => setFormData({
                    ...formData,
                    fecha_pago: e.target.value,
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
                  onClick={() => setShowModal(false)}
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

export default Pagos;
