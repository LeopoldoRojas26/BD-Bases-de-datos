import React, { useState, useEffect } from 'react';
import { usuarioRolService } from '../services/api.service';
import './Crud.css';

const UsuarioRol = () => {
  const [asignaciones, setAsignaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAsignacion, setCurrentAsignacion] = useState(null);

  const [formData, setFormData] = useState({
    id_usuario: '',
    id_rol: ''
  });

  useEffect(() => {
    fetchAsignaciones();
  }, []);

  const fetchAsignaciones = async () => {
    try {
      setLoading(true);
      const response = await usuarioRolService.getAll();
      if (response.data.success) {
        setAsignaciones(response.data.data);
      }
    } catch (err) {
      setError('Error al cargar asignaciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (asignacion = null) => {
    if (asignacion) {
      setCurrentAsignacion(asignacion);
      setFormData({
        id_usuario: asignacion.id_usuario || '',
        id_rol: asignacion.id_rol || ''
      });
    } else {
      setCurrentAsignacion(null);
      setFormData({
        id_usuario: '',
        id_rol: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentAsignacion(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentAsignacion) {
        await usuarioRolService.update(currentAsignacion.id_usuario_rol, formData);
      } else {
        await usuarioRolService.create(formData);
      }
      closeModal();
      fetchAsignaciones();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar la asignación');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta asignación de rol?')) {
      try {
        await usuarioRolService.delete(id);
        fetchAsignaciones();
      } catch (err) {
        alert(err.response?.data?.error || 'Error al eliminar asignación');
        console.error('Error al eliminar asignación', err);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) return <div style={{ padding: '2rem' }}>Cargando asignaciones...</div>;

  return (
    <div className="crud-container" style={{ marginTop: '2rem' }}>
      <div className="crud-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#1e293b' }}>Gestión de Roles por Usuario</h2>
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
          + Asignar Rol
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <table className="crud-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '1rem' }}>ID Asignación</th>
              <th style={{ padding: '1rem' }}>Usuario</th>
              <th style={{ padding: '1rem' }}>Rol</th>
              <th style={{ padding: '1rem' }}>Fecha Asignación</th>
              <th style={{ padding: '1rem' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {asignaciones.map((asign) => (
              <tr key={asign.id_usuario_rol} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '1rem' }}>{asign.id_usuario_rol}</td>
                <td style={{ padding: '1rem', fontWeight: '500' }}>{asign.username} (ID: {asign.id_usuario})</td>
                <td style={{ padding: '1rem', fontWeight: 'bold', color: '#4f46e5' }}>{asign.nombre_rol} (ID: {asign.id_rol})</td>
                <td style={{ padding: '1rem' }}>{formatDate(asign.fecha_asignacion)}</td>
                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => openModal(asign)}
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(asign.id_usuario_rol)}
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {asignaciones.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                  No hay roles asignados a usuarios
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
              {currentAsignacion ? 'Editar Asignación' : 'Nueva Asignación de Rol'}
            </h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: '500', color: '#334155' }}>ID del Usuario:</label>
                <input
                  type="number"
                  name="id_usuario"
                  value={formData.id_usuario}
                  onChange={handleInputChange}
                  required
                  style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: '500', color: '#334155' }}>ID del Rol:</label>
                <input
                  type="number"
                  name="id_rol"
                  value={formData.id_rol}
                  onChange={handleInputChange}
                  required
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

export default UsuarioRol;
