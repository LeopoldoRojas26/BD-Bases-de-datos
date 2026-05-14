# 🚀 CONFIGURACIÓN RÁPIDA - Supabase

## ⚠️ Error Actual
```
ERROR: relation "ventas" does not exist
```

**Causa:** La tabla `ventas` no existe en Supabase (está vacía)

---

## ✅ SOLUCIÓN (3 pasos - 5 minutos)

### 📍 PASO 1: Obtener Connection String de Supabase

1. **Ir a tu proyecto en Supabase:** https://supabase.com
2. **Click en Settings ⚙️** (barra izquierda, abajo)
3. **Click en "Database"** (menú izquierdo)
4. **Scroll hasta "Connection String"**
5. **Seleccionar modo "URI"** (arriba)
6. **Copiar el string completo**

**Ejemplo de lo que verás:**
```
postgresql://postgres.vkxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

7. **Reemplazar `[YOUR-PASSWORD]`** con tu contraseña de Supabase

**Ejemplo final:**
```
postgresql://postgres.vkxxxxxxxxxxxx:MiPassword123@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

---

### 📍 PASO 2: Actualizar archivo .env

**El archivo ya está preparado.** Solo necesitas:

1. **Abrir:** `Redmarket\backend\.env`

2. **Buscar esta línea:**
```env
DATABASE_URL=postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-xxxxx.pooler.supabase.com:6543/postgres
```

3. **Reemplazar** con tu Connection String completo de Supabase

4. **Guardar** el archivo (Ctrl+S)

**Ejemplo de cómo debería quedar:**
```env
DATABASE_URL=postgresql://postgres.vkabcdefgh:MiPassword123@aws-0-us-east-1.pooler.supabase.com:6543/postgres
PORT=3000
```

---

### 📍 PASO 3: Ejecutar init-db

Ahora sí, ejecutar el script que creará TODO en Supabase:

```powershell
# En tu terminal de VS Code:
cd C:\Users\larv2\OneDrive\Desktop\Nueva carpeta (5)\Redmarket\backend

# Ejecutar el script de inicialización
npm run init-db
```

---

## ✅ Resultado Esperado

Deberías ver:

```
🌐 Usando DATABASE_URL (Supabase/Cloud)
🔧 Inicializando base de datos...

✅ Tabla "productos" creada
✅ Tabla "ventas" creada
✅ Tabla "auditoria_stock" creada
✅ TRIGGER 1: "trigger_validar_stock" creado (valida stock disponible)
✅ TRIGGER 2: "trigger_descontar_stock" creado (descuenta stock y audita)
✅ Datos de prueba insertados

🎉 Base de datos inicializada correctamente

📋 Resumen:
   - Tablas: productos, ventas, auditoria_stock
   - Triggers: trigger_validar_stock, trigger_descontar_stock
   - Datos de prueba: 5 productos
```

---

## 🔍 Verificar en Supabase

1. **Ir a Supabase** → Tu proyecto
2. **Click en "Table Editor"** (📋 icono en barra izquierda)
3. **Deberías ver 3 tablas:**
   - `productos` (con 5 productos)
   - `ventas` (vacía)
   - `auditoria_stock` (vacía)

---

## 🚀 Iniciar el Backend

Una vez completado:

```powershell
npm run dev
```

**Deberías ver:**
```
🌐 Usando DATABASE_URL (Supabase/Cloud)
✅ Conectado a PostgreSQL
🚀 Servidor corriendo en http://localhost:3000
```

**Verificar:** http://localhost:3000/api/health

**Debe mostrar:** `"database": "connected"` ✅

---

## 🐛 Si hay errores

### ❌ "password authentication failed"
**Solución:** Verifica que reemplazaste `[YOUR-PASSWORD]` con tu contraseña real

### ❌ "connection refused"
**Solución:** Copia nuevamente el Connection String de Supabase

### ❌ "database does not exist"
**Solución:** Asegúrate que el string termina en `/postgres`

---

## 📋 Checklist

- [ ] Connection String copiado de Supabase
- [ ] `[YOUR-PASSWORD]` reemplazado con contraseña real
- [ ] Archivo `.env` actualizado con DATABASE_URL
- [ ] Archivo `.env` guardado (Ctrl+S)
- [ ] Ejecutado `npm run init-db`
- [ ] Visto mensaje "Base de datos inicializada correctamente"
- [ ] Verificado 3 tablas en Supabase Table Editor
- [ ] Ejecutado `npm run dev`
- [ ] Verificado http://localhost:3000/api/health

---

## 🎉 Después de esto

Tu proyecto estará:
- ✅ Conectado a Supabase (cloud)
- ✅ Con las 3 tablas creadas
- ✅ Con los 2 triggers del Sprint 4
- ✅ Con datos de prueba
- ✅ Listo para usar

---

**🚀 Comienza con el PASO 1: Obtén tu Connection String de Supabase**
