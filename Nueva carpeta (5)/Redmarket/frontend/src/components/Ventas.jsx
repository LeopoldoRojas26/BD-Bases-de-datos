import { useState, useEffect } from 'react';
import { ventasService, clientesService, productosService, devolucionService, empleadosService } from '../services/api.service';
import './Ventas.css';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [sessionReturned, setSessionReturned] = useState(() => {
    const saved = localStorage.getItem('returnedSales');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    id_cliente: '',
    id_empleado: '',
    detalles: [{ id_producto: '', cantidad: 1, precio_unitario: 0 }],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ventasRes, clientesRes, productosRes, empleadosRes] = await Promise.all([
        ventasService.getAll(),
        clientesService.getAll(),
        productosService.getAll(),
        empleadosService.getAll()
      ]);
      // Backend devuelve {success: true, data: [...]}
      const ventasData = ventasRes.data.data || ventasRes.data;
      setVentas(ventasData.sort((a, b) => b.id_venta - a.id_venta));
      setClientes(clientesRes.data.data || clientesRes.data);
      setProductos(productosRes.data.data || productosRes.data);
      setEmpleados(empleadosRes.data.data || empleadosRes.data);
    } catch (err) {
      alert('Error al cargar datos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const ventaData = {
        id_cliente: parseInt(formData.id_cliente),
        id_empleado: parseInt(formData.id_empleado),
        productos: formData.detalles.map(d => ({
          id_producto: parseInt(d.id_producto),
          cantidad: parseInt(d.cantidad),
        })),
      };

      if (editingId) {
        await ventasService.update(editingId, ventaData);
        alert('✅ Venta actualizada exitosamente');
      } else {
        await ventasService.create(ventaData);
        alert('✅ Venta registrada exitosamente');
      }

      fetchData();
      resetForm();
      setShowModal(false);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      alert(`❌ Error al ${editingId ? 'actualizar' : 'registrar'} venta: ` + errorMsg);
    }
  };

  const addDetalle = () => {
    setFormData({
      ...formData,
      detalles: [...formData.detalles, { id_producto: '', cantidad: 1, precio_unitario: 0 }],
    });
  };

  const removeDetalle = (index) => {
    const newDetalles = formData.detalles.filter((_, i) => i !== index);
    setFormData({ ...formData, detalles: newDetalles });
  };

  const updateDetalle = (index, field, value) => {
    const newDetalles = [...formData.detalles];
    newDetalles[index][field] = value;
    
    if (field === 'id_producto') {
      const producto = productos.find(p => p.id_producto === parseInt(value));
      if (producto) {
        newDetalles[index].precio_unitario = producto.precio;
      }
    }
    
    setFormData({ ...formData, detalles: newDetalles });
  };

  const resetForm = () => {
    setFormData({
      id_cliente: '',
      id_empleado: '',
      detalles: [{ id_producto: '', cantidad: 1, precio_unitario: 0 }],
    });
    setEditingId(null);
  };

  const handleEdit = async (venta) => {
    try {
      const res = await ventasService.getById(venta.id_venta);
      const ventaDetalle = res.data.data;
      
      setFormData({
        id_cliente: ventaDetalle.id_cliente,
        id_empleado: ventaDetalle.id_empleado,
        detalles: ventaDetalle.detalle.map(d => ({
          id_producto: d.id_producto,
          cantidad: d.cantidad,
          precio_unitario: d.precio_unitario
        }))
      });
      setEditingId(venta.id_venta);
      setShowModal(true);
    } catch (error) {
      alert('Error al cargar la venta para editar: ' + error.message);
    }
  };

  const calcularTotal = () => {
    return formData.detalles.reduce((sum, d) => {
      return sum + (parseFloat(d.precio_unitario) * parseInt(d.cantidad || 0));
    }, 0).toFixed(2);
  };

  const handleDevolver = async (venta) => {
    if (!window.confirm(`¿Está seguro de devolver la venta #${venta.id_venta}?`)) {
      return;
    }

    try {
      const motivo = prompt('Ingrese el motivo de la devolución:', 'Devolución general');
      if (motivo === null) return; 

      // 1. Registrar devolución
      await devolucionService.create({
        id_venta: venta.id_venta,
        motivo: motivo || 'Sin motivo especificado'
      });

      // 2. Marcar localmente y guardar en localStorage para persistir
      setSessionReturned(prev => {
        const updated = [...prev, venta.id_venta];
        localStorage.setItem('returnedSales', JSON.stringify(updated));
        return updated;
      });
      alert('✅ Venta marcada como devuelta.');
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      alert('❌ Error al devolver la venta: ' + errorMsg);
    }
  };

  const handleDelete = async (id_venta) => {
    if (!window.confirm(`¿Estás seguro de que deseas ELIMINAR permanentemente la venta #${id_venta}? Esta acción no se puede deshacer y restaurará el inventario.`)) {
      return;
    }

    try {
      await ventasService.delete(id_venta);
      alert('✅ Venta eliminada permanentemente y stock restaurado.');
      fetchData();
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      alert('❌ Error al eliminar la venta: ' + errorMsg);
    }
  };

  if (loading) return <div className="loading">Cargando ventas...</div>;

  return (
    <div className="ventas-container">
      <div className="ventas-header">
        <h1>💰 Gestión de Ventas</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Nueva Venta
        </button>
      </div>

      <div className="ventas-list">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Empleado</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta) => (
              <tr key={venta.id_venta}>
                <td>{venta.id_venta}</td>
                <td>{new Date(venta.fecha).toLocaleDateString()}</td>
                <td>{venta.cliente}</td>
                <td>{venta.empleado}</td>
                <td className="total">${parseFloat(venta.total).toFixed(2)}</td>
                <td>
                  {sessionReturned.includes(venta.id_venta) ? (
                    <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>Devuelta</span>
                  ) : (
                    <>
                      <button className="btn-primary" onClick={() => handleEdit(venta)} style={{ marginRight: '5px' }}>
                        Editar
                      </button>
                      <button className="btn-secondary" onClick={() => handleDevolver(venta)} style={{ marginRight: '5px' }}>
                        Devolver
                      </button>
                      <button className="btn-secondary" onClick={() => handleDelete(venta.id_venta)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none' }}>
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); resetForm(); }}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? 'Editar Venta' : 'Nueva Venta'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Cliente *</label>
                <select
                  value={formData.id_cliente}
                  onChange={(e) => setFormData({ ...formData, id_cliente: e.target.value })}
                  required
                >
                  <option value="">Seleccionar cliente</option>
                  {clientes.map((c) => (
                    <option key={c.id_cliente} value={c.id_cliente}>
                      {c.nombre} {c.apellido}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Empleado *</label>
                <select
                  value={formData.id_empleado}
                  onChange={(e) => setFormData({ ...formData, id_empleado: e.target.value })}
                  required
                >
                  <option value="">Seleccionar empleado</option>
                  {empleados.map((emp) => (
                    <option key={emp.id_empleado} value={emp.id_empleado}>
                      {emp.nombre} {emp.apellido_paterno}
                    </option>
                  ))}
                </select>
              </div>

              <h3>Productos</h3>
              {formData.detalles.map((detalle, index) => (
                <div key={index} className="detalle-row">
                  <div className="form-group">
                    <label>Producto *</label>
                    <select
                      value={detalle.id_producto}
                      onChange={(e) => updateDetalle(index, 'id_producto', e.target.value)}
                      required
                    >
                      <option value="">Seleccionar producto</option>
                      {productos.map((p) => (
                        <option key={p.id_producto} value={p.id_producto}>
                          {p.nombre} - ${p.precio}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Cantidad *</label>
                    <input
                      type="number"
                      min="1"
                      value={detalle.cantidad}
                      onChange={(e) => updateDetalle(index, 'cantidad', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Precio</label>
                    <input
                      type="number"
                      step="0.01"
                      value={detalle.precio_unitario}
                      readOnly
                    />
                  </div>
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => removeDetalle(index)}
                    disabled={formData.detalles.length === 1}
                  >
                    🗑️
                  </button>
                </div>
              ))}

              <button type="button" className="btn-secondary" onClick={addDetalle}>
                + Agregar Producto
              </button>

              <div className="total-section">
                <h3>Total: ${calcularTotal()}</h3>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  {editingId ? 'Actualizar Venta' : 'Registrar Venta'}
                </button>
                <button type="button" className="btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>
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

export default Ventas;
