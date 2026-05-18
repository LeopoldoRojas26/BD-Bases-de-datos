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
  getCatalogos: () => api.get('/empleados/catalogos'),
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

export const ordenCompraService = {
  getAll: () => api.get('/orden-compra'),
  getById: (id) => api.get(`/orden-compra/${id}`),
  create: (data) => api.post('/orden-compra', data),
  update: (id, data) => api.put(`/orden-compra/${id}`, data),
  delete: (id) => api.delete(`/orden-compra/${id}`),
};

export const detalleOrdenCompraService = {
  getAll: () => api.get('/detalle-orden-compra'),
  getById: (id) => api.get(`/detalle-orden-compra/${id}`),
  create: (data) => api.post('/detalle-orden-compra', data),
  update: (id, data) => api.put(`/detalle-orden-compra/${id}`, data),
  delete: (id) => api.delete(`/detalle-orden-compra/${id}`),
};

export const recepcionMercanciaService = {
  getAll: () => api.get('/recepcion-mercancia'),
  getById: (id) => api.get(`/recepcion-mercancia/${id}`),
  create: (data) => api.post('/recepcion-mercancia', data),
  update: (id, data) => api.put(`/recepcion-mercancia/${id}`, data),
  delete: (id) => api.delete(`/recepcion-mercancia/${id}`),
};

export const inventarioService = {
  getAll: () => api.get('/inventario'),
  getById: (id) => api.get(`/inventario/${id}`),
  create: (data) => api.post('/inventario', data),
  update: (id, data) => api.put(`/inventario/${id}`, data),
  delete: (id) => api.delete(`/inventario/${id}`),
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

export const pagosService = {
  getAll: () => api.get('/pagos'),
  getById: (id) => api.get(`/pagos/${id}`),
  create: (data) => api.post('/pagos', data),
  update: (id, data) => api.put(`/pagos/${id}`, data),
  delete: (id) => api.delete(`/pagos/${id}`),
};

export const facturaService = {
  getAll: () => api.get('/factura'),
  getById: (id) => api.get(`/factura/${id}`),
  create: (data) => api.post('/factura', data),
  update: (id, data) => api.put(`/factura/${id}`, data),
  delete: (id) => api.delete(`/factura/${id}`),
};

export const devolucionService = {
  getAll: () => api.get('/devolucion'),
  getById: (id) => api.get(`/devolucion/${id}`),
  create: (data) => api.post('/devolucion', data),
  update: (id, data) => api.put(`/devolucion/${id}`, data),
  delete: (id) => api.delete(`/devolucion/${id}`),
};

export const usuariosService = {
  getAll: () => api.get('/usuarios'),
  getById: (id) => api.get(`/usuarios/${id}`),
  create: (data) => api.post('/usuarios', data),
  update: (id, data) => api.put(`/usuarios/${id}`, data),
  delete: (id) => api.delete(`/usuarios/${id}`),
};

export const rolesService = {
  getAll: () => api.get('/roles'),
  getById: (id) => api.get(`/roles/${id}`),
  create: (data) => api.post('/roles', data),
  update: (id, data) => api.put(`/roles/${id}`, data),
  delete: (id) => api.delete(`/roles/${id}`),
};

export const usuarioRolService = {
  getAll: () => api.get('/usuario-rol'),
  getById: (id) => api.get(`/usuario-rol/${id}`),
  create: (data) => api.post('/usuario-rol', data),
  update: (id, data) => api.put(`/usuario-rol/${id}`, data),
  delete: (id) => api.delete(`/usuario-rol/${id}`),
};

export const permisosSistemaService = {
  getAll: () => api.get('/permisos-sistema'),
  getById: (id) => api.get(`/permisos-sistema/${id}`),
  create: (data) => api.post('/permisos-sistema', data),
  update: (id, data) => api.put(`/permisos-sistema/${id}`, data),
  delete: (id) => api.delete(`/permisos-sistema/${id}`),
};

export const rolPermisoService = {
  getAll: () => api.get('/rol-permiso'),
  getById: (id) => api.get(`/rol-permiso/${id}`),
  create: (data) => api.post('/rol-permiso', data),
  update: (id, data) => api.put(`/rol-permiso/${id}`, data),
  delete: (id) => api.delete(`/rol-permiso/${id}`),
};

export const bitacoraService = {
  getAll: () => api.get('/bitacora'),
  getById: (id) => api.get(`/bitacora/${id}`)
  // Bitácora es de solo lectura, no tiene create, update, ni delete
};

export const sesionesService = {
  getAll: () => api.get('/sesiones'),
  getById: (id) => api.get(`/sesiones/${id}`),
  revocar: (id) => api.put(`/sesiones/${id}/revocar`)
};