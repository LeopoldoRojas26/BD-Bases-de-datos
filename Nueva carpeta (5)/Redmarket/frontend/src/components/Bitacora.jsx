import React, { useState, useEffect } from 'react';
import { bitacoraService } from '../services/api.service';
import './Crud.css';

const Bitacora = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await bitacoraService.getAll();
      if (response.data.success) {
        setLogs(response.data.data);
      }
    } catch (err) {
      setError('Error al cargar la bitácora');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) return <div style={{ padding: '2rem' }}>Cargando bitácora del sistema...</div>;

  return (
    <div className="crud-container" style={{ marginTop: '2rem' }}>
      <div className="crud-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '0.5rem' }}>Bitácora del Sistema</h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Registro inmutable de todas las acciones importantes realizadas por los usuarios.
          </p>
        </div>
        <button 
          onClick={fetchLogs}
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
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '1rem' }}>ID</th>
              <th style={{ padding: '1rem' }}>Fecha y Hora</th>
              <th style={{ padding: '1rem' }}>Usuario</th>
              <th style={{ padding: '1rem' }}>Acción</th>
              <th style={{ padding: '1rem' }}>Tabla Afectada</th>
              <th style={{ padding: '1rem' }}>Detalles (Anterior / Nuevo)</th>
              <th style={{ padding: '1rem' }}>IP Origen</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id_log} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '1rem', color: '#64748b' }}>{log.id_log}</td>
                <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>{formatDateTime(log.fecha_hora)}</td>
                <td style={{ padding: '1rem', fontWeight: 'bold', color: '#4f46e5' }}>
                  {log.username} (ID: {log.id_usuario})
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    backgroundColor: log.accion.toUpperCase().includes('DELETE') || log.accion.toUpperCase().includes('ELIMINAR') ? '#fee2e2' : 
                                     log.accion.toUpperCase().includes('INSERT') || log.accion.toUpperCase().includes('CREAR') ? '#dcfce3' : 
                                     log.accion.toUpperCase().includes('UPDATE') || log.accion.toUpperCase().includes('ACTUALIZAR') ? '#e0e7ff' : '#f1f5f9',
                    color: log.accion.toUpperCase().includes('DELETE') || log.accion.toUpperCase().includes('ELIMINAR') ? '#991b1b' : 
                           log.accion.toUpperCase().includes('INSERT') || log.accion.toUpperCase().includes('CREAR') ? '#166534' : 
                           log.accion.toUpperCase().includes('UPDATE') || log.accion.toUpperCase().includes('ACTUALIZAR') ? '#3730a3' : '#334155',
                    padding: '0.3rem 0.6rem', 
                    borderRadius: '4px', 
                    fontWeight: '500'
                  }}>
                    {log.accion}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  {log.tabla_afectada} {log.id_registro && <span style={{color: '#64748b'}}>(ID: {log.id_registro})</span>}
                </td>
                <td style={{ padding: '1rem', maxWidth: '300px' }}>
                  {log.datos_anteriores && (
                    <div style={{ marginBottom: '0.5rem', padding: '0.5rem', backgroundColor: '#fee2e2', borderRadius: '4px', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                      <strong style={{color: '#991b1b', fontSize: '0.75rem', display: 'block', marginBottom: '0.2rem'}}>Anterior:</strong>
                      {log.datos_anteriores}
                    </div>
                  )}
                  {log.datos_nuevos && (
                    <div style={{ padding: '0.5rem', backgroundColor: '#dcfce3', borderRadius: '4px', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                      <strong style={{color: '#166534', fontSize: '0.75rem', display: 'block', marginBottom: '0.2rem'}}>Nuevo:</strong>
                      {log.datos_nuevos}
                    </div>
                  )}
                  {!log.datos_anteriores && !log.datos_nuevos && <span style={{color: '#94a3b8'}}>-</span>}
                </td>
                <td style={{ padding: '1rem', color: '#64748b' }}>{log.ip_origen || 'N/A'}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                  La bitácora está vacía. No hay registros de actividad.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bitacora;
