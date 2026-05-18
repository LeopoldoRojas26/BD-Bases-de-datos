import { useEffect, useState } from "react";
import { metodosPagoService } from "../services/api.service";
import "./MetodosPago.css";

export default function MetodosPago() {
  const [metodos, setMetodos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  const cargarMetodos = async () => {
    try {
      const res = await metodosPagoService.getAll();
      setMetodos(res.data.data);
    } catch (error) {
      console.error("Error cargando métodos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este método de pago?")) {
      return;
    }

    try {
      await metodosPagoService.delete(id);
      cargarMetodos();
      alert("✅ Método eliminado exitosamente.");
    } catch (error) {
      console.error("Error eliminando método:", error);
      alert("❌ No se puede eliminar este método de pago porque ya tiene pagos asociados en el historial.");
    }
  };

  const handleEdit = (metodo) => {
    setNombre(metodo.nombre);
    setDescripcion(metodo.descripcion);
    setEditandoId(metodo.id_metodo_pago);
  };

  const handleSubmit = async () => {
    try {
      if (!nombre.trim()) {
        return alert("Escribe un nombre");
      }

      const data = {
        nombre,
        descripcion,
      };

      if (editandoId) {
        await metodosPagoService.update(editandoId, data);
        alert("Método actualizado");
      } else {
        await metodosPagoService.create(data);
        alert("Método creado");
      }

      setNombre("");
      setDescripcion("");
      setEditandoId(null);

      cargarMetodos();

    } catch (error) {
      console.error("Error guardando método:", error);
    }
  };

  useEffect(() => {
    cargarMetodos();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <h2>Cargando métodos de pago...</h2>
      </div>
    );
  }

  return (
    <div className="metodos-container">

      <div className="metodos-card">

        {/* HEADER */}
        <div className="metodos-header">
          <div>
            <h1>💳 Métodos de Pago</h1>
            <p>Administra los métodos disponibles del sistema</p>
          </div>
        </div>

        {/* FORMULARIO */}
        <div className="metodos-form">

          <div className="input-group">
            <label>Nombre</label>

            <input
              type="text"
              placeholder="Ej. Tarjeta de crédito"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Descripción</label>

            <input
              type="text"
              placeholder="Describe el método"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          <button
            className="btn-primary"
            onClick={handleSubmit}
          >
            {editandoId ? "Actualizar método" : "Agregar método"}
          </button>
        </div>

        {/* TABLA */}
        <div className="table-container">

          <table className="metodos-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>

              {metodos.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty">
                    No hay métodos registrados
                  </td>
                </tr>
              ) : (
                metodos.map((m) => (
                  <tr key={m.id_metodo_pago}>

                    <td>{m.id_metodo_pago}</td>

                    <td>{m.nombre}</td>

                    <td>{m.descripcion}</td>

                    <td className="actions">

                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(m)}
                      >
                        Editar
                      </button>

                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(m.id_metodo_pago)}
                      >
                        Eliminar
                      </button>

                    </td>
                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}