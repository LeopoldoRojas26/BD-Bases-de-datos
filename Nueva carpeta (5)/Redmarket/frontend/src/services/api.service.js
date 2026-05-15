import api from '../config/api';

export const productosService = {
  getAll: () => api.get('/productos'),
  getById: (id) => api.get(`/productos/${id}`),
  create: (data) => api.post('/productos', data),
  update: (id, data) => api.put(`/productos/${id}`, data),
  delete: (id) => api.delete(`/productos/${id}`),
};

export const ventasService = {
  getAll: () => api.get('/ventas'),
  getById: (id) => api.get(`/ventas/${id}`),
  create: (data) => api.post('/ventas', data),
  getDetalles: (id) => api.get(`/ventas/${id}/detalles`),
};

export const clientesService = {
  getAll: () => api.get('/clientes'),
  getById: (id) => api.get(`/clientes/${id}`),
  create: (data) => api.post('/clientes', data),
  update: (id, data) => api.put(`/clientes/${id}`, data),
  delete: (id) => api.delete(`/clientes/${id}`),
};

export const empleadosService = {
  getAll: () => api.get('/empleados'),
  getById: (id) => api.get(`/empleados/${id}`),
  create: (data) => api.post('/empleados', data),
  update: (id, data) => api.put(`/empleados/${id}`, data),
  delete: (id) => api.delete(`/empleados/${id}`),
};

export const proveedoresService = {
  getAll: () => api.get('/proveedores'),
  getById: (id) => api.get(`/proveedores/${id}`),
  create: (data) => api.post('/proveedores', data),
  update: (id, data) => api.put(`/proveedores/${id}`, data),
  delete: (id) => api.delete(`/proveedores/${id}`),
};

export const inventarioService = {
  getAll: () => api.get('/inventario'),
  getById: (id) => api.get(`/inventario/${id}`),
  update: (id, data) => api.put(`/inventario/${id}`, data),
  getBajoStock: () => api.get('/inventario/bajo-stock'),
};

export const metodosPagoService = {
  getAll: () => api.get('/metodos-pago'),
  getById: (id) => api.get(`/metodos-pago/${id}`),
  create: (data) => api.post('/metodos-pago', data),
  update: (id, data) => api.put(`/metodos-pago/${id}`, data),
  delete: (id) => api.delete(`/metodos-pago/${id}`),
};

export const detalleVentaService = {
  getAll: () => api.get('/detalle-venta'),
  getById: (id) => api.get(`/detalle-venta/${id}`),
  create: (data) => api.post('/detalle-venta', data),
  update: (id, data) => api.put(`/detalle-venta/${id}`, data),
  delete: (id) => api.delete(`/detalle-venta/${id}`),
};