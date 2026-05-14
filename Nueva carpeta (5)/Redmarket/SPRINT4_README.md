# 🏪 RedMarket - Sistema de Gestión Integral

Sistema completo de gestión con **React + Vite** (Frontend) y **Node.js + Express + PostgreSQL** (Backend).

## 📋 Sprint 4: Integración y Automatización - COMPLETADO ✅

### Entregables Cumplidos:

1. **✅ Conexión Backend–DB**: Aplicación desarrollada en Node.js con conexión a PostgreSQL
2. **✅ Funcionalidad CRUD**: Implementado en todos los módulos (Productos, Ventas, Clientes, Empleados, Proveedores, Inventario)
3. **✅ Triggers en PL/pgSQL**: Implementados 2 triggers principales:
   - **Trigger 1**: `validar_stock_antes_venta` - Valida stock antes de insertar venta
   - **Trigger 2**: `actualizar_inventario_post_venta` - Descuenta stock automáticamente
   - **RAISE EXCEPTION**: Lanza excepción si stock < 0

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 16+ y npm
- PostgreSQL 12+
- Git

### 1️⃣ Configurar Backend

```bash
# Ir al directorio del backend
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Editar .env con tus credenciales de PostgreSQL
# DB_HOST=localhost
# DB_PORT=5432
# DB_USER=postgres
# DB_PASSWORD=tu_password
# DB_NAME=redmarket_db
# PORT=3000

# Inicializar base de datos (crea tablas, datos, vistas y triggers)
npm run init-db

# Iniciar servidor backend
npm run dev
```

El backend estará corriendo en `http://localhost:3000`

### 2️⃣ Configurar Frontend

```bash
# Ir al directorio del frontend
cd ../frontend

# Instalar dependencias
npm install

# Configurar variables de entorno (ya está configurado por defecto)
# VITE_API_URL=http://localhost:3000/api

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará corriendo en `http://localhost:5173`

---

## 📦 Estructura del Proyecto

```
Redmarket/
├── backend/
│   ├── database/
│   │   ├── init.js          # Inicializador de BD
│   │   ├── schema.sql       # Esquema de tablas
│   │   ├── seeds.sql        # Datos de prueba
│   │   ├── views.sql        # Vistas SQL
│   │   └── triggers.sql     # ⚡ TRIGGERS (Sprint 4)
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js  # Conexión PostgreSQL
│   │   ├── controllers/
│   │   │   ├── productosController.js
│   │   │   ├── ventasController.js
│   │   │   ├── clientesController.js
│   │   │   ├── empleadosController.js
│   │   │   ├── proveedoresController.js
│   │   │   └── inventarioController.js
│   │   ├── routes/
│   │   │   ├── productos.js
│   │   │   ├── ventas.js
│   │   │   ├── clientes.js
│   │   │   ├── empleados.js
│   │   │   ├── proveedores.js
│   │   │   └── inventario.js
│   │   └── index.js         # Servidor Express
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Productos.jsx
│   │   │   ├── Ventas.jsx
│   │   │   ├── Inventario.jsx
│   │   │   ├── Clientes.jsx
│   │   │   ├── Empleados.jsx
│   │   │   └── Proveedores.jsx
│   │   ├── services/
│   │   │   └── api.service.js
│   │   ├── config/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── .env.example
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🎯 Funcionalidades Implementadas

### Backend (Node.js + Express + PostgreSQL)

#### ✅ CRUD Completo para:
- 🛍️ **Productos**: Crear, Leer, Actualizar, Eliminar
- 💰 **Ventas**: Crear, Leer, Obtener Detalles
- 👥 **Clientes**: CRUD completo
- 👔 **Empleados**: CRUD completo
- 🚚 **Proveedores**: CRUD completo
- 📦 **Inventario**: Leer, Actualizar, Stock Bajo

#### ⚡ Triggers Implementados (PL/pgSQL)

**1. Trigger de Validación de Stock**
```sql
CREATE TRIGGER trigger_validar_stock_venta
BEFORE INSERT ON detalle_venta
FOR EACH ROW
EXECUTE FUNCTION validar_stock_antes_venta();
```

**Funcionalidad:**
- Valida que haya stock suficiente ANTES de registrar la venta
- Si `stock_actual < cantidad_solicitada`: lanza `RAISE EXCEPTION`
- Previene ventas de productos sin stock

**2. Trigger de Actualización de Inventario**
```sql
CREATE TRIGGER trigger_actualizar_inventario
AFTER INSERT ON detalle_venta
FOR EACH ROW
EXECUTE FUNCTION actualizar_inventario_post_venta();
```

**Funcionalidad:**
- Descuenta automáticamente el stock DESPUÉS de una venta exitosa
- Actualiza `stock_actual = stock_actual - cantidad`
- Registra el movimiento en `movimiento_inventario`

### Frontend (React + Vite)

#### 🎨 Componentes Principales:
- **Dashboard**: Resumen general con estadísticas
- **Productos**: Gestión completa (agregar, editar, eliminar)
- **Ventas**: Crear ventas con múltiples productos (valida stock)
- **Inventario**: Visualización de stock con alertas
- **Clientes**: CRUD de clientes
- **Empleados**: Listado de empleados
- **Proveedores**: Listado de proveedores

#### 🔥 Características:
- ✅ React Router para navegación
- ✅ Axios para peticiones HTTP
- ✅ Diseño responsive
- ✅ Manejo de errores
- ✅ Validación de formularios
- ✅ Integración completa con backend

---

## 🧪 Pruebas de Triggers

### Probar Trigger 1: Validación de Stock

**Caso 1: Intentar vender más de lo disponible**

```bash
# Backend endpoint
POST http://localhost:3000/api/ventas
Content-Type: application/json

{
  "id_cliente": 1,
  "id_empleado": 1,
  "detalles": [
    {
      "id_producto": 1,
      "cantidad": 9999,
      "precio_unitario": 10.00
    }
  ]
}

# Respuesta esperada:
❌ Error 500: Stock insuficiente para "Producto X". Stock disponible: 50, Cantidad solicitada: 9999
```

**Caso 2: Venta exitosa con stock suficiente**

```bash
POST http://localhost:3000/api/ventas
{
  "id_cliente": 1,
  "id_empleado": 1,
  "detalles": [
    {
      "id_producto": 1,
      "cantidad": 2,
      "precio_unitario": 10.00
    }
  ]
}

# Respuesta esperada:
✅ Status 201: Venta registrada exitosamente
# El stock se descuenta automáticamente por el Trigger 2
```

---

## 📊 API Endpoints

### Productos
- `GET /api/productos` - Listar todos
- `GET /api/productos/:id` - Obtener uno
- `POST /api/productos` - Crear
- `PUT /api/productos/:id` - Actualizar
- `DELETE /api/productos/:id` - Eliminar

### Ventas
- `GET /api/ventas` - Listar todas
- `GET /api/ventas/:id` - Obtener una
- `POST /api/ventas` - Crear (⚡ activa triggers)
- `GET /api/ventas/:id/detalles` - Detalles de venta

### Inventario
- `GET /api/inventario` - Listar todo
- `GET /api/inventario/bajo-stock` - Productos con stock bajo
- `PUT /api/inventario/:id` - Actualizar stock

### Clientes
- `GET /api/clientes` - Listar todos
- `POST /api/clientes` - Crear
- `PUT /api/clientes/:id` - Actualizar
- `DELETE /api/clientes/:id` - Eliminar

### Empleados
- `GET /api/empleados` - Listar todos
- `POST /api/empleados` - Crear
- `PUT /api/empleados/:id` - Actualizar
- `DELETE /api/empleados/:id` - Eliminar

### Proveedores
- `GET /api/proveedores` - Listar todos
- `POST /api/proveedores` - Crear
- `PUT /api/proveedores/:id` - Actualizar
- `DELETE /api/proveedores/:id` - Eliminar

---

## 🎓 Criterios de Evaluación Sprint 4

| Criterio | Estado | Detalle |
|----------|--------|---------|
| **Conexión Backend-DB** | ✅ CUMPLE | Node.js conectado a PostgreSQL usando `pg` |
| **CRUD Funcional** | ✅ CUMPLE | CRUD en 6 módulos principales |
| **Triggers PL/pgSQL (mín. 2)** | ✅ CUMPLE | 2 triggers implementados |
| **RAISE EXCEPTION si stock < 0** | ✅ CUMPLE | Trigger lanza excepción si no hay stock |
| **"Si no conecta, no cuenta"** | ✅ CUMPLE | Conexión verificable en `/api/health` |

---

## 🛠️ Scripts Disponibles

### Backend
```bash
npm start        # Iniciar servidor en producción
npm run dev      # Iniciar con nodemon (desarrollo)
npm run init-db  # Inicializar/resetear base de datos
```

### Frontend
```bash
npm run dev      # Servidor de desarrollo (HMR)
npm run build    # Build para producción
npm run preview  # Preview del build
```

---

## 📝 Verificación de Conexión

Para verificar que el backend está conectado a PostgreSQL:

```bash
# Endpoint de health check
GET http://localhost:3000/api/health

# Respuesta esperada:
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-01-10T12:00:00.000Z",
  "version": "PostgreSQL 15.x"
}
```

---

## 🎉 Resultado Final

✅ **Backend**: Node.js + Express conectado a PostgreSQL  
✅ **Frontend**: React + Vite integrado con el backend  
✅ **CRUD**: Implementado en 6 módulos  
✅ **Triggers**: 2 triggers funcionales con RAISE EXCEPTION  
✅ **Validación**: Stock controlado automáticamente  

**🏆 Sprint 4 COMPLETADO (40%)**

---

## 👥 Autor

Proyecto desarrollado para el Sprint 4 de Integración y Automatización.

## 📄 Licencia

ISC
