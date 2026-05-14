# 🏪 RedMarket - Sistema Completo de Gestión

**Stack Tecnológico:**  
Frontend: React + Vite | Backend: Node.js + Express | Database: PostgreSQL

---

## ✅ Sprint 4 COMPLETADO (40%)

### Criterios de Evaluación Cumplidos:
1. ✅ **Conexión Backend–DB**: Node.js conectado a PostgreSQL
2. ✅ **CRUD Completo**: Implementado en 6 módulos (Productos, Ventas, Clientes, Empleados, Proveedores, Inventario)
3. ✅ **Triggers PL/pgSQL**: 2 triggers implementados
   - Trigger 1: Validar stock ANTES de venta
   - Trigger 2: Descontar stock DESPUÉS de venta
4. ✅ **RAISE EXCEPTION**: Si stock < cantidad → lanza excepción

---

## 🚀 Inicio Rápido (3 Comandos)

```bash
# 1. Instalar dependencias (backend + frontend)
npm run install-all

# 2. Configurar backend/.env con credenciales de PostgreSQL
#    Luego inicializar base de datos:
npm run init-db

# 3. Iniciar backend (una terminal)
npm run dev:backend

# 4. Iniciar frontend (OTRA terminal)
npm run dev:frontend
```

**📖 Guía detallada:** Ver [INICIO_RAPIDO.md](INICIO_RAPIDO.md)  
**📋 Documentación completa:** Ver [SPRINT4_README.md](SPRINT4_README.md)

---

## 📦 Estructura del Proyecto

```
Redmarket/
├── backend/              # Node.js + Express + PostgreSQL
│   ├── database/         # SQL (schema, seeds, triggers, views)
│   ├── src/
│   │   ├── config/       # Conexión PostgreSQL
│   │   ├── controllers/  # Lógica de negocio
│   │   ├── routes/       # API REST endpoints
│   │   └── index.js      # Servidor Express
│   └── package.json
│
├── frontend/             # React + Vite
│   ├── src/
│   │   ├── components/   # Componentes React (Dashboard, Productos, Ventas, etc.)
│   │   ├── services/     # API calls con Axios
│   │   ├── config/       # Configuración
│   │   └── App.jsx       # Router principal
│   └── package.json
│
├── INICIO_RAPIDO.md      # 🔥 Guía paso a paso
├── SPRINT4_README.md     # 📖 Documentación técnica
└── package.json          # Scripts raíz
```

---

## 🎯 Funcionalidades Principales

### Backend (Node.js + Express)
- ✅ API REST con 6 módulos CRUD
- ✅ Conexión a PostgreSQL con pg
- ✅ Triggers automáticos en PL/pgSQL
- ✅ Manejo de errores y validaciones
- ✅ CORS habilitado

### Frontend (React + Vite)
- ✅ Dashboard con estadísticas
- ✅ CRUD de Productos (crear, editar, eliminar)
- ✅ Registro de Ventas con validación de stock
- ✅ Control de Inventario con alertas
- ✅ Gestión de Clientes, Empleados y Proveedores
- ✅ React Router para navegación
- ✅ Diseño responsive

### Base de Datos (PostgreSQL)
- ✅ Schema normalizado (3NF)
- ✅ 2 Triggers en PL/pgSQL (Sprint 4)
- ✅ Vistas SQL para reportes
- ✅ Datos de prueba incluidos

---

## ⚡ Triggers Implementados

### Trigger 1: `validar_stock_antes_venta`
```sql
-- Valida stock ANTES de insertar venta
-- Si stock < cantidad → RAISE EXCEPTION
```
**Ejemplo de Error:**
```
❌ Stock insuficiente para "Laptop HP". 
   Stock disponible: 10, Cantidad solicitada: 20
```

### Trigger 2: `actualizar_inventario_post_venta`
```sql
-- Descuenta stock DESPUÉS de venta exitosa
-- stock_actual = stock_actual - cantidad_vendida
```

---

## 📊 Módulos del Sistema

| Módulo | Ruta Frontend | API Backend |
|--------|---------------|-------------|
| Dashboard | `/` | - |
| Productos | `/productos` | `/api/productos` |
| Ventas | `/ventas` | `/api/ventas` |
| Inventario | `/inventario` | `/api/inventario` |
| Clientes | `/clientes` | `/api/clientes` |
| Empleados | `/empleados` | `/api/empleados` |
| Proveedores | `/proveedores` | `/api/proveedores` |

---

## 🔧 Scripts Disponibles

### Raíz del Proyecto
```bash
npm run install-all    # Instalar todo (backend + frontend)
npm run init-db        # Inicializar base de datos
npm run dev:backend    # Iniciar backend en desarrollo
npm run dev:frontend   # Iniciar frontend en desarrollo
npm run build:frontend # Build de producción del frontend
```

### Backend Individual
```bash
cd backend
npm install           # Instalar dependencias
npm run init-db       # Inicializar DB
npm run dev           # Desarrollo (nodemon)
npm start             # Producción
```

### Frontend Individual
```bash
cd frontend
npm install           # Instalar dependencias
npm run dev           # Desarrollo (HMR)
npm run build         # Build para producción
npm run preview       # Preview del build
```

---

## 🌐 URLs de Acceso

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/api/health

---

## 🧪 Pruebas Manuales

### 1. Verificar Conexión Backend-DB
```bash
GET http://localhost:3000/api/health

# Respuesta esperada:
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-01-10T...",
  "version": "PostgreSQL 15.x"
}
```

### 2. Probar CRUD de Productos
```bash
# Listar productos
GET http://localhost:3000/api/productos

# Crear producto
POST http://localhost:3000/api/productos
{
  "nombre": "Laptop Dell",
  "precio": 899.99,
  "categoria": "Electrónica"
}
```

### 3. Probar Triggers (Venta con Stock Insuficiente)
```bash
POST http://localhost:3000/api/ventas
{
  "id_cliente": 1,
  "id_empleado": 1,
  "detalles": [{
    "id_producto": 1,
    "cantidad": 9999,
    "precio_unitario": 10.00
  }]
}

# Respuesta esperada:
❌ Error 500: Stock insuficiente...
```

---

## 📖 Documentación Completa

- **[INICIO_RAPIDO.md](INICIO_RAPIDO.md)** - Guía de instalación paso a paso
- **[SPRINT4_README.md](SPRINT4_README.md)** - Documentación técnica detallada
- **backend/.env.example** - Variables de entorno requeridas
- **frontend/.env.example** - Configuración del frontend

---

## 🛠️ Tecnologías

- **React** 19.2.5
- **Vite** 8.0.10
- **React Router** 7.15.0
- **Axios** 1.16.0
- **Node.js** 16+
- **Express** 4.18.2
- **PostgreSQL** 12+
- **pg** 8.11.3

---

## 📄 Licencia

ISC

---

## 🎓 Evaluación Sprint 4

| Criterio | Cumplimiento | Evidencia |
|----------|--------------|-----------|
| Conexión Backend-DB | ✅ 100% | `/api/health` muestra conexión |
| CRUD Funcional | ✅ 100% | 6 módulos con CRUD completo |
| 2 Triggers PL/pgSQL | ✅ 100% | Ver `backend/database/triggers.sql` |
| RAISE EXCEPTION | ✅ 100% | Error al intentar venta sin stock |

**Puntaje Total Sprint 4: 40% ✅**

---

**🎉 Sistema completo funcionando con React + Vite + Node.js + PostgreSQL + Triggers**
