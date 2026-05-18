import React, { useState, useEffect } from 'react';
import { permisosSistemaService } from '../services/api.service';
import './Crud.css';

const PermisosSistema = () => {
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPermiso, setCurrentPermiso] = useState(null);

  const [formData, setFormData] = useState({
    nombre_permiso: '',
    modulo: '',
    descripcion: ''
  });

  useEffect(() => {
    fetchPermisos();
  }, []);

  const fetchPermisos = async () => {
    try {
      setLoading(true);
      const response = await permisosSistemaService.getAll();
      if (response.data.success) {
        setPermisos(response.data.data);
      }
    } catch (err) {
      setError('Error al cargar permisos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (permiso = null) => {
    if (permiso) {
      setCurrentPermiso(permiso);
      setFormData({
        nombre_permiso: permiso.nombre_permiso || '',
        modulo: permiso.modulo || '',
        descripcion: permiso.descripcion || ''
      });
    } else {
      setCurrentPermiso(null);
      setFormData({
        nombre_permiso: '',
        modulo: '',
        descripcion: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPermiso(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentPermiso) {
        await permisosSistemaService.update(currentPermiso.id_permiso_sys, formData);
      } else {
        await permisosSistemaService.create(formData);
      }
      closeModal();
      fetchPermisos();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar el permiso');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este permiso del sistema?')) {
      try {
        await permisosSistemaService.delete(id);
        fetchPermisos();
      } catch (err) {
        alert(err.response?.data?.error || 'Error al eliminar permiso');
        console.error('Error al eliminar permiso', err);
      }
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Cargando permisos...</div>;

  return (
    <div className="crud-container" style={{ marginTop: '2rem' }}>
      <div className="crud-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#1e293b' }}>Gestión de Permisos del Sistema</h2>
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
          + Añadir Permiso
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <table className="crud-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '1rem' }}>ID</th>
              <th style={{ padding: '1rem' }}>Nombre Permiso</th>
              <th style={{ padding: '1rem' }}>Módulo</th>
              <th style={{ padding: '1rem' }}>Descripción</th>
              <th style={{ padding: '1rem' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {permisos.map((permiso) => (
              <tr key={permiso.id_permiso_sys} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '1rem' }}>{permiso.id_permiso_sys}</td>
                <td style={{ padding: '1rem', fontWeight: 'bold', color: '#4f46e5' }}>{permiso.nombre_permiso}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ backgroundColor: '#f1f5f9', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.875rem' }}>
                    {permiso.modulo}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>{permiso.descripcion || <span style={{color: '#94a3b8'}}>N/A</span>}</td>
                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => openModal(permiso)}
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(permiso.id_permiso_sys)}
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {permisos.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                  No hay permisos registrados en el sistema
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
              {currentPermiso ? 'Editar Permiso' : 'Añadir Permiso'}
            </h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: '500', color: '#334155' }}>Nombre del Permiso:</label>
                <input
                  type="text"
                  name="nombre_permiso"
                  value={formData.nombre_permiso}
                  onChange={handleInputChange}
                  required
                  placeholder="ej. CREAR_USUARIO"
                  style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: '500', color: '#334155' }}>Módulo:</label>
                <input
                  type="text"
                  name="modulo"
                  value={formData.modulo}
                  onChange={handleInputChange}
                  required
                  placeholder="ej. Usuarios"
                  style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: '500', color: '#334155' }}>Descripción (Opcional):</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  rows="3"
                  style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', resize: 'vertical' }}
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

export default PermisosSistema;
