import { useState } from "react";
import Clientes from "../components/Clientes";
import Ventas from "../components/Ventas";
import MetodosPago from "../components/MetodosPago";
import "./Module.css";

const VentasModule = () => {
  const [tab, setTab] = useState("clientes");

  const renderTab = () => {
    switch (tab) {
      case "clientes":
        return <Clientes />;
      case "ventas":
        return <Ventas />;
      case "metodos":
        return <MetodosPago />;
      default:
        return <Clientes />;
    }
  };

  return (
    <div className="module-container">
      <h1>Módulo de Ventas</h1>

      <div className="tabs">
        <button 
          className={tab === "clientes" ? "active" : ""} 
          onClick={() => setTab("clientes")}
        >
          Clientes
        </button>

        <button 
          className={tab === "ventas" ? "active" : ""} 
          onClick={() => setTab("ventas")}
        >
          Ventas
        </button>

        <button 
          className={tab === "metodos" ? "active" : ""} 
          onClick={() => setTab("metodos")}
        >
          Métodos de Pago
        </button>
      </div>

      <div className="tab-content">
        {renderTab()}
      </div>
    </div>
  );
};

export default VentasModule;