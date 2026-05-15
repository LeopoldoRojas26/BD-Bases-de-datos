import { useState, useEffect } from "react";

const RRHHModule = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/empleados")
      .then((res) => res.json())
      .then((data) => {
        setEmpleados(data.data);
        setLoading(false);
      });
  }, []);

  const empleadosFiltrados = empleados.filter((e) =>
    e.nombre_completo.toLowerCase().includes(busqueda.toLowerCase()) ||
    e.nombre_departamento.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "#4a90d9", marginBottom: "20px" }}>
        Modulo de Recursos Humanos
      </h1>

      <input
        type="text"
        placeholder="Buscar empleado o departamento..."
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
        <p>Cargando empleados...</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          {empleadosFiltrados.map((e) => (
            <div
              key={e.id_empleado}
              style={{
                backgroundColor: "white",
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "16px",
                width: "280px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <div
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "50%",
                    backgroundColor: "#4a90d9",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    fontWeight: "bold",
                    marginRight: "10px",
                  }}
                >
                  {e.nombre.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "14px" }}>{e.nombre_completo}</div>
                  <div style={{ color: "#666", fontSize: "12px" }}>{e.nombre_puesto}</div>
                </div>
              </div>
              <div style={{ fontSize: "13px", color: "#444" }}>
                <p>Depto: {e.nombre_departamento}</p>
                <p>Turno: {e.nombre_turno}</p>
                <p>Email: {e.email}</p>
                <p>Ingreso: {new Date(e.fecha_ingreso).toLocaleDateString("es-MX")}</p>
                <span
                  style={{
                    backgroundColor: e.estatus === "activo" ? "#27ae60" : "#e74c3c",
                    color: "white",
                    padding: "3px 10px",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                >
                  {e.estatus.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RRHHModule;