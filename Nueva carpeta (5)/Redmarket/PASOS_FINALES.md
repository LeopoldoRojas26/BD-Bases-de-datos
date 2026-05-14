# 🎯 PASOS FINALES - RedMarket Sprint 4

## ✅ Lo que ya está hecho:
- ✅ Frontend React + Vite con 7 componentes
- ✅ Backend Node.js + Express listo
- ✅ `database.js` configurado para Supabase
- ✅ `init.js` deshabilitado (ya no ejecuta nada)
- ✅ **Triggers creados en: `TRIGGERS_SUPABASE.sql`** ← Basados en TU esquema

---

## 🚀 LO QUE TÚ DEBES HACER AHORA:

### 📋 PASO 1: Ejecutar tu SQL en Supabase (5 min)

1. **Abrir:** https://supabase.com → Tu proyecto "redmarket"
2. **Click:** "SQL Editor" (icono </> izquierda)
3. **Click:** "+ New query"
4. **Copiar y pegar:** El contenido de TU archivo SQL (el que me mostraste)
5. **Click:** "Run" ✅

**Resultado esperado:**
```
Success. No rows returned
```

---

### ⚡ PASO 2: Ejecutar los Triggers (2 min)

**Opción A - Archivo completo (recomendado):**
1. Abrir el archivo: **`TRIGGERS_SUPABASE.sql`**
2. Copiar TODO
3. Pegar en Supabase SQL Editor (nueva query)
4. Click "Run" ✅

**Opción B - Solo triggers (rápido):**
```sql
-- TRIGGER 1: VALIDAR STOCK
DROP TRIGGER IF EXISTS trigger_validar_stock_venta ON detalle_venta;
DROP FUNCTION IF EXISTS validar_stock_antes_venta();

CREATE OR REPLACE FUNCTION validar_stock_antes_venta()
RETURNS TRIGGER AS $$
DECLARE
  stock_disponible INTEGER;
  nombre_producto_var VARCHAR(150);
BEGIN
  SELECT 
    i.stock_actual,
    p.nombre
  INTO 
    stock_disponible,
    nombre_producto_var
  FROM inventario i
  INNER JOIN producto p ON p.id_producto = i.id_producto
  WHERE i.id_producto = NEW.id_producto;

  IF stock_disponible IS NULL THEN
    RAISE EXCEPTION 'ERROR: El producto ID % no existe en inventario', NEW.id_producto;
  END IF;

  IF stock_disponible < NEW.cantidad THEN
    RAISE EXCEPTION 'ERROR: Stock insuficiente para "%" (ID: %). Stock disponible: %, Cantidad solicitada: %',
      nombre_producto_var, 
      NEW.id_producto, 
      stock_disponible, 
      NEW.cantidad;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validar_stock_venta
BEFORE INSERT ON detalle_venta
FOR EACH ROW
EXECUTE FUNCTION validar_stock_antes_venta();

-- TRIGGER 2: DESCONTAR STOCK
DROP TRIGGER IF EXISTS trigger_descontar_stock_venta ON detalle_venta;
DROP FUNCTION IF EXISTS descontar_stock_despues_venta();

CREATE OR REPLACE FUNCTION descontar_stock_despues_venta()
RETURNS TRIGGER AS $$
DECLARE
  stock_anterior INTEGER;
  stock_nuevo INTEGER;
  nombre_producto_var VARCHAR(150);
BEGIN
  SELECT 
    i.stock_actual,
    p.nombre
  INTO 
    stock_anterior,
    nombre_producto_var
  FROM inventario i
  INNER JOIN producto p ON p.id_producto = i.id_producto
  WHERE i.id_producto = NEW.id_producto;

  UPDATE inventario
  SET 
    stock_actual = stock_actual - NEW.cantidad,
    ultima_actualizacion = CURRENT_TIMESTAMP
  WHERE id_producto = NEW.id_producto;

  SELECT stock_actual 
  INTO stock_nuevo
  FROM inventario
  WHERE id_producto = NEW.id_producto;

  IF stock_nuevo < 0 THEN
    RAISE EXCEPTION 'ERROR CRÍTICO: Stock negativo detectado (%). Producto: "%" (ID: %). Transacción cancelada.',
      stock_nuevo,
      nombre_producto_var,
      NEW.id_producto;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_descontar_stock_venta
AFTER INSERT ON detalle_venta
FOR EACH ROW
EXECUTE FUNCTION descontar_stock_despues_venta();
```

**Verificar que se crearon:**
```sql
SELECT 
  trigger_name, 
  event_object_table,
  action_timing
FROM information_schema.triggers
WHERE trigger_schema = 'public';
```

Deberías ver:
- `trigger_validar_stock_venta` → `detalle_venta` → `BEFORE`
- `trigger_descontar_stock_venta` → `detalle_venta` → `AFTER`

✅ **¡Sprint 4 completo!**

---

### 🔗 PASO 3: Conectar Backend (3 min)

#### 3.1 Obtener Connection String

1. Supabase → Settings → Database
2. Buscar **"Connection String"** en modo **"URI"**
3. Copiar (ejemplo):
   ```
   postgresql://postgres.abcdef:MI_PASSWORD@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   ```
4. ⚠️ **Reemplazar `[YOUR-PASSWORD]` con tu contraseña real**

#### 3.2 Configurar .env

Editar: `Redmarket/backend/.env`

```env
DATABASE_URL=postgresql://postgres.xxxxx:TU_PASSWORD_REAL@aws-0-xxxxx.pooler.supabase.com:6543/postgres
PORT=3000
```

⚠️ **NO dejar `[YOUR-PASSWORD]`, poner tu contraseña real**

#### 3.3 Iniciar Backend

