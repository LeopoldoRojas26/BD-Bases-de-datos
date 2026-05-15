import { useEffect, useState } from "react";
import { metodosPagoService } from "../services/api.service";
import "./MetodosPago.css";

export default function MetodosPago() {
  const [metodos, setMetodos] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarMetodos = async () => {
    try {
      const res = await metodosPagoService.getAll();

      console.log("RESPUESTA:", res.data); // 👈 útil para debug

      setMetodos(res.data.data); // ✅ AQUÍ estaba el error
    } catch (error) {
      console.error("Error cargando métodos:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
  try {
    await metodosPagoService.delete(id);
    cargarMetodos(); // recarga la tabla
  } catch (error) {
    console.error("Error eliminando método:", error);
  }
};

  useEffect(() => {
    cargarMetodos();
  }, []);

  if (loading) return <h2>Cargando métodos de pago...</h2>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>💳 Métodos de Pago</h1>
        <button className="btn-primary">+ Agregar método</button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {metodos.map((m) => (
            <tr key={m.id_metodo_pago}>
              <td>{m.id_metodo_pago}</td>
              <td>{m.nombre}</td>
              <td>{m.descripcion}</td>
              <td>
                <button className="btn-edit">Editar</button>
                <button
  className="btn-delete"
  onClick={() => handleDelete(m.id_metodo_pago)}
>
  Eliminar
</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}