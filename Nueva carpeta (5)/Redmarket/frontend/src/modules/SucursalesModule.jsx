import { useState, useEffect } from "react";

const SucursalesModule = () => {
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/sucursales")
      .then((res) => res.json())
      .then((data) => {
        setSucursales(data.data);
        setLoading(false);
      });
  }, []);

  const sucursalesFiltradas = sucursales.filter((s) =>
    s.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    s.estado.toLowerCase().includes(busqueda.toLowerCase()) ||
    s.ciudad.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "#4a90d9", marginBottom: "20px" }}>
        Modulo de Sucursales
      </h1>

      <input
        type="text"
        placeholder="Buscar por nombre, ciudad o estado..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{
          padding: "10px",
          width: "350px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          marginBottom: "20px",
          fontSize: "14px",
        }}
      />

      {loading ? (
        <p>Cargando sucursales...</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          {sucursalesFiltradas.map((s) => (
            <div
              key={s.id_sucursal}
              style={{
                backgroundColor: "white",
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "16px",
                width: "280px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{
                  backgroundColor: "#4a90d9",
                  color: "white",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  marginBottom: "12px",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                {s.nombre}
              </div>
              <div style={{ fontSize: "13px", color: "#444" }}>
                <p>Direccion: {s.direccion}</p>
                <p>Colonia: {s.colonia}</p>
                <p>Ciudad: {s.ciudad}</p>
                <p>Estado: {s.estado}</p>
                <p>CP: {s.codigo_postal}</p>
                <p>Tel: {s.telefono}</p>
                <span
                  style={{
                    backgroundColor: s.activo ? "#27ae60" : "#e74c3c",
                    color: "white",
                    padding: "3px 10px",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                >
                  {s.activo ? "ACTIVA" : "INACTIVA"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SucursalesModule;