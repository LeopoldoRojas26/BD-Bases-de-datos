import { useEffect, useState } from 'react';
import { pagosService, ventasService, metodosPagoService } from '../services/api.service';
import './Crud.css';

const Pagos = () => {
  const [pagos, setPagos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [metodos, setMetodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

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
      await pagosService.create({
        id_venta: parseInt(formData.id_venta),
        id_metodo_pago: parseInt(formData.id_metodo_pago),
        monto: parseFloat(formData.monto),
        fecha_pago: formData.fecha_pago,
      });

      fetchData();
      setShowModal(false);

      setFormData({
        id_venta: '',
        id_metodo_pago: '',
        monto: '',
        fecha_pago: '',
      });

      alert('✅ Pago registrado');

    } catch (error) {
      alert('❌ Error registrando pago');
    }
  };

  if (loading) return <div className="loading">Cargando pagos...</div>;

  return (
    <div className="crud-container">

      <div className="crud-header">
        <h1>💳 Gestión de Pagos</h1>

        <button
          className="btn-primary"
          onClick={() => setShowModal(true)}
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
          </tr>
        </thead>

        <tbody>
          {pagos.map((pago) => (
            <tr key={pago.id_pago}>
              <td>{pago.id_pago}</td>
              <td>Venta #{pago.id_venta}</td>
              <td>{pago.id_metodo_pago}</td>
              <td>${parseFloat(pago.monto).toFixed(2)}</td>
              <td>{new Date(pago.fecha_pago).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>

          <div className="modal-content" onClick={(e) => e.stopPropagation()}>

            <h2>Nuevo Pago</h2>

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
                  value={formData.monto}
                  onChange={(e) => setFormData({
                    ...formData,
                    monto: e.target.value,
                  })}
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
