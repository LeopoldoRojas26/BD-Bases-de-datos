import React, { useState, useEffect } from 'react';
import { recepcionMercanciaService, ordenCompraService } from '../services/api.service';
import './Crud.css';

const RecepcionMercancia = () => {
  const [recepciones, setRecepciones] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecepcion, setCurrentRecepcion] = useState(null);

  const [formData, setFormData] = useState({
    id_orden_compra: '',
    fecha_recepcion: '',
    recibido_por: '',
    estado_recepcion: 'completa',
    observaciones: ''
  });

  useEffect(() => {
    fetchRecepciones();
    fetchOrdenes();
  }, []);

  const fetchRecepciones = async () => {
    try {
      setLoading(true);
      const response = await recepcionMercanciaService.getAll();
      if (response.data.success) {
        setRecepciones(response.data.data);
      }
    } catch (err) {
      setError('Error al cargar recepciones de mercancía');
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleString('es-HN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().slice(0, 16);
  };

  const openModal = (recepcion = null) => {
    if (recepcion) {
      setCurrentRecepcion(recepcion);
      setFormData({
        id_orden_compra: recepcion.id_orden_compra || '',
        fecha_recepcion: formatDateForInput(recepcion.fecha_recepcion),
        recibido_por: recepcion.recibido_por || '',
        estado_recepcion: recepcion.estado_recepcion || 'completa',
        observaciones: recepcion.observaciones || ''
      });
    } else {
      setCurrentRecepcion(null);
      setFormData({
        id_orden_compra: '',
        fecha_recepcion: '',
        recibido_por: '',
        estado_recepcion: 'completa',
        observaciones: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentRecepcion(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        fecha_recepcion: formData.fecha_recepcion || null,
        observaciones: formData.observaciones || null
      };

      if (currentRecepcion) {
        await recepcionMercanciaService.update(currentRecepcion.id_recepcion, dataToSend);
      } else {
        await recepcionMercanciaService.create(dataToSend);
      }
      closeModal();
      fetchRecepciones();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar recepción');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta recepción de mercancía?')) {
      try {
        await recepcionMercanciaService.delete(id);
        fetchRecepciones();
      } catch (err) {
        console.error('Error al eliminar recepción', err);
      }
    }
  };

  const getEstadoBadge = (estado) => {
    const estilos = {
      completa: { backgroundColor: '#dcfce7', color: '#166534' },
      parcial: { backgroundColor: '#fef3c7', color: '#92400e' },
      pendiente: { backgroundColor: '#dbeafe', color: '#1e40af' },
      rechazada: { backgroundColor: '#fee2e2', color: '#991b1b' }
    };
    return estilos[estado] || { backgroundColor: '#f1f5f9', color: '#475569' };
  };

  if (loading) return <div style={{ padding: '2rem' }}>Cargando recepciones de mercancía...</div>;

  return (
    <div className="crud-container" style={{ marginTop: '2rem' }}>
      <div className="crud-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#1e293b' }}>Gestión de Recepción de Mercancía</h2>
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
          + Añadir Recepción
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <table className="crud-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', tableLayout: 'fixed' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '0.75rem', width: '50px' }}>ID</th>
              <th style={{ padding: '0.75rem', width: '70px' }}>Orden #</th>
              <th style={{ padding: '0.75rem', width: '130px' }}>Proveedor</th>
              <th style={{ padding: '0.75rem', width: '140px' }}>Fecha Recepción</th>
              <th style={{ padding: '0.75rem', width: '120px' }}>Recibido Por</th>
              <th style={{ padding: '0.75rem', width: '100px' }}>Estado</th>
              <th style={{ padding: '0.75rem' }}>Observaciones</th>
              <th style={{ padding: '0.75rem', width: '100px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {recepciones.map((recepcion) => (
              <tr key={recepcion.id_recepcion} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.75rem' }}>{recepcion.id_recepcion}</td>
                <td style={{ padding: '0.75rem', fontWeight: '500' }}>{recepcion.id_orden_compra}</td>
                <td style={{ padding: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{recepcion.nombre_proveedor || <span style={{ color: '#94a3b8' }}>N/A</span>}</td>
                <td style={{ padding: '0.75rem', fontSize: '0.9rem' }}>{formatDateTime(recepcion.fecha_recepcion)}</td>
                <td style={{ padding: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{recepcion.recibido_por}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{
                    padding: '0.2rem 0.5rem',
                    borderRadius: '999px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    ...getEstadoBadge(recepcion.estado_recepcion)
                  }}>
                    {recepcion.estado_recepcion}
                  </span>
                </td>
                <td style={{ padding: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {recepcion.observaciones || <span style={{ color: '#94a3b8' }}>Sin observaciones</span>}
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <button
                      onClick={() => openModal(recepcion)}
                      style={{ padding: '0.4rem 0.6rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(recepcion.id_recepcion)}
                      style={{ padding: '0.4rem 0.6rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {recepciones.length === 0 && (
              <tr>
                <td colSpan="8" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                  No hay recepciones de mercancía registradas
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
            width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.25rem' }}>
              {currentRecepcion ? 'Editar Recepción' : 'Añadir Recepción'}
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
                <label style={{ fontWeight: '500', color: '#334155' }}>Fecha de Recepción:</label>
                <input
                  type="datetime-local"
                  name="fecha_recepcion"
                  value={formData.fecha_recepcion}
                  onChange={handleInputChange}
                  style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: '500', color: '#334155' }}>Recibido Por:</label>
                <input
                  type="text"
                  name="recibido_por"
                  value={formData.recibido_por}
                  onChange={handleInputChange}
                  required
                  maxLength={100}
                  placeholder="Nombre de quien recibe"
                  style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: '500', color: '#334155' }}>Estado de Recepción:</label>
                <select
                  name="estado_recepcion"
                  value={formData.estado_recepcion}
                  onChange={handleInputChange}
                  style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value="completa">Completa</option>
                  <option value="parcial">Parcial</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="rechazada">Rechazada</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: '500', color: '#334155' }}>Observaciones (Opcional):</label>
                <textarea
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Notas adicionales sobre la recepción..."
                  style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', resize: 'vertical', fontFamily: 'inherit' }}
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

export default RecepcionMercancia;
