import { useEffect, useState } from 'react';
import { facturaService, ventasService } from '../services/api.service';
import './Crud.css';

const Factura = () => {
  const [facturas, setFacturas] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    id_venta: '',
    fecha_emision: '',
    total: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [facturasRes, ventasRes] = await Promise.all([
        facturaService.getAll(),
        ventasService.getAll(),
      ]);

      setFacturas(facturasRes.data.data || []);
      setVentas(ventasRes.data.data || []);

    } catch (error) {
      alert('Error cargando facturas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await facturaService.create({
        id_venta: parseInt(formData.id_venta),
        fecha_emision: formData.fecha_emision,
        total: parseFloat(formData.total),
      });

      fetchData();
      setShowModal(false);

      alert('✅ Factura registrada');

    } catch (error) {
      alert('❌ Error registrando factura');
    }
  };

  if (loading) return <div className="loading">Cargando facturas...</div>;

  return (
    <div className="crud-container">

      <div className="crud-header">
        <h1>🧾 Facturas</h1>

        <button
          className="btn-primary"
          onClick={() => setShowModal(true)}
        >
          + Nueva Factura
        </button>
      </div>

      <table className="crud-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Venta</th>
            <th>Fecha</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {facturas.map((f) => (
            <tr key={f.id_factura}>
              <td>{f.id_factura}</td>
              <td>Venta #{f.id_venta}</td>
              <td>{new Date(f.fecha_emision).toLocaleDateString()}</td>
              <td>${parseFloat(f.total).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>

          <div className="modal-content" onClick={(e) => e.stopPropagation()}>

            <h2>Nueva Factura</h2>

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
                <label>Fecha emisión</label>

                <input
                  type="date"
                  required
                  value={formData.fecha_emision}
                  onChange={(e) => setFormData({
                    ...formData,
                    fecha_emision: e.target.value,
                  })}
                />
              </div>

              <div className="form-group">
                <label>Total</label>

                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.total}
                  onChange={(e) => setFormData({
                    ...formData,
                    total: e.target.value,
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

export default Factura;
