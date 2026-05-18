import React, { useState } from 'react';
import Proveedores from '../components/Proveedores';
import OrdenCompra from '../components/OrdenCompra';
import DetalleOrdenCompra from '../components/DetalleOrdenCompra';
import RecepcionMercancia from '../components/RecepcionMercancia';

const ComprasModule = () => {
  const [activeTable, setActiveTable] = useState(null);
  const tables = [
    'Proveedores',
    'Orden_de_Compra',
    'Detalles_Orden_de_Compra',
    'Recepcion_de_Mercancia'
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
        Módulo Compras
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
        {activeTable === 'Proveedores' && <Proveedores />}
        {activeTable === 'Orden_de_Compra' && <OrdenCompra />}
        {activeTable === 'Detalles_Orden_de_Compra' && <DetalleOrdenCompra />}
        {activeTable === 'Recepcion_de_Mercancia' && <RecepcionMercancia />}
      </div>
    </div>
  );
};

export default ComprasModule;