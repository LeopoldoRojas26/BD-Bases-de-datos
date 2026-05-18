import { useState, useEffect } from "react";
import { empleadosService } from "../services/api.service";
import "../components/Productos.css";

const RRHHModule = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [catalogos, setCatalogos] = useState({
    puestos: [],
    departamentos: [],
    turnos: [],
  });

  const [formData, setFormData] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    fecha_nacimiento: "",
    sexo: "",
    curp: "",
    rfc: "",
    email: "",
    telefono: "",
    id_puesto: "",
    id_departamento: "",
    id_turno: "",
    fecha_ingreso: "",
    estatus: "activo",
  });

  const fetchEmpleados = async () => {
    try {
      const response = await empleadosService.getAll();
      setEmpleados(response.data.data || response.data);
    } catch (err) {
      alert("Error al cargar empleados: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCatalogos = async () => {
    try {
      const response = await empleadosService.getCatalogos();
      setCatalogos(response.data.data || response.data);
    } catch (err) {
      alert("Error al cargar catálogos: " + err.message);
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const resetForm = () => {
    setFormData({
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      fecha_nacimiento: "",
      sexo: "",
      curp: "",
      rfc: "",
      email: "",
      telefono: "",
      id_puesto: "",
      id_departamento: "",
      id_turno: "",
      fecha_ingreso: "",
      estatus: "activo",
    });
  };

  const openCreateModal = async () => {
    await fetchCatalogos();
    resetForm();
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        id_puesto: parseInt(formData.id_puesto),
        id_departamento: parseInt(formData.id_departamento),
        id_turno: parseInt(formData.id_turno),
      };

      await empleadosService.create(payload);
      await fetchEmpleados();
      setShowModal(false);
      resetForm();
      alert("✅ Empleado creado exitosamente");
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      alert("❌ Error al crear empleado: " + errorMsg);
    }
  };

  const empleadosFiltrados = empleados.filter(
    (e) =>
      e.nombre_completo.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.nombre_departamento.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="productos-container">
      <div className="productos-header">
        <h1 style={{ color: "#4a90d9", marginBottom: 0 }}>
          Modulo de Recursos Humanos
        </h1>
        <button className="btn-primary" onClick={openCreateModal}>
          + Nuevo Empleado
        </button>
      </div>

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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
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
                  <div style={{ fontWeight: "bold", fontSize: "14px" }}>
                    {e.nombre_completo}
                  </div>
                  <div style={{ color: "#666", fontSize: "12px" }}>
                    {e.nombre_puesto}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: "13px", color: "#444" }}>
                <p>Depto: {e.nombre_departamento}</p>
                <p>Turno: {e.nombre_turno}</p>
                <p>Email: {e.email}</p>
                <p>
                  Ingreso: {new Date(e.fecha_ingreso).toLocaleDateString("es-MX")}
                </p>
                <span
                  style={{
                    backgroundColor:
                      e.estatus === "activo" ? "#27ae60" : "#e74c3c",
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

      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => {
            setShowModal(false);
            resetForm();
          }}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Nuevo Empleado</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Apellido paterno *</label>
                <input
                  type="text"
                  value={formData.apellido_paterno}
                  onChange={(e) =>
                    setFormData({ ...formData, apellido_paterno: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Apellido materno</label>
                <input
                  type="text"
                  value={formData.apellido_materno}
                  onChange={(e) =>
                    setFormData({ ...formData, apellido_materno: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Fecha de nacimiento *</label>
                <input
                  type="date"
                  value={formData.fecha_nacimiento}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fecha_nacimiento: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Sexo *</label>
                <select
                  value={formData.sexo}
                  onChange={(e) =>
                    setFormData({ ...formData, sexo: e.target.value })
                  }
                  required
                >
                  <option value="">Seleccionar sexo</option>
                  <option value="M">M</option>
                  <option value="F">F</option>
                </select>
              </div>

              <div className="form-group">
                <label>CURP *</label>
                <input
                  type="text"
                  value={formData.curp}
                  onChange={(e) =>
                    setFormData({ ...formData, curp: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>RFC *</label>
                <input
                  type="text"
                  value={formData.rfc}
                  onChange={(e) =>
                    setFormData({ ...formData, rfc: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="text"
                  value={formData.telefono}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Puesto *</label>
                <select
                  value={formData.id_puesto}
                  onChange={(e) =>
                    setFormData({ ...formData, id_puesto: e.target.value })
                  }
                  required
                >
                  <option value="">Seleccionar puesto</option>
                  {catalogos.puestos?.map((p) => (
                    <option key={p.id_puesto} value={p.id_puesto}>
                      {p.nombre_puesto}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Departamento *</label>
                <select
                  value={formData.id_departamento}
                  onChange={(e) =>
                    setFormData({ ...formData, id_departamento: e.target.value })
                  }
                  required
                >
                  <option value="">Seleccionar departamento</option>
                  {catalogos.departamentos?.map((d) => (
                    <option key={d.id_departamento} value={d.id_departamento}>
                      {d.nombre_departamento}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Turno *</label>
                <select
                  value={formData.id_turno}
                  onChange={(e) =>
                    setFormData({ ...formData, id_turno: e.target.value })
                  }
                  required
                >
                  <option value="">Seleccionar turno</option>
                  {catalogos.turnos?.map((t) => (
                    <option key={t.id_turno} value={t.id_turno}>
                      {t.nombre_turno}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Fecha de ingreso *</label>
                <input
                  type="date"
                  value={formData.fecha_ingreso}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha_ingreso: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Estatus *</label>
                <select
                  value={formData.estatus}
                  onChange={(e) =>
                    setFormData({ ...formData, estatus: e.target.value })
                  }
                  required
                >
                  <option value="activo">activo</option>
                  <option value="inactivo">inactivo</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  Guardar
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RRHHModule;