```powershell
cd backend
npm run dev
```

**Salida esperada:**
```
🌐 Usando DATABASE_URL (Supabase/Cloud)
✅ Conectado a PostgreSQL
🚀 Servidor corriendo en http://localhost:3000
```

#### 3.4 Verificar conexión

Abrir en navegador: http://localhost:3000/api/health

**Debe mostrar:**
```json
{
  "status": "ok",
  "database": "connected"
}
```

✅ **¡Backend conectado!**

---

### 🎨 PASO 4: Iniciar Frontend (1 min)

**Abrir otra terminal PowerShell:**

```powershell
cd frontend
npm run dev
```

**Salida esperada:**
```
  VITE v8.0.10  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Abrir en navegador:** http://localhost:5173

✅ **¡Aplicación completa funcionando!**

---

## 🧪 PASO 5: Probar los Triggers

### Prueba 1: Venta exitosa ✅

1. **Frontend:** http://localhost:5173/ventas
2. Seleccionar un producto con stock
3. Cantidad: Menos del stock disponible
4. Click "Registrar Venta"

**Resultado esperado:**
- ✅ Venta registrada
- ✅ Stock descontado automáticamente
- ✅ Mensaje de éxito

### Prueba 2: Venta SIN stock ❌

1. **Frontend:** http://localhost:5173/ventas
2. Seleccionar un producto con stock bajo
3. Cantidad: MÁS del stock disponible
4. Click "Registrar Venta"

**Resultado esperado:**
- ❌ Error: "Stock insuficiente para..."
- ✅ Stock NO cambió
- ✅ Venta NO registrada

**Esto prueba que RAISE EXCEPTION funciona** ✅

---

## 📊 Verificación Sprint 4

| Requisito | Estado | Archivo/Evidencia |
|-----------|--------|-------------------|
| **Conexión Backend-DB** | ✅ | `database.js` + Supabase |
| **CRUD completo** | ✅ | 6 módulos (Productos, Ventas, Clientes, etc.) |
| **2 Triggers PL/pgSQL** | ✅ | `TRIGGERS_SUPABASE.sql` |
| **Trigger 1: BEFORE con RAISE EXCEPTION** | ✅ | `validar_stock_antes_venta()` |
| **Trigger 2: AFTER con RAISE EXCEPTION** | ✅ | `descontar_stock_despues_venta()` |
| **Documentación** | ✅ | 12+ archivos .md |

---

## 🆘 Solución de Problemas

### Error: "relation does not exist"
- ❌ No ejecutaste TU SQL en Supabase
- ✅ Ejecutar PASO 1 primero

### Error: "connection refused"
- ❌ `DATABASE_URL` incorrecta en `.env`
- ✅ Verificar contraseña y formato

### Error: "stock is not a column"
- ❌ Triggers antiguos (para `productos.stock`)
- ✅ Usar `TRIGGERS_SUPABASE.sql` (para `inventario.stock_actual`)

### Backend no conecta
- ❌ `.env` no tiene `DATABASE_URL`
- ✅ Ejecutar PASO 3.2

### Frontend muestra errores
- ❌ Backend no está corriendo
- ✅ Ejecutar PASO 3.3 primero

---

## 📚 Documentos de Referencia

| Documento | Propósito |
|-----------|-----------|
| `INDEX.md` | 📋 Navegación principal |
| `EJECUTAR_SQL_SUPABASE.md` | 🎯 Guía detallada SQL + Triggers |
| `TRIGGERS_SUPABASE.sql` | ⚡ Triggers listos para copiar |
| **`PASOS_FINALES.md`** | 🚀 **ESTE DOCUMENTO** (resumen) |
| `CONFIGURACION_SUPABASE.md` | 🔧 Setup completo Supabase |

---

## ✅ Checklist Final

- [ ] Ejecuté mi SQL en Supabase SQL Editor
- [ ] Ejecuté los triggers de `TRIGGERS_SUPABASE.sql`
- [ ] Verifiqué que los triggers se crearon (query de verificación)
- [ ] Agregué `DATABASE_URL` a `backend/.env`
- [ ] Backend inicia sin errores
- [ ] http://localhost:3000/api/health muestra "connected"
- [ ] Frontend inicia sin errores
- [ ] Probé venta exitosa (con stock)
- [ ] Probé venta rechazada (sin stock)
- [ ] RAISE EXCEPTION funciona correctamente

---

## 🎓 Para la Entrega Sprint 4

**Evidencias a mostrar:**

1. **Backend → DB:**
   - Screenshot de `npm run dev` mostrando "Conectado a PostgreSQL"
   - Screenshot de http://localhost:3000/api/health

2. **CRUD funcionando:**
   - Screenshots de cada módulo (Productos, Ventas, Clientes, etc.)
   - Captura de Red (F12) mostrando peticiones API

3. **Triggers con RAISE EXCEPTION:**
   - Query mostrando triggers creados:
     ```sql
     SELECT trigger_name, event_object_table, action_timing
     FROM information_schema.triggers
     WHERE trigger_schema = 'public';
     ```
   - Screenshot de venta rechazada por falta de stock (mensaje de error)
   - Screenshot de logs en terminal mostrando el RAISE EXCEPTION

4. **Código de Triggers:**
   - Mostrar contenido de `TRIGGERS_SUPABASE.sql`
   - Explicar: Trigger 1 (BEFORE + validación) y Trigger 2 (AFTER + descuento)

---

## 🚀 ¡Listo para comenzar!

**Empieza por PASO 1** → Ejecutar tu SQL en Supabase

**¿Dudas?** Revisa `EJECUTAR_SQL_SUPABASE.md` para más detalles.

**¡Éxito! 🎉**
