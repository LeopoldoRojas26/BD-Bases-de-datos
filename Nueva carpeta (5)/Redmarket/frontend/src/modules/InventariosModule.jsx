import { useState, useEffect } from "react";
import { inventarioService } from "../services/api.service";
import "../components/Productos.css";

const InventariosModule = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    producto: "",
    descripcion: "",
    precio: "",
    id_categoria: "",
    codigo_barras: "",
    stock_actual: "",
    stock_minimo: "",
    stock_maximo: "",
  });

  const fetchInventario = async () => {
    try {
      setLoading(true);
      const response = await inventarioService.getAll();
      setProductos(response.data.data || response.data);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      alert("Error al cargar inventario: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventario();
  }, []);

  const productosFiltrados = productos.filter((p) =>
    (p.producto || "").toLowerCase().includes(busqueda.toLowerCase())
  );

  const getEstadoStock = (actual, minimo) => {
    if (actual === 0) return { texto: "AGOTADO", color: "#e74c3c" };
    if (actual <= minimo) return { texto: "STOCK BAJO", color: "#e67e22" };
    return { texto: "NORMAL", color: "#27ae60" };
  };

  const resetForm = () => {
    setFormData({
      producto: "",
      descripcion: "",
      precio: "",
      id_categoria: "",
      codigo_barras: "",
      stock_actual: "",
      stock_minimo: "",
      stock_maximo: "",
    });
    setEditingId(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (row) => {
    setFormData({
      producto: row.producto || "",
      descripcion: row.descripcion || "",
      precio: row.precio ?? "",
      id_categoria: row.id_categoria ?? "",
      codigo_barras: row.codigo_barras || "",
      stock_actual: row.stock_actual ?? "",
      stock_minimo: row.stock_minimo ?? "",
      stock_maximo: row.stock_maximo ?? "",
    });
    setEditingId(row.id_producto);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      producto: formData.producto,
      descripcion: formData.descripcion,
      precio: formData.precio === "" ? undefined : Number(formData.precio),
      id_categoria:
        formData.id_categoria === "" ? undefined : Number(formData.id_categoria),
      codigo_barras: formData.codigo_barras,
      stock_actual:
        formData.stock_actual === "" ? undefined : Number(formData.stock_actual),
      stock_minimo:
        formData.stock_minimo === "" ? undefined : Number(formData.stock_minimo),
      stock_maximo:
        formData.stock_maximo === "" ? undefined : Number(formData.stock_maximo),
    };

    try {
      if (editingId) {
        await inventarioService.update(editingId, payload);
      } else {
        await inventarioService.create(payload);
      }

      await fetchInventario();
      closeModal();
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      alert("Error al guardar: " + errorMsg);
    }
  };

  const handleDelete = async (row) => {
    const idProducto = row?.id_producto;
    if (!idProducto) {
      alert("No se encontró el ID del producto");
      return;
    }

    const nombre = row?.producto || "este producto";
    if (!window.confirm(`¿Seguro que deseas eliminar ${nombre}?`)) return;

    try {
      await inventarioService.delete(idProducto);
      await fetchInventario();

      if (editingId === idProducto) {
        closeModal();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      alert("Error al eliminar: " + errorMsg);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <h1 style={{ color: "#4a90d9", margin: 0 }}>📦 Módulo de Inventarios</h1>

        <button type="button" className="btn-primary" onClick={openCreateModal}>
          + Agregar
        </button>
      </div>

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
              <th style={{ padding: "10px", textAlign: "center" }}>Acciones</th>
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
                  <td style={{ padding: "10px" }}>{p.producto}</td>
                  <td style={{ padding: "10px" }}>{p.categoria}</td>
                  <td style={{ padding: "10px", textAlign: "center" }}>{p.stock_actual}</td>
                  <td style={{ padding: "10px", textAlign: "center" }}>{p.stock_minimo}</td>
                  <td style={{ padding: "10px", textAlign: "center" }}>{p.stock_maximo}</td>
                  <td style={{ padding: "10px", textAlign: "center" }}>
                    {p.precio !== undefined && p.precio !== null
                      ? `$${parseFloat(p.precio).toFixed(2)}`
                      : "N/A"}
                  </td>
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
                  <td style={{ padding: "10px", textAlign: "center" }}>
                    <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => openEditModal(p)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn-delete"
                        onClick={() => handleDelete(p)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? "Editar producto" : "Nuevo producto"}</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Producto *</label>
                <input
                  type="text"
                  value={formData.producto}
                  onChange={(e) => setFormData({ ...formData, producto: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Precio *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Categoría (ID) *</label>
                <input
                  type="number"
                  value={formData.id_categoria}
                  onChange={(e) => setFormData({ ...formData, id_categoria: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Código de Barras</label>
                <input
                  type="text"
                  value={formData.codigo_barras}
                  onChange={(e) => setFormData({ ...formData, codigo_barras: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Stock Actual</label>
                <input
                  type="number"
                  value={formData.stock_actual}
                  onChange={(e) => setFormData({ ...formData, stock_actual: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Stock Mínimo</label>
                <input
                  type="number"
                  value={formData.stock_minimo}
                  onChange={(e) => setFormData({ ...formData, stock_minimo: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Stock Máximo</label>
                <input
                  type="number"
                  value={formData.stock_maximo}
                  onChange={(e) => setFormData({ ...formData, stock_maximo: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  {editingId ? "Actualizar" : "Guardar"}
                </button>
                <button type="button" className="btn-secondary" onClick={closeModal}>
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

export default InventariosModule;