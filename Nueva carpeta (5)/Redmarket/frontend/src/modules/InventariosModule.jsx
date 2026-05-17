import { useState, useEffect } from "react";

const InventariosModule = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/productos")
      .then((res) => res.json())
      .then((data) => {
        setProductos(data.data);
        setLoading(false);
      });
  }, []);

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const getEstadoStock = (actual, minimo) => {
    if (actual === 0) return { texto: "AGOTADO", color: "#e74c3c" };
    if (actual <= minimo) return { texto: "STOCK BAJO", color: "#e67e22" };
    return { texto: "NORMAL", color: "#27ae60" };
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "#4a90d9", marginBottom: "20px" }}>
        📦 Módulo de Inventarios
      </h1>

      <input
        type="text"
        placeholder="🔍 Buscar producto..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          marginBottom: "20px",
          fontSize: "14px",
        }}
      />

      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#4a90d9", color: "white" }}>
              <th style={{ padding: "10px", textAlign: "left" }}>Producto</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Categoría</th>
              <th style={{ padding: "10px", textAlign: "center" }}>Stock Actual</th>
              <th style={{ padding: "10px", textAlign: "center" }}>Stock Mínimo</th>
              <th style={{ padding: "10px", textAlign: "center" }}>Stock Máximo</th>
              <th style={{ padding: "10px", textAlign: "center" }}>Precio</th>
              <th style={{ padding: "10px", textAlign: "center" }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((p, i) => {
              const estado = getEstadoStock(p.stock_actual, p.stock_minimo);
              return (
                <tr
                  key={p.id_producto}
                  style={{ backgroundColor: i % 2 === 0 ? "#f9f9f9" : "white" }}
                >
                  <td style={{ padding: "10px" }}>{p.nombre}</td>
                  <td style={{ padding: "10px" }}>{p.categoria}</td>
                  <td style={{ padding: "10px", textAlign: "center" }}>{p.stock_actual}</td>
                  <td style={{ padding: "10px", textAlign: "center" }}>{p.stock_minimo}</td>
                  <td style={{ padding: "10px", textAlign: "center" }}>{p.stock_maximo}</td>
                  <td style={{ padding: "10px", textAlign: "center" }}>${p.precio}</td>
                  <td style={{ padding: "10px", textAlign: "center" }}>
                    <span
                      style={{
                        backgroundColor: estado.color,
                        color: "white",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      {estado.texto}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InventariosModule;