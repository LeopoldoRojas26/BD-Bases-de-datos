import React, { useState, useEffect } from 'react';
import { sesionesService } from '../services/api.service';
import './Crud.css';

const Sesiones = () => {
  const [sesiones, setSesiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSesiones();
  }, []);

  const fetchSesiones = async () => {
    try {
      setLoading(true);
      const response = await sesionesService.getAll();
      if (response.data.success) {
        setSesiones(response.data.data);
      }
    } catch (err) {
      setError('Error al cargar las sesiones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRevocar = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres cerrar esta sesión remotamente? El usuario será desconectado inmediatamente.')) {
      try {
        await sesionesService.revocar(id);
        fetchSesiones();
      } catch (err) {
        alert(err.response?.data?.error || 'Error al revocar sesión');
      }
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) return <div style={{ padding: '2rem' }}>Cargando control de sesiones...</div>;

  return (
    <div className="crud-container" style={{ marginTop: '2rem' }}>
      <div className="crud-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '0.5rem' }}>Control de Sesiones Activas</h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Monitorea o cierra forzosamente las sesiones de los usuarios en el sistema.
          </p>
        </div>
        <button
          onClick={fetchSesiones}
          style={{
            padding: '0.8rem 1.5rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          ↻ Actualizar
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <table className="crud-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid hsla(0, 32%, 91%, 0.00)' }}>
              <th style={{ padding: '1rem' }}>ID</th>
              <th style={{ padding: '1rem' }}>Usuario</th>
              <th style={{ padding: '1rem' }}>Dispositivo / IP</th>
              <th style={{ padding: '1rem' }}>Fecha de Inicio</th>
              <th style={{ padding: '1rem' }}>Estatus</th>
              <th style={{ padding: '1rem' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sesiones.map((sesion) => (
              <tr key={sesion.id_sesion} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: sesion.estatus === 'activa' ? 'white' : '#f8fafc' }}>
                <td style={{ padding: '1rem', color: '#64748b' }}>{sesion.id_sesion}</td>
                <td style={{ padding: '1rem', fontWeight: 'bold', color: '#4f46e5' }}>
                  {sesion.username} (ID: {sesion.id_usuario})
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: '500' }}>{sesion.dispositivo || 'Dispositivo desconocido'}</div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem' }}>IP: {sesion.ip_acceso || 'N/A'}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  {formatDateTime(sesion.fecha_inicio)}
                  <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Expira: {formatDateTime(sesion.fecha_expiracion)}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    backgroundColor: sesion.estatus === 'activa' ? '#dcfce3' :
                      sesion.estatus === 'cerrada' ? '#f1f5f9' : '#fee2e2',
                    color: sesion.estatus === 'activa' ? '#166534' :
                      sesion.estatus === 'cerrada' ? '#475569' : '#991b1b',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '9999px',
                    fontWeight: '500',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}>
                    {sesion.estatus === 'activa' && <span style={{ width: '6px', height: '6px', backgroundColor: '#166534', borderRadius: '50%' }}></span>}
                    {sesion.estatus.charAt(0).toUpperCase() + sesion.estatus.slice(1)}
                  </span>
                  {sesion.fecha_cierre && (
                    <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.3rem' }}>
                      Cierre: {formatDateTime(sesion.fecha_cierre)}
                    </div>
                  )}
                </td>
                <td style={{ padding: '1rem' }}>
                  {sesion.estatus === 'activa' ? (
                    <button
                      onClick={() => handleRevocar(sesion.id_sesion)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      Revocar Sesión
                    </button>
                  ) : (
                    <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No disponible</span>
                  )}
                </td>
              </tr>
            ))}
            {sesiones.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                  No hay registro de sesiones en el sistema.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sesiones;
