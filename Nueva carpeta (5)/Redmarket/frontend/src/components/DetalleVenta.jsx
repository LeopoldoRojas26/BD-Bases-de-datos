import { useEffect, useState } from 'react';
import {
  detalleVentaService,
  ventasService,
  productosService
} from '../services/api.service';

import './Crud.css';

const DetalleVenta = () => {

  const [detalles, setDetalles] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [sessionReturned, setSessionReturned] = useState(() => {
    const saved = localStorage.getItem('returnedSales');
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    id_venta: '',
    id_producto: '',
    cantidad: '',
    precio_unitario: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    try {

      setLoading(true);

      const [detallesRes, ventasRes, productosRes] = await Promise.all([
        detalleVentaService.getAll(),
        ventasService.getAll(),
        productosService.getAll(),
      ]);

      setDetalles(detallesRes.data.data || []);
      setVentas(ventasRes.data.data || []);
      setProductos(productosRes.data.data || []);

    } catch (error) {

      alert('Error cargando detalles de venta');

    } finally {

      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await detalleVentaService.create({
        id_venta: parseInt(formData.id_venta),
        id_producto: parseInt(formData.id_producto),
        cantidad: parseInt(formData.cantidad),
        precio_unitario: parseFloat(formData.precio_unitario),
      });

      fetchData();

      setShowModal(false);

      setFormData({
        id_venta: '',
        id_producto: '',
        cantidad: '',
        precio_unitario: '',
      });

      alert('✅ Detalle registrado');

    } catch (error) {

      alert('❌ Error registrando detalle');
    }
  };

  const handleProductoChange = (value) => {

    const producto = productos.find(
      (p) => p.id_producto === parseInt(value)
    );

    setFormData({
      ...formData,
      id_producto: value,
      precio_unitario: producto ? producto.precio : '',
    });
  };

  if (loading) {
    return <div className="loading">Cargando detalles...</div>;
  }

  return (
    <div className="crud-container">

      <div className="crud-header">

        <h1>📦 Detalle de Venta</h1>

      </div>

      <table className="crud-table">

        <thead>
          <tr>
            <th>ID</th>
            <th>Venta</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Subtotal</th>
          </tr>
        </thead>

        <tbody>

          {detalles.map((d) => (

            <tr key={d.id_detalle}>

              <td>{d.id_detalle}</td>

              <td>
                Venta #{d.id_venta} {sessionReturned.includes(d.id_venta) && (
                  <span style={{ color: '#e74c3c', fontWeight: 'bold', marginLeft: '8px' }}>
                    (Devuelta)
                  </span>
                )}
              </td>

              <td>
                {productos.find(p => p.id_producto === d.id_producto)?.nombre || `Producto #${d.id_producto}`}
              </td>

              <td>{d.cantidad}</td>

              <td>
                ${parseFloat(d.precio_unitario).toFixed(2)}
              </td>

              <td>
                $
                {(
                  parseFloat(d.precio_unitario) *
                  parseInt(d.cantidad)
                ).toFixed(2)}
              </td>

            </tr>
          ))}

        </tbody>

      </table>

      {showModal && (

        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)}
        >

          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >

            <h2>Nuevo Detalle</h2>

            <form onSubmit={handleSubmit}>

              <div className="form-group">

                <label>Venta</label>

                <select
                  required
                  value={formData.id_venta}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      id_venta: e.target.value,
                    })
                  }
                >

                  <option value="">
                    Seleccionar venta
                  </option>

                  {ventas.map((v) => (

                    <option
                      key={v.id_venta}
                      value={v.id_venta}
                    >
                      Venta #{v.id_venta}
                    </option>

                  ))}

                </select>

              </div>

              <div className="form-group">

                <label>Producto</label>

                <select
                  required
                  value={formData.id_producto}
                  onChange={(e) =>
                    handleProductoChange(e.target.value)
                  }
                >

                  <option value="">
                    Seleccionar producto
                  </option>

                  {productos.map((p) => (

                    <option
                      key={p.id_producto}
                      value={p.id_producto}
                    >
                      {p.nombre} - ${p.precio}
                    </option>

                  ))}

                </select>

              </div>

              <div className="form-group">

                <label>Cantidad</label>

                <input
                  type="number"
                  min="1"
                  required
                  value={formData.cantidad}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cantidad: e.target.value,
                    })
                  }
                />

              </div>

              <div className="form-group">

                <label>Precio Unitario</label>

                <input
                  type="number"
                  step="0.01"
                  required
                  readOnly
                  value={formData.precio_unitario}
                />

              </div>

              <div className="modal-actions">

                <button
                  type="submit"
                  className="btn-primary"
                >
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

export default DetalleVenta;