import { useState, useEffect } from "react";

const API = "http://localhost:3000/api/sucursales";

const modalOverlay = {
  position: "fixed", inset: 0,
  backgroundColor: "rgba(0,0,0,0.45)",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 1000,
};
const modalBox = {
  backgroundColor: "white", borderRadius: "14px", padding: "28px",
  width: "420px", maxWidth: "95vw", boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
};
const inputStyle = {
  width: "100%", padding: "9px 12px", borderRadius: "7px",
  border: "1px solid #ccc", fontSize: "14px", marginBottom: "12px", boxSizing: "border-box",
};

const CIUDADES = [
  { id: 1, nombre: "Guadalajara" }, { id: 2, nombre: "Monterrey" },
  { id: 3, nombre: "Cuauhtémoc" }, { id: 4, nombre: "Toluca" },
  { id: 5, nombre: "Puebla de Zaragoza" }, { id: 6, nombre: "Santiago de Querétaro" },
  { id: 7, nombre: "León" }, { id: 8, nombre: "Mérida" },
  { id: 9, nombre: "Cancún" }, { id: 10, nombre: "Boca del Río" },
];

const EMPTY_FORM = { nombre: "", telefono: "", calle: "", numero: "", colonia: "", codigo_postal: "", id_ciudad: "" };

// ── Panel de almacenes expandible ────────────────────────────
const AlmacenesPanel = ({ idSucursal }) => {
  const [almacenes, setAlmacenes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/${idSucursal}/almacenes`)
      .then((r) => r.json())
      .then((d) => { setAlmacenes(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [idSucursal]);

  const capacidadTotal = almacenes.reduce((acc, a) => acc + (a.capacidad || 0), 0);

  if (loading) return <p style={{ fontSize: "12px", color: "#aaa", margin: "8px 0 0" }}>Cargando almacenes...</p>;
  if (almacenes.length === 0) return <p style={{ fontSize: "12px", color: "#aaa", margin: "8px 0 0" }}>Sin almacenes registrados.</p>;

  return (
    <div style={{ marginTop: "10px", borderTop: "1px solid #eee", paddingTop: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
        <span style={{ fontSize: "12px", fontWeight: "bold", color: "#555" }}>
          🏭 Almacenes ({almacenes.length})
        </span>
        <span style={{ fontSize: "11px", color: "#4a90d9", fontWeight: "bold" }}>
          Cap. total: {capacidadTotal.toLocaleString()}
        </span>
      </div>
      <div style={{ maxHeight: "120px", overflowY: "auto" }}>
        {almacenes.map((a) => (
          <div key={a.id_almacen} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "4px 8px", borderRadius: "6px", marginBottom: "3px",
            backgroundColor: a.activo ? "#f0f7ff" : "#f5f5f5", fontSize: "12px",
          }}>
            <span style={{ color: "#333" }}>{a.nombre}</span>
            <span style={{ color: "#4a90d9", fontWeight: "bold" }}>
              {a.capacidad ? a.capacidad.toLocaleString() + " u." : "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Modal agregar ────────────────────────────────────────────
const ModalAgregar = ({ onClose, onSaved }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.nombre || !form.calle || !form.numero || !form.id_ciudad) {
      setError("Nombre, calle, número y ciudad son obligatorios."); return;
    }
    setSaving(true); setError("");
    try {
      const res = await fetch(API, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id_ciudad: Number(form.id_ciudad) }),
      });
      const data = await res.json();
      if (data.success) { onSaved(); onClose(); }
      else setError(data.error || "Error al guardar.");
    } catch { setError("No se pudo conectar con el servidor."); }
    finally { setSaving(false); }
  };

  return (
    <div style={modalOverlay} onClick={onClose}>
      <div style={modalBox} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ margin: "0 0 18px", color: "#4a90d9", fontSize: "18px" }}>➕ Nueva Sucursal</h2>
        <label style={{ fontSize: "12px", color: "#666" }}>Nombre *</label>
        <input style={inputStyle} name="nombre" value={form.nombre} onChange={handle} placeholder="Sucursal Centro MTY" />
        <label style={{ fontSize: "12px", color: "#666" }}>Teléfono</label>
        <input style={inputStyle} name="telefono" value={form.telefono} onChange={handle} placeholder="555-100-0011" />
        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ flex: 2 }}>
            <label style={{ fontSize: "12px", color: "#666" }}>Calle *</label>
            <input style={inputStyle} name="calle" value={form.calle} onChange={handle} placeholder="Av. Reforma" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "12px", color: "#666" }}>Número *</label>
            <input style={inputStyle} name="numero" value={form.numero} onChange={handle} placeholder="200" />
          </div>
        </div>
        <label style={{ fontSize: "12px", color: "#666" }}>Colonia</label>
        <input style={inputStyle} name="colonia" value={form.colonia} onChange={handle} placeholder="Centro" />
        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "12px", color: "#666" }}>Código Postal</label>
            <input style={inputStyle} name="codigo_postal" value={form.codigo_postal} onChange={handle} placeholder="01000" />
          </div>
          <div style={{ flex: 2 }}>
            <label style={{ fontSize: "12px", color: "#666" }}>Ciudad *</label>
            <select style={inputStyle} name="id_ciudad" value={form.id_ciudad} onChange={handle}>
              <option value="">Seleccionar...</option>
              {CIUDADES.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>
        </div>
        {error && <p style={{ color: "#e74c3c", fontSize: "13px", margin: "0 0 10px" }}>{error}</p>}
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "6px" }}>
          <button onClick={onClose} style={{ padding: "9px 18px", borderRadius: "7px", border: "1px solid #ccc", background: "white", cursor: "pointer", fontSize: "14px" }}>Cancelar</button>
          <button onClick={submit} disabled={saving} style={{ padding: "9px 20px", borderRadius: "7px", border: "none", background: "#4a90d9", color: "white", cursor: "pointer", fontSize: "14px", fontWeight: "bold" }}>
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Modal editar ─────────────────────────────────────────────
const ModalEditar = ({ sucursal, onClose, onSaved }) => {
  const [form, setForm] = useState({ nombre: sucursal.nombre || "", telefono: sucursal.telefono || "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.nombre) { setError("El nombre es obligatorio."); return; }
    setSaving(true); setError("");
    try {
      const res = await fetch(`${API}/${sucursal.id_sucursal}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) { onSaved(); onClose(); }
      else setError(data.error || "Error al actualizar.");
    } catch { setError("No se pudo conectar con el servidor."); }
    finally { setSaving(false); }
  };

  return (
    <div style={modalOverlay} onClick={onClose}>
      <div style={modalBox} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ margin: "0 0 18px", color: "#4a90d9", fontSize: "18px" }}>✏️ Editar Sucursal</h2>
        <label style={{ fontSize: "12px", color: "#666" }}>Nombre *</label>
        <input style={inputStyle} name="nombre" value={form.nombre} onChange={handle} />
        <label style={{ fontSize: "12px", color: "#666" }}>Teléfono</label>
        <input style={inputStyle} name="telefono" value={form.telefono} onChange={handle} />
        {error && <p style={{ color: "#e74c3c", fontSize: "13px", margin: "0 0 10px" }}>{error}</p>}
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "6px" }}>
          <button onClick={onClose} style={{ padding: "9px 18px", borderRadius: "7px", border: "1px solid #ccc", background: "white", cursor: "pointer", fontSize: "14px" }}>Cancelar</button>
          <button onClick={submit} disabled={saving} style={{ padding: "9px 20px", borderRadius: "7px", border: "none", background: "#4a90d9", color: "white", cursor: "pointer", fontSize: "14px", fontWeight: "bold" }}>
            {saving ? "Guardando..." : "Actualizar"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Tarjeta de sucursal ──────────────────────────────────────
const TarjetaSucursal = ({ s, onEditar, onToggle }) => {
  const [verAlmacenes, setVerAlmacenes] = useState(false);

  return (
    <div style={{
      backgroundColor: "white", border: "1px solid #ddd", borderRadius: "12px",
      padding: "16px", width: "280px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      opacity: s.activo ? 1 : 0.7,
    }}>
      <div style={{ backgroundColor: s.activo ? "#4a90d9" : "#aaa", color: "white", borderRadius: "8px", padding: "8px 12px", marginBottom: "12px", fontWeight: "bold", fontSize: "14px" }}>
        {s.nombre}
      </div>

      <div style={{ fontSize: "13px", color: "#444", lineHeight: "1.7" }}>
        <p style={{ margin: 0 }}>📍 {s.direccion}</p>
        <p style={{ margin: 0 }}>🏘️ {s.colonia}</p>
        <p style={{ margin: 0 }}>🌆 {s.ciudad}, {s.estado}</p>
        <p style={{ margin: 0 }}>📮 CP: {s.codigo_postal}</p>
        <p style={{ margin: 0 }}>📞 {s.telefono}</p>
      </div>

      {/* Almacenes expandibles */}
      <button
        onClick={() => setVerAlmacenes(!verAlmacenes)}
        style={{ marginTop: "10px", width: "100%", padding: "6px", borderRadius: "7px", border: "1px solid #e0eeff", background: "#f0f7ff", color: "#4a90d9", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
      >
        {verAlmacenes ? "▲ Ocultar almacenes" : "▼ Ver almacenes"}
      </button>
      {verAlmacenes && <AlmacenesPanel idSucursal={s.id_sucursal} />}

      {/* Estado + botones */}
      <div style={{ marginTop: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "6px" }}>
        <span style={{ backgroundColor: s.activo ? "#27ae60" : "#e74c3c", color: "white", padding: "3px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}>
          {s.activo ? "ACTIVA" : "INACTIVA"}
        </span>
        <div style={{ display: "flex", gap: "6px" }}>
          <button onClick={() => onEditar(s)} title="Editar" style={{ padding: "5px 10px", borderRadius: "6px", border: "1px solid #4a90d9", background: "white", color: "#4a90d9", cursor: "pointer", fontSize: "13px" }}>✏️</button>
          <button onClick={() => onToggle(s)} title={s.activo ? "Desactivar" : "Activar"} style={{ padding: "5px 10px", borderRadius: "6px", border: `1px solid ${s.activo ? "#e74c3c" : "#27ae60"}`, background: "white", color: s.activo ? "#e74c3c" : "#27ae60", cursor: "pointer", fontSize: "13px" }}>
            {s.activo ? "⏸" : "▶️"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Módulo principal ─────────────────────────────────────────
const SucursalesModule = () => {
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [modalAgregar, setModalAgregar] = useState(false);
  const [sucursalEditar, setSucursalEditar] = useState(null);

  const cargar = () => {
    setLoading(true);
    fetch(API).then((r) => r.json()).then((d) => { setSucursales(d.data || []); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { cargar(); }, []);

  const toggleActivo = async (s) => {
    try { await fetch(`${API}/${s.id_sucursal}/toggle`, { method: "PATCH" }); cargar(); }
    catch { alert("Error al cambiar el estado."); }
  };

  const sucursalesFiltradas = sucursales.filter((s) =>
    s.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    s.estado?.toLowerCase().includes(busqueda.toLowerCase()) ||
    s.ciudad?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalActivas = sucursales.filter((s) => s.activo).length;
  const totalInactivas = sucursales.filter((s) => !s.activo).length;
  const estadosCubiertos = [...new Set(sucursales.map((s) => s.estado).filter(Boolean))].length;

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif" }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <h1 style={{ color: "#4a90d9", margin: 0, fontSize: "24px" }}>🏬 Módulo de Sucursales</h1>
        <button onClick={() => setModalAgregar(true)} style={{ padding: "10px 20px", backgroundColor: "#4a90d9", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "bold", cursor: "pointer" }}>
          + Nueva Sucursal
        </button>
      </div>

      {/* Estadísticas */}
      <div style={{ display: "flex", gap: "14px", marginBottom: "22px", flexWrap: "wrap" }}>
        {[
          { label: "Total", valor: sucursales.length, color: "#4a90d9" },
          { label: "Activas", valor: totalActivas, color: "#27ae60" },
          { label: "Inactivas", valor: totalInactivas, color: "#e74c3c" },
          { label: "Estados cubiertos", valor: estadosCubiertos, color: "#8e44ad" },
        ].map((stat) => (
          <div key={stat.label} style={{ backgroundColor: "white", border: "1px solid #eee", borderRadius: "10px", padding: "14px 20px", minWidth: "110px", boxShadow: "0 2px 6px rgba(0,0,0,0.07)", textAlign: "center" }}>
            <div style={{ fontSize: "26px", fontWeight: "bold", color: stat.color }}>{stat.valor}</div>
            <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Buscador */}
      <input
        type="text"
        placeholder="🔍 Buscar por nombre, ciudad o estado..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{ padding: "10px 14px", width: "350px", maxWidth: "100%", borderRadius: "8px", border: "1px solid #ccc", marginBottom: "20px", fontSize: "14px" }}
      />

      {/* Tarjetas */}
      {loading ? (
        <p style={{ color: "#888" }}>Cargando sucursales...</p>
      ) : sucursalesFiltradas.length === 0 ? (
        <p style={{ color: "#888" }}>No se encontraron sucursales.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          {sucursalesFiltradas.map((s) => (
            <TarjetaSucursal key={s.id_sucursal} s={s} onEditar={setSucursalEditar} onToggle={toggleActivo} />
          ))}
        </div>
      )}

      {modalAgregar && <ModalAgregar onClose={() => setModalAgregar(false)} onSaved={cargar} />}
      {sucursalEditar && <ModalEditar sucursal={sucursalEditar} onClose={() => setSucursalEditar(null)} onSaved={cargar} />}
    </div>
  );
};

export default SucursalesModule;