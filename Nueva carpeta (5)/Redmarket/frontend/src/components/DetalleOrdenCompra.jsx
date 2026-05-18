import React, { useState, useEffect } from 'react';
import { detalleOrdenCompraService, ordenCompraService, productosService } from '../services/api.service';
import './Crud.css';

const DetalleOrdenCompra = () => {
  const [detalles, setDetalles] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDetalle, setCurrentDetalle] = useState(null);

  const [formData, setFormData] = useState({
    id_orden_compra: '',
    id_producto: '',
    cantidad: '',
    precio_unitario: ''
  });

  useEffect(() => {
    fetchDetalles();
    fetchOrdenes();
    fetchProductos();
  }, []);

  const fetchDetalles = async () => {
    try {
      setLoading(true);
      const response = await detalleOrdenCompraService.getAll();
      if (response.data.success) {
        setDetalles(response.data.data);
      }
    } catch (err) {
      setError('Error al cargar detalles de orden');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrdenes = async () => {
    try {
      const response = await ordenCompraService.getAll();
      if (response.data.success) {
        setOrdenes(response.data.data);
      }
    } catch (err) {
      console.error('Error al cargar órdenes', err);
    }
  };

  const fetchProductos = async () => {
    try {
      const response = await productosService.getAll();
      if (response.data.success) {
        setProductos(response.data.data);
      }
    } catch (err) {
      console.error('Error al cargar productos', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const calcularSubtotal = () => {
    const cantidad = parseFloat(formData.cantidad) || 0;
    const precio = parseFloat(formData.precio_unitario) || 0;
    return (cantidad * precio).toFixed(2);
  };

  const openModal = (detalle = null) => {
    if (detalle) {
      setCurrentDetalle(detalle);
      setFormData({
        id_orden_compra: detalle.id_orden_compra || '',
        id_producto: detalle.id_producto || '',
        cantidad: detalle.cantidad || '',
        precio_unitario: detalle.precio_unitario || ''
      });
    } else {
      setCurrentDetalle(null);
      setFormData({
        id_orden_compra: '',
        id_producto: '',
        cantidad: '',
        precio_unitario: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentDetalle(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        id_orden_compra: parseInt(formData.id_orden_compra),
        id_producto: parseInt(formData.id_producto),
        cantidad: parseInt(formData.cantidad),
        precio_unitario: parseFloat(formData.precio_unitario)
      };

      if (currentDetalle) {
        await detalleOrdenCompraService.update(currentDetalle.id_detalle_orden, dataToSend);
      } else {
        await detalleOrdenCompraService.create(dataToSend);
      }
      closeModal();
      fetchDetalles();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar detalle de orden');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este detalle de orden?')) {
      try {
        await detalleOrdenCompraService.delete(id);
        fetchDetalles();
      } catch (err) {
        console.error('Error al eliminar detalle', err);
      }
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Cargando detalles de orden de compra...</div>;

  return (
    <div className="crud-container" style={{ marginTop: '2rem' }}>
      <div className="crud-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#1e293b' }}>Gestión de Detalles de Orden de Compra</h2>
        <button 
          onClick={() => openModal()}
          style={{
            padding: '0.8rem 1.5rem',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          + Añadir Detalle
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <table className="crud-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '1rem' }}>ID</th>
              <th style={{ padding: '1rem' }}>Orden #</th>
              <th style={{ padding: '1rem' }}>Proveedor</th>
              <th style={{ padding: '1rem' }}>Producto</th>
              <th style={{ padding: '1rem' }}>Cantidad</th>
              <th style={{ padding: '1rem' }}>Precio Unit.</th>
              <th style={{ padding: '1rem' }}>Subtotal</th>
              <th style={{ padding: '1rem' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {detalles.map((detalle) => (
              <tr key={detalle.id_detalle_orden} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '1rem' }}>{detalle.id_detalle_orden}</td>
                <td style={{ padding: '1rem', fontWeight: '500' }}>{detalle.id_orden_compra}</td>
                <td style={{ padding: '1rem' }}>{detalle.nombre_proveedor || <span style={{color: '#94a3b8'}}>N/A</span>}</td>
                <td style={{ padding: '1rem' }}>{detalle.nombre_producto || detalle.id_producto}</td>
                <td style={{ padding: '1rem' }}>{detalle.cantidad}</td>
                <td style={{ padding: '1rem' }}>L. {parseFloat(detalle.precio_unitario).toFixed(2)}</td>
                <td style={{ padding: '1rem', fontWeight: '600', color: '#059669' }}>L. {parseFloat(detalle.subtotal).toFixed(2)}</td>
                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => openModal(detalle)}
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(detalle.id_detalle_orden)}
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {detalles.length === 0 && (
              <tr>
                <td colSpan="8" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                  No hay detalles de orden registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', 
          justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white', padding: '2rem', borderRadius: '12px', 
            width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.25rem' }}>
              {currentDetalle ? 'Editar Detalle de Orden' : 'Añadir Detalle de Orden'}
            </h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: '500', color: '#334155' }}>Orden de Compra:</label>
                <select
                  name="id_orden_compra"
                  value={formData.id_orden_compra}
                  onChange={handleInputChange}
                  required
                  style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value="">-- Seleccionar Orden --</option>
                  {ordenes.map((o) => (
                    <option key={o.id_orden_compra} value={o.id_orden_compra}>
                      Orden #{o.id_orden_compra} - {o.nombre_proveedor || 'Proveedor ' + o.id_proveedor} ({o.estado_orden})
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: '500', color: '#334155' }}>Producto:</label>
                <select
                  name="id_producto"
                  value={formData.id_producto}
                  onChange={handleInputChange}
                  required
                  style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value="">-- Seleccionar Producto --</option>
                  {productos.map((p) => (
                    <option key={p.id_producto} value={p.id_producto}>
                      {p.nombre} - L. {parseFloat(p.precio).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: '500', color: '#334155' }}>Cantidad:</label>
                <input
                  type="number"
                  name="cantidad"
                  value={formData.cantidad}
                  onChange={handleInputChange}
                  required
                  min="1"
                  style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: '500', color: '#334155' }}>Precio Unitario:</label>
                <input
                  type="number"
                  name="precio_unitario"
                  value={formData.precio_unitario}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div style={{ 
                padding: '0.75rem', 
                backgroundColor: '#f0fdf4', 
                borderRadius: '6px', 
                border: '1px solid #bbf7d0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontWeight: '500', color: '#166534' }}>Subtotal calculado:</span>
                <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#166534' }}>L. {calcularSubtotal()}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  type="button" 
                  onClick={closeModal}
                  style={{ padding: '0.75rem 1.5rem', backgroundColor: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  style={{ padding: '0.75rem 1.5rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetalleOrdenCompra;
