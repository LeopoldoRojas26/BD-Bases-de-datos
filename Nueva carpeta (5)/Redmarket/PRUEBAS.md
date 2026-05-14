# 🧪 Guía de Pruebas - Sistema CRUD con Triggers

## 📋 Índice
1. [Instalación y Configuración](#instalación)
2. [Pruebas con cURL](#pruebas-curl)
3. [Pruebas con Postman/Thunder Client](#pruebas-postman)
4. [Validación de Triggers](#validación-triggers)

---

## 1️⃣ Instalación y Configuración {#instalación}

### Paso 1: Instalar dependencias
```bash
npm install
```

### Paso 2: Configurar PostgreSQL
Crea el archivo `.env` con tus credenciales:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password_aqui
DB_NAME=tienda_db
PORT=3000
```

### Paso 3: Crear la base de datos
```sql
-- En PostgreSQL (psql o pgAdmin)
CREATE DATABASE tienda_db;
```

### Paso 4: Inicializar tablas y triggers
```bash
npm run init-db
```

Deberías ver:
```
✅ Tabla "productos" creada
✅ Tabla "ventas" creada
✅ Tabla "auditoria_stock" creada
✅ TRIGGER 1: "trigger_validar_stock" creado
✅ TRIGGER 2: "trigger_descontar_stock" creado
✅ Datos de prueba insertados
```

### Paso 5: Iniciar el servidor
```bash
npm start
```

---

## 2️⃣ Pruebas con cURL {#pruebas-curl}

### 🔍 Health Check
```bash
curl http://localhost:3000/api/health
```

### 📦 PRODUCTOS (CRUD completo)

#### CREATE - Crear producto
```bash
curl -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Audífonos Bluetooth",
    "precio": 45.99,
    "stock": 25
  }'
```

#### READ - Listar todos los productos
```bash
curl http://localhost:3000/api/productos
```

#### READ - Obtener un producto específico
```bash
curl http://localhost:3000/api/productos/1
```

#### UPDATE - Actualizar producto
```bash
curl -X PUT http://localhost:3000/api/productos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Laptop HP Actualizada",
    "precio": 1150.00,
    "stock": 8
  }'
```

#### DELETE - Eliminar producto
```bash
curl -X DELETE http://localhost:3000/api/productos/5
```

---

### 💰 VENTAS (Disparan Triggers)

#### CREATE - Crear venta exitosa (con stock suficiente)
```bash
# Venta de 2 Mouse Logitech (tiene 50 en stock)
curl -X POST http://localhost:3000/api/ventas \
  -H "Content-Type: application/json" \
  -d '{
    "producto_id": 2,
    "cantidad": 2
  }'
```

**Resultado esperado:**
- ✅ Venta creada
- ✅ Stock descontado automáticamente (50 → 48)
- ✅ Registro en auditoría

#### CREATE - Venta que FALLA por stock insuficiente
```bash
# Intentar vender 100 unidades cuando solo hay 48
curl -X POST http://localhost:3000/api/ventas \
  -H "Content-Type: application/json" \
  -d '{
    "producto_id": 2,
    "cantidad": 100
  }'
```

**Resultado esperado:**
```json
{
  "success": false,
  "error": "Stock insuficiente para el producto \"Mouse Logitech\" (ID: 2). Stock disponible: 48, Cantidad solicitada: 100",
  "info": "La transacción fue cancelada. No se realizaron cambios en la base de datos."
}
```

#### READ - Listar todas las ventas
```bash
curl http://localhost:3000/api/ventas
```

#### DELETE - Eliminar una venta
```bash
curl -X DELETE http://localhost:3000/api/ventas/1
```
*Nota: El stock NO se restaura automáticamente*

---

### 📊 AUDITORÍA

#### Ver todo el historial de cambios de stock
```bash
curl http://localhost:3000/api/auditoria
```

#### Ver historial de un producto específico
```bash
curl http://localhost:3000/api/auditoria/producto/2
```

---

## 3️⃣ Pruebas con Postman/Thunder Client {#pruebas-postman}

### Colección de Postman

#### 1. Health Check
- **Método:** GET
- **URL:** `http://localhost:3000/api/health`

#### 2. Crear Producto
- **Método:** POST
- **URL:** `http://localhost:3000/api/productos`
- **Body (JSON):**
```json
{
  "nombre": "Silla Gamer",
  "precio": 299.99,
  "stock": 12
}
```

#### 3. Crear Venta (OK)
- **Método:** POST
- **URL:** `http://localhost:3000/api/ventas`
- **Body (JSON):**
```json
{
  "producto_id": 1,
  "cantidad": 2
}
```

#### 4. Crear Venta (FAIL - Sin Stock)
- **Método:** POST
- **URL:** `http://localhost:3000/api/ventas`
- **Body (JSON):**
```json
{
  "producto_id": 5,
  "cantidad": 1
}
```
*El producto 5 tiene stock = 0*

---

## 4️⃣ Validación de Triggers {#validación-triggers}

### ✅ Verificar que los Triggers existen en PostgreSQL

Ejecuta en PostgreSQL (psql o pgAdmin):

```sql
-- Ver triggers creados
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table,
  action_timing
FROM information_schema.triggers
WHERE trigger_schema = 'public';
```

**Resultado esperado:**
| trigger_name | event_manipulation | event_object_table | action_timing |
|---|---|---|---|
| trigger_validar_stock | INSERT | ventas | BEFORE |
| trigger_descontar_stock | INSERT | ventas | AFTER |

---

### ✅ Prueba Manual en PostgreSQL

#### 1. Ver stock inicial
```sql
SELECT id, nombre, stock FROM productos WHERE id = 1;
```

#### 2. Crear una venta
```sql
INSERT INTO ventas (producto_id, cantidad, total)
VALUES (1, 3, 3600.00);
```

#### 3. Verificar que el stock se descontó
```sql
SELECT id, nombre, stock FROM productos WHERE id = 1;
```

#### 4. Ver auditoría
```sql
SELECT * FROM auditoria_stock WHERE producto_id = 1 ORDER BY fecha DESC LIMIT 1;
```

---

### ❌ Probar excepción de stock insuficiente

```sql
-- Producto con poco stock
SELECT id, nombre, stock FROM productos WHERE id = 4;

-- Intentar vender más de lo disponible
INSERT INTO ventas (producto_id, cantidad, total)
VALUES (4, 999, 999999.00);
```

**Resultado esperado:**
```
ERROR:  Stock insuficiente para el producto "Monitor Samsung 24"" (ID: 4). 
Stock disponible: 15, Cantidad solicitada: 999
```

---

## 📊 Escenarios de Prueba Completos

### Escenario 1: Flujo de venta exitoso
1. ✅ Crear producto con stock = 20
2. ✅ Crear venta de 5 unidades
3. ✅ Verificar stock = 15
4. ✅ Verificar registro en auditoría

### Escenario 2: Validación de stock insuficiente
1. ✅ Crear producto con stock = 3
2. ❌ Intentar venta de 10 unidades → ERROR
3. ✅ Verificar que stock sigue siendo 3 (no cambió)

### Escenario 3: Múltiples ventas
1. ✅ Producto con stock = 100
2. ✅ Venta 1: 20 unidades → stock = 80
3. ✅ Venta 2: 30 unidades → stock = 50
4. ✅ Venta 3: 50 unidades → stock = 0
5. ❌ Venta 4: 1 unidad → ERROR (sin stock)

---

## 🎯 Checklist de Cumplimiento Sprint 4

- ✅ **Conexión Backend–DB**: Node.js conecta a PostgreSQL
- ✅ **CRUD Completo**:
  - [x] CREATE (productos y ventas)
  - [x] READ (listar y obtener por ID)
  - [x] UPDATE (productos)
  - [x] DELETE (productos y ventas)
- ✅ **Trigger 1**: `trigger_validar_stock` - Valida stock antes de insertar venta
- ✅ **Trigger 2**: `trigger_descontar_stock` - Descuenta stock y audita
- ✅ **RAISE EXCEPTION**: Funciona correctamente cuando stock < 0
- ✅ **Transacciones**: Rollback automático en caso de error

---

## 🛠️ Comandos Útiles

```bash
# Reinstalar base de datos
npm run init-db

# Modo desarrollo con auto-reload
npm run dev

# Ver logs de PostgreSQL
# (depende de tu instalación)
tail -f /var/log/postgresql/postgresql-*.log
```

---

## 📧 Soporte

Si tienes problemas:
1. Verifica que PostgreSQL esté corriendo
2. Revisa las credenciales en `.env`
3. Ejecuta `npm run init-db` nuevamente
4. Verifica la conexión: `curl http://localhost:3000/api/health`
