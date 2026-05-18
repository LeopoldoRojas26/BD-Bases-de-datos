import React, { useState, useEffect } from 'react';
import { ordenCompraService, proveedoresService } from '../services/api.service';
import './Crud.css';

const OrdenCompra = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrden, setCurrentOrden] = useState(null);

  const [formData, setFormData] = useState({
    id_proveedor: '',
    fecha_orden: '',
    total_orden: '',
    estado_orden: 'pendiente',
    fecha_entrega: ''
  });

  useEffect(() => {
    fetchOrdenes();
    fetchProveedores();
  }, []);

  const fetchOrdenes = async () => {
    try {
      setLoading(true);
      const response = await ordenCompraService.getAll();
      if (response.data.success) {
        setOrdenes(response.data.data);
      }
    } catch (err) {
      setError('Error al cargar órdenes de compra');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProveedores = async () => {
    try {
      const response = await proveedoresService.getAll();
      if (response.data.success) {
        setProveedores(response.data.data);
      }
    } catch (err) {
      console.error('Error al cargar proveedores', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().split('T')[0];
  };

  const openModal = (orden = null) => {
    if (orden) {
      setCurrentOrden(orden);
      setFormData({
        id_proveedor: orden.id_proveedor || '',
        fecha_orden: formatDate(orden.fecha_orden),
        total_orden: orden.total_orden || '',
        estado_orden: orden.estado_orden || 'pendiente',
        fecha_entrega: formatDate(orden.fecha_entrega)
      });
    } else {
      setCurrentOrden(null);
      setFormData({
        id_proveedor: '',
        fecha_orden: '',
        total_orden: '',
        estado_orden: 'pendiente',
        fecha_entrega: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentOrden(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        fecha_orden: formData.fecha_orden || null,
        fecha_entrega: formData.fecha_entrega || null
      };

      if (currentOrden) {
        await ordenCompraService.update(currentOrden.id_orden_compra, dataToSend);
      } else {
        await ordenCompraService.create(dataToSend);
      }
      closeModal();
      fetchOrdenes();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar orden de compra');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de cancelar esta orden de compra?')) {
      try {
        await ordenCompraService.delete(id);
        fetchOrdenes();
      } catch (err) {
        console.error('Error al cancelar orden', err);
      }
    }
  };

  const getEstadoBadge = (estado) => {
    const estilos = {
      pendiente: { backgroundColor: '#fef3c7', color: '#92400e' },
      enviada: { backgroundColor: '#dbeafe', color: '#1e40af' },
      recibida: { backgroundColor: '#dcfce7', color: '#166534' },
      cancelada: { backgroundColor: '#fee2e2', color: '#991b1b' }
    };
    return estilos[estado] || { backgroundColor: '#f1f5f9', color: '#475569' };
  };

  if (loading) return <div style={{ padding: '2rem' }}>Cargando órdenes de compra...</div>;

  return (
    <div className="crud-container" style={{ marginTop: '2rem' }}>
      <div className="crud-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#1e293b' }}>Gestión de Órdenes de Compra</h2>
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
          + Añadir Orden
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <table className="crud-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '1rem' }}>ID</th>
              <th style={{ padding: '1rem' }}>Proveedor</th>
              <th style={{ padding: '1rem' }}>Fecha Orden</th>
              <th style={{ padding: '1rem' }}>Total</th>
              <th style={{ padding: '1rem' }}>Estado</th>
              <th style={{ padding: '1rem' }}>Fecha Entrega</th>
              <th style={{ padding: '1rem' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((orden) => (
              <tr key={orden.id_orden_compra} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '1rem' }}>{orden.id_orden_compra}</td>
                <td style={{ padding: '1rem', fontWeight: '500' }}>{orden.nombre_proveedor || orden.id_proveedor}</td>
                <td style={{ padding: '1rem' }}>{formatDate(orden.fecha_orden)}</td>
                <td style={{ padding: '1rem' }}>L. {parseFloat(orden.total_orden).toFixed(2)}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    padding: '0.3rem 0.6rem',
                    borderRadius: '999px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    ...getEstadoBadge(orden.estado_orden)
                  }}>
                    {orden.estado_orden}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>{orden.fecha_entrega ? formatDate(orden.fecha_entrega) : <span style={{color: '#94a3b8'}}>Sin definir</span>}</td>
                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => openModal(orden)}
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(orden.id_orden_compra)}
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Cancelar
                  </button>
                </td>
              </tr>
            ))}
            {ordenes.length === 0 && (
              <tr>
                <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                  No hay órdenes de compra registradas
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
              {currentOrden ? 'Editar Orden de Compra' : 'Añadir Orden de Compra'}
            </h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: '500', color: '#334155' }}>Proveedor:</label>
                <select
                  name="id_proveedor"
                  value={formData.id_proveedor}
                  onChange={handleInputChange}
                  required
                  style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value="">-- Seleccionar Proveedor --</option>
                  {proveedores.map((p) => (
                    <option key={p.id_proveedor} value={p.id_proveedor}>
                      {p.nombre_proveedor}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: '500', color: '#334155' }}>Fecha de Orden:</label>
                <input
                  type="date"
                  name="fecha_orden"
                  value={formData.fecha_orden}
                  onChange={handleInputChange}
                  style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: '500', color: '#334155' }}>Total de la Orden:</label>
                <input
                  type="number"
                  name="total_orden"
                  value={formData.total_orden}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: '500', color: '#334155' }}>Estado:</label>
                <select 
                  name="estado_orden" 
                  value={formData.estado_orden} 
                  onChange={handleInputChange}
                  style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="enviada">Enviada</option>
                  <option value="recibida">Recibida</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: '500', color: '#334155' }}>Fecha de Entrega (Opcional):</label>
                <input
                  type="date"
                  name="fecha_entrega"
                  value={formData.fecha_entrega}
                  onChange={handleInputChange}
                  style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
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

export default OrdenCompra;
