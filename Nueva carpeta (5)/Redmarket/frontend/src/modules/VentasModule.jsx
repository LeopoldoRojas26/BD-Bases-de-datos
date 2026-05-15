import { useState } from "react";

import Clientes from "../components/Clientes";
import Ventas from "../components/Ventas";
import MetodosPago from "../components/MetodosPago";

import Pagos from "../components/Pagos";
import Factura from "../components/Factura";
import Devolucion from "../components/Devolucion";
import DetalleVenta from "../components/DetalleVenta";

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

      case "pagos":
        return <Pagos />;

      case "factura":
        return <Factura />;

      case "devolucion":
        return <Devolucion />;

      case "detalle":
        return <DetalleVenta />;

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
          className={tab === "detalle" ? "active" : ""}
          onClick={() => setTab("detalle")}
        >
          Detalle Venta
        </button>

        <button
          className={tab === "metodos" ? "active" : ""}
          onClick={() => setTab("metodos")}
        >
          Métodos de Pago
        </button>

        <button
          className={tab === "pagos" ? "active" : ""}
          onClick={() => setTab("pagos")}
        >
          Pagos
        </button>

        <button
          className={tab === "factura" ? "active" : ""}
          onClick={() => setTab("factura")}
        >
          Facturas
        </button>

        <button
          className={tab === "devolucion" ? "active" : ""}
          onClick={() => setTab("devolucion")}
        >
          Devoluciones
        </button>

      </div>

      <div className="tab-content">
        {renderTab()}
      </div>

    </div>
  );
};

export default VentasModule;