import React, { useState } from 'react';
import Usuarios from '../components/Usuarios';
import Roles from '../components/Roles';
import UsuarioRol from '../components/UsuarioRol';
import PermisosSistema from '../components/PermisosSistema';
import RolPermiso from '../components/RolPermiso';
import Bitacora from '../components/Bitacora';
import Sesiones from '../components/Sesiones';

const AdminModule = () => {
  const [activeTable, setActiveTable] = useState(null);
  const tables = [
    'Usuarios',
    'Roles',
    'Usuario_rol',
    'Permisos_del_sistema',
    'Rol_permiso',
    'Bitacora',
    'Sesiones'
  ];

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        marginBottom: '2rem',
        color: '#1e293b',
        borderBottom: '2px solid #e2e8f0',
        paddingBottom: '0.5rem'
      }}>
        Módulo Admin
      </h1>

      <p style={{ marginBottom: '2rem', color: '#64748b', fontSize: '1.1rem' }}>
        Elige una opción
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1.5rem'
      }}>
        {tables.map((table, index) => (
          <button
            key={index}
            onClick={() => setActiveTable(table)}
            style={{
              padding: '1.2rem',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              transition: 'all 0.2s ease-in-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textTransform: 'capitalize'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#4338ca';
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#4f46e5';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
            }}
          >
            {table.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      <div style={{ marginTop: '2rem' }}>
        {activeTable === 'Usuarios' && <Usuarios />}
        {activeTable === 'Roles' && <Roles />}
        {activeTable === 'Usuario_rol' && <UsuarioRol />}
        {activeTable === 'Permisos_del_sistema' && <PermisosSistema />}
        {activeTable === 'Rol_permiso' && <RolPermiso />}
        {activeTable === 'Bitacora' && <Bitacora />}
        {activeTable === 'Sesiones' && <Sesiones />}
        {activeTable && activeTable !== 'Usuarios' && activeTable !== 'Roles' && activeTable !== 'Usuario_rol' && activeTable !== 'Permisos_del_sistema' && activeTable !== 'Rol_permiso' && activeTable !== 'Bitacora' && activeTable !== 'Sesiones' && (
          <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
            <h3 style={{ color: '#475569' }}>El CRUD de la tabla {activeTable.replace(/_/g, ' ')} está en desarrollo.</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminModule;