import { useEffect, useState } from 'react';
import { devolucionService, ventasService } from '../services/api.service';
import './Crud.css';

const Devolucion = () => {
  const [devoluciones, setDevoluciones] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

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
      await devolucionService.create({
        id_venta: parseInt(formData.id_venta),
        fecha: formData.fecha,
        motivo: formData.motivo,
      });

      fetchData();
      setShowModal(false);

      alert('✅ Devolución registrada');

    } catch (error) {
      alert('❌ Error registrando devolución');
    }
  };

  if (loading) return <div className="loading">Cargando devoluciones...</div>;

  return (
    <div className="crud-container">

      <div className="crud-header">
        <h1>🔄 Devoluciones</h1>

        <button
          className="btn-primary"
          onClick={() => setShowModal(true)}
        >
          + Nueva Devolución
        </button>
      </div>

      <table className="crud-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Venta</th>
            <th>Fecha</th>
            <th>Motivo</th>
          </tr>
        </thead>

        <tbody>
          {devoluciones.map((d) => (
            <tr key={d.id_devolucion}>
              <td>{d.id_devolucion}</td>
              <td>Venta #{d.id_venta}</td>
              <td>{new Date(d.fecha).toLocaleDateString()}</td>
              <td>{d.motivo}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>

          <div className="modal-content" onClick={(e) => e.stopPropagation()}>

            <h2>Nueva Devolución</h2>

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label>Venta</label>

                <select
                  required
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

export default Devolucion;
