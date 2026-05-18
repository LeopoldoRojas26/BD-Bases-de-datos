import { useState } from "react";

import Clientes from "../components/Clientes";
import Ventas from "../components/Ventas";
import MetodosPago from "../components/MetodosPago";

import Pagos from "../components/Pagos";

import Devolucion from "../components/Devolucion";
import DetalleVenta from "../components/DetalleVenta";

import "./Module.css";

const VentasModule = () => {
  const [activeTab, setActiveTab] = useState(null);

  const tabs = [
    { id: 'clientes', label: 'Clientes' },
    { id: 'ventas', label: 'Ventas' },
    { id: 'detalle', label: 'Detalle Venta' },
    { id: 'metodos', label: 'Métodos de Pago' },
    { id: 'pagos', label: 'Pagos' },
    { id: 'devolucion', label: 'Devoluciones' },
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
        Módulo de Ventas
      </h1>

      <p style={{ marginBottom: '2rem', color: '#64748b', fontSize: '1.1rem' }}>
        Elige una opción
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1.5rem'
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: '2rem' }}>
        {activeTab === 'clientes' && <Clientes />}
        {activeTab === 'ventas' && <Ventas />}
        {activeTab === 'detalle' && <DetalleVenta />}
        {activeTab === 'metodos' && <MetodosPago />}
        {activeTab === 'pagos' && <Pagos />}

        {activeTab === 'devolucion' && <Devolucion />}
      </div>
    </div>
  );
};

export default VentasModule